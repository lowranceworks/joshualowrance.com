import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import PostBody from "./PostBody";
import ModeHint from "@/components/ModeHint";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — Joshua Lowrance`,
    description: post.description ?? "",
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const backHref = post.mode === "personal" ? "/?mode=personal" : "/";

  return (
    <article className="flex w-full flex-col gap-y-8">
      <ModeHint mode={post.mode ?? "professional"} />
      <Link
        href={backHref}
        className="illuminated-link text-sm text-muted-foreground"
      >
        &larr; Back
      </Link>

      <header className="flex flex-col gap-y-2">
        <h1 className="text-3xl font-semibold tracking-wide text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center gap-x-3 text-sm text-muted-foreground">
          <time dateTime={post.date}>{formattedDate}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <div className="h-px w-full bg-gradient-to-r from-gold/40 via-gold/20 to-transparent" />

      <PostBody content={post.content} />
    </article>
  );
}
