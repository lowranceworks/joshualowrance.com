# Development

## Prerequisites

- Node.js 22+
- npm
- Podman (for container testing)

## Local Development

```sh
npm install
npm run dev
```

The site runs at `http://localhost:3000`. Mode toggle uses the `?mode=professional` query parameter.

## Adding Posts

Drop a `.md` file in `content/posts/` with frontmatter:

```yaml
---
title: "Post Title"
date: "2026-03-30"
description: "Optional summary"
mode: personal # or professional, omit to show in both
---
```

The filename becomes the URL slug (`my-post.md` → `/posts/my-post`).

## Lint & Type-check

```sh
npm run lint
npx tsc --noEmit
```

## Container Build & Test

Build the image:

```sh
podman build -f Containerfile -t localhost/joshualowrance.com:latest .
```

Start the pod:

```sh
podman play kube k8s/pod.yaml
```

Verify at `http://localhost:3000`, then tear down:

```sh
podman play kube --down k8s/pod.yaml
```

## CI/CD

| Workflow | Trigger | What it does |
|---|---|---|
| `ci.yaml` | PR to `main`/`dev` | Type-check, lint, build |
| `publish.yaml` | Push to `main` | Podman build → pod smoke test → push to GHCR |

## Project Structure

```
content/posts/       # Markdown blog posts
k8s/                 # Kubernetes manifests
  pod.yaml           # Local testing (podman play kube)
  deployment.yaml    # Production deployment
  service.yaml       # ClusterIP service
src/
  app/               # Next.js App Router pages
  components/        # React components
  lib/posts.ts       # Markdown parsing utilities
public/images/       # Profile photos
Containerfile        # Multi-stage container build
```
