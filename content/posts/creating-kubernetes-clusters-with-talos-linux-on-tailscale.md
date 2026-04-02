---
title: "Creating Kubernetes Clusters With Talos Linux on Tailscale"
date: "2026-04-01"
description: "How I manage multiple Talos Kubernetes clusters across organizations with encrypted configs, Tailscale networking, and a reproducible Git workflow."
mode: professional
topics: ["kubernetes", "talos", "tailscale", "homelab", "sops"]
---

## An Operating System You Can't Log Into

Most Linux distributions give you a shell, a package manager, and a hundred ways to drift from the configuration you intended. [Talos Linux](https://www.talos.dev/) takes the opposite approach -- it ships just enough OS to run Kubernetes, and nothing else. There's no SSH. No shell. No way to log in. Every interaction happens through the Talos API using `talosctl`, and the entire system state is defined by a declarative machine configuration. If you've ever spent an evening debugging a node that someone `apt-get`'d into an unexpected state, you'll appreciate the appeal.

I run multiple Talos clusters on [Proxmox](https://www.proxmox.com/) VMs across different organizations and lifecycles, all connected over [Tailscale](https://tailscale.com). The entire configuration -- encrypted secrets included -- lives in a public Git repository at [github.com/lowranceworks/talos-clusters](https://github.com/lowranceworks/talos-clusters). This post walks through *how* that setup works and *why* I made the decisions I did.

## Why Talos

Kubernetes already wants to be the source of truth for your workloads. Talos extends that philosophy to the operating system itself. There's no configuration drift because there's nothing to drift -- the machine config is applied through the API and the OS enforces it. Updates are atomic image-based swaps, not package upgrades. The attack surface is minimal because there's no shell, no SSH daemon, and no unnecessary services running.

For a homelab, this means I can tear down a node and rebuild it from the same config file with confidence that it will come back identical. For anything resembling production, it means one less layer to worry about when something goes wrong at 2am.

## Cluster Architecture

I organize clusters by infrastructure provider, organization, and lifecycle:

```
proxmox-homelab/{org}/{lifecycle}/{purpose}-cluster/
```

In practice, that looks like this:

```
proxmox-homelab/
├── lawnops/
│   ├── dev/
│   │   └── lawnops-cluster/
│   └── prod/
│       └── platform-cluster/
└── lowranceworks/
    └── prod/
        └── personal-cluster/
```

Each cluster directory is self-contained -- it holds the machine configs, node-specific patches, Tailscale patches, secrets, and client configs (`kubeconfig`, `talosconfig`). I use [direnv](https://direnv.net/) with an `.env` file per cluster to automatically set `TALOSCONFIG` and `KUBECONFIG` when I `cd` into a directory. No juggling context switches, no accidentally applying a config to the wrong cluster.

## Getting Tailscale Onto Every Node

Talos doesn't have a package manager, so you can't just install Tailscale after the fact. Instead, you build a custom image through the [Talos Factory](https://factory.talos.dev/) that includes the extensions you need baked into the OS. For my clusters, the image includes:

- **siderolabs/tailscale** -- connects each node to my Tailnet
- **siderolabs/iscsi-tools** -- required for [Longhorn](https://longhorn.io) persistent storage
- **siderolabs/util-linux-tools** -- also required for Longhorn
- **siderolabs/qemu-guest-agent** -- so Proxmox can see hostname and IP information for each VM

The factory produces a schematic ID that you use to construct an installer image URL:

```
factory.talos.dev/installer/<schematic-id>:<talos-version>
```

This URL gets passed to `talosctl gen config` so that every node installs from the custom image rather than the stock Talos ISO.

To actually authenticate nodes into the Tailnet, I use a small patch file that configures the Tailscale extension with an auth key:

```yaml
apiVersion: v1alpha1
kind: ExtensionServiceConfig
name: tailscale
environment:
  - TS_AUTHKEY=tskey-auth-<your-key-here>
```

Once a node boots with this config applied, it registers itself with Tailscale automatically. Within a couple of minutes, it appears in the admin console and is reachable via [Magic DNS](https://tailscale.com/kb/1081/magicdns) from anywhere on the Tailnet.

## The Configuration Workflow

Talos configuration follows a pattern: generate base configs, then layer on per-node patches at apply time. This keeps the base `controlplane.yaml` and `worker.yaml` files generic while small patch files handle the specifics.

### Generate base configs

```bash
talosctl gen config <cluster-name> https://<endpoint>:6443 \
  --install-image factory.talos.dev/installer/<schematic-id>:<version> \
  --output-dir .
```

This produces three files: `controlplane.yaml`, `worker.yaml`, and `talosconfig`.

### Create per-node patches

Each node gets a patch file with its hostname and static IP. Here's what a control plane patch looks like:

```yaml
machine:
  network:
    hostname: personal-cp-01
    interfaces:
      - interface: eth0
        addresses:
          - 192.168.1.140/24
        routes:
          - network: 0.0.0.0/0
            gateway: 192.168.1.254
        dhcp: false
```

Worker patches look similar but add the Longhorn mount that worker nodes need for persistent storage:

```yaml
machine:
  network:
    hostname: personal-worker-01
    interfaces:
      - interface: eth0
        addresses:
          - 192.168.1.141/24
        routes:
          - network: 0.0.0.0/0
            gateway: 192.168.1.254
        dhcp: false
  kubelet:
    extraMounts:
      - destination: /var/lib/longhorn
        type: bind
        source: /var/lib/longhorn
        options:
          - bind
          - rshared
          - rw
```

### Apply configs with patches

The `apply-config` command merges the base config with any number of patch files in a single step:

```bash
talosctl apply-config \
  --nodes $CONTROLPLANE_01_IP \
  --file controlplane.yaml \
  --config-patch @controlplane-01.patch.yaml \
  --config-patch @tailscale.patch.yaml \
  --insecure
```

The `--insecure` flag is only needed the first time you apply to a node in maintenance mode -- before it has an established trust relationship with your `talosconfig`. After that initial apply, the node reboots with its new static IP, joins the Tailnet, and all subsequent commands go through authenticated TLS.

## Bootstrapping the Cluster

With configs applied, bootstrapping Kubernetes is a single command run against the first control plane node:

```bash
talosctl bootstrap \
  --nodes $CONTROLPLANE_01_IP \
  --endpoints $CONTROLPLANE_01_IP
```

This initializes etcd and brings the Kubernetes control plane online. It only runs once, on one node -- running it again will fail. After bootstrap completes, grab the kubeconfig:

```bash
talosctl kubeconfig \
  --nodes $CONTROLPLANE_01_IP \
  --endpoints $CONTROLPLANE_01_IP \
  -f .
```

Since `KUBECONFIG` is already pointing to `./kubeconfig` via direnv, `kubectl` picks it up immediately:

```
kubectl get nodes
NAME                    STATUS   ROLES           AGE   VERSION
personal-cp-01          Ready    control-plane   10m   v1.32.0
personal-worker-01      Ready    <none>          8m    v1.32.0
personal-worker-02      Ready    <none>          8m    v1.32.0
personal-worker-03      Ready    <none>          8m    v1.32.0
```

## Secrets Management With SOPS

Here's the tension: I want this repository to be public so others can reference the patterns, but the config files contain cluster secrets, certificates, and a Tailscale auth key. Committing plaintext secrets to a public repo is obviously a non-starter.

I use [SOPS](https://github.com/getsops/sops) with GPG for selective encryption. Rather than encrypting entire files, SOPS encrypts only the sensitive *values* while leaving keys, comments, and structural information readable. An encrypted `controlplane.enc.yaml` still shows you the shape of the config -- hostnames, cluster names, API server addresses -- but all the secrets are opaque.

The naming convention is straightforward:

- `controlplane.yaml` (decrypted, gitignored) becomes `controlplane.enc.yaml` (encrypted, committed)
- `kubeconfig` (decrypted, gitignored) becomes `kubeconfig.enc` (encrypted, committed)

A [Taskfile](https://taskfile.dev/) handles the encrypt/decrypt lifecycle across all clusters:

```bash
# Decrypt everything for local work
task decrypt:all

# Re-encrypt before committing
task encrypt:all

# Check what's encrypted and what isn't
task status

# Validate all encrypted files can be decrypted
task validate
```

I also run [pre-commit](https://pre-commit.com/) hooks to catch any accidental plaintext commits before they reach the remote.

## What's Next

With the clusters running and reachable over Tailscale, the foundation is in place. The next steps are Longhorn for persistent storage, an ingress controller, and then actually running workloads. The cluster configs will keep evolving -- upgrades, new extensions, new clusters -- and it all flows through the same Git workflow: decrypt, modify, encrypt, commit.

If you're considering Talos for your own homelab or side project, I'd encourage you to give it a shot. The learning curve is real -- especially if you're used to SSH'ing into nodes -- but the payoff is a cluster that's genuinely reproducible from a handful of config files.

---

*The full configuration, including encrypted secrets and Taskfile automation, is available at [github.com/lowranceworks/talos-clusters](https://github.com/lowranceworks/talos-clusters).*
