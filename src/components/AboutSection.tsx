interface AboutSectionProps {
  mode: "professional" | "personal";
}

function ProfessionalAbout() {
  return (
    <p className="text-base leading-relaxed text-foreground">
      DevOps Engineer building on Kubernetes, GitOps, and Google Cloud. I make
      infrastructure declarative, deployments boring, and systems that hold up
      when things go wrong.
    </p>
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
