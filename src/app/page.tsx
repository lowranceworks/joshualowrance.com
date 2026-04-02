import ProfilePhoto from "@/components/ProfilePhoto";
import AboutSection from "@/components/AboutSection";
import FilteredContent from "@/components/FilteredContent";
import Divider from "@/components/Divider";
import { getAllPosts, type Mode } from "@/lib/posts";
import { getAllProjects, getAllNotes } from "@/lib/content";

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

      <FilteredContent
        posts={getAllPosts(mode)}
        projects={mode === "professional" ? getAllProjects() : []}
        notes={mode === "professional" ? getAllNotes() : []}
      />
    </div>
  );
}
