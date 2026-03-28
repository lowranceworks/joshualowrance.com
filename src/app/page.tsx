import ProfilePhoto from "@/components/ProfilePhoto";
import AboutSection from "@/components/AboutSection";
import Divider from "@/components/Divider";

export default function Home() {
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

      <AboutSection mode="personal" />
    </div>
  );
}
