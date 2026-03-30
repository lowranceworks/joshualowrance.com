import ProfilePhoto from "@/components/ProfilePhoto";
import AboutSection from "@/components/AboutSection";
import PostsSection from "@/components/PostsSection";
import Divider from "@/components/Divider";
import type { Mode } from "@/lib/posts";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode: modeParam } = await searchParams;
  const mode: Mode = modeParam === "professional" ? "professional" : "personal";

  return (
    <div className="flex w-full flex-col gap-y-10">
      {/* Profile */}
      <section className="flex flex-col items-center gap-y-4">
        <ProfilePhoto />
        <h1 className="font-[family-name:var(--font-cormorant-garamond)] text-5xl font-semibold tracking-wide text-foreground">
          Joshua Lowrance
        </h1>
      </section>

      <Divider />

      <AboutSection mode={mode} />

      <Divider />

      <PostsSection mode={mode} />
    </div>
  );
}
