import ProfilePhoto from "@/components/ProfilePhoto";
import AboutSection from "@/components/AboutSection";
import PostsSection from "@/components/PostsSection";
import ProjectsSection from "@/components/ProjectsSection";
import NotesSection from "@/components/NotesSection";
import Divider from "@/components/Divider";
import type { Mode } from "@/lib/posts";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode: modeParam } = await searchParams;
  const mode: Mode = modeParam === "personal" ? "personal" : "professional";

  return (
    <div className="flex w-full flex-col gap-y-10">
      {/* Profile */}
      <section
        className="animate-entrance flex flex-col items-center gap-y-4"
      >
        <ProfilePhoto />
        <h1 className="breathe-glow text-5xl font-semibold tracking-wide text-foreground">
          Joshua Lowrance
        </h1>
      </section>

      <div className="animate-entrance" style={{ animationDelay: "150ms" }}>
        <Divider />
      </div>

      <div className="animate-entrance" style={{ animationDelay: "250ms" }}>
        <AboutSection mode={mode} />
      </div>

      <div className="animate-entrance" style={{ animationDelay: "350ms" }}>
        <Divider />
      </div>

      <div className="animate-entrance" style={{ animationDelay: "450ms" }}>
        <PostsSection mode={mode} />
      </div>

      {mode === "professional" && (
        <>
          <div className="animate-entrance" style={{ animationDelay: "550ms" }}>
            <Divider />
          </div>

          <div className="animate-entrance" style={{ animationDelay: "650ms" }}>
            <ProjectsSection />
          </div>

          <div className="animate-entrance" style={{ animationDelay: "750ms" }}>
            <Divider />
          </div>

          <div className="animate-entrance" style={{ animationDelay: "850ms" }}>
            <NotesSection />
          </div>
        </>
      )}
    </div>
  );
}
