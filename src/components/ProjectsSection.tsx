import { getAllProjects } from "@/lib/content";

export default function ProjectsSection() {
  const projects = getAllProjects();

  if (projects.length === 0) return null;

  return (
    <section className="flex flex-col gap-y-4 md:flex-row md:gap-x-10">
      <div className="md:w-1/5">
        <h2 className="text-2xl font-semibold text-foreground">Projects</h2>
      </div>
      <div className="flex flex-col gap-y-1 md:w-2/3">
        {projects.map((project) => (
          <a
            key={project.slug}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="post-card group flex flex-col gap-y-1"
          >
            <span className="illuminated-link text-base text-foreground">
              {project.title}
            </span>
            {project.description && (
              <span className="text-sm text-muted-foreground">
                {project.description}
              </span>
            )}
            {project.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded border border-gold/20 px-1.5 py-0.5 text-[0.65rem] text-muted-foreground"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
