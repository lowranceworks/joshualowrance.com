interface AboutSectionProps {
  mode: "professional" | "personal";
}

const content = {
  professional:
    "DevOps Engineer. Building reliable systems and automating everything.",
  personal: "Exploring ideas, one project at a time.",
};

export default function AboutSection({ mode }: AboutSectionProps) {
  return (
    <section className="flex flex-col gap-y-4 md:flex-row md:gap-x-10">
      <div className="md:w-1/5">
        <h2 className="font-cormorant text-2xl font-semibold text-foreground">
          About
        </h2>
      </div>
      <div className="md:w-2/3">
        <p className="font-garamond text-xl leading-loose text-foreground">
          {content[mode]}
        </p>
      </div>
    </section>
  );
}
