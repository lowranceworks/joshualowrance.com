interface AboutSectionProps {
  mode: "professional" | "personal";
}

function ProfessionalAbout() {
  return (
    <div className="flex flex-col gap-y-4 text-base leading-relaxed text-foreground">
      <p>
        DevOps Engineer building on Kubernetes and multi-cloud
        platforms to give teams fast, repeatable, and resilient
        systems.
      </p>
    </div>
  );
}

function PersonalAbout() {
  return (
    <p className="text-base leading-relaxed text-foreground">
      Husband. Father. Advocate for human flourishing and prosperity.
    </p>
  );
}

export default function AboutSection({ mode }: AboutSectionProps) {
  return (
    <section className="flex flex-col gap-y-4 md:flex-row md:gap-x-10">
      <div className="md:w-1/5">
        <h2 className="text-2xl font-semibold text-foreground">
          About
        </h2>
      </div>
      <div className="md:w-2/3">
        {mode === "professional" ? <ProfessionalAbout /> : <PersonalAbout />}
      </div>
    </section>
  );
}
