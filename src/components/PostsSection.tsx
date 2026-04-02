import Link from "next/link";
import { getAllPosts, type Mode } from "@/lib/posts";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface PostsSectionProps {
  mode: Mode;
}

export default function PostsSection({ mode }: PostsSectionProps) {
  const posts = getAllPosts(mode);

  if (posts.length === 0) return null;

  return (
    <section className="flex flex-col gap-y-4 md:flex-row md:gap-x-10">
      <div className="md:w-1/5">
        <h2 className="text-2xl font-semibold text-foreground">
          Posts
        </h2>
      </div>
      <div className="flex flex-col gap-y-1 md:w-2/3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="post-card group flex flex-col gap-y-1"
          >
            <div className="flex items-baseline gap-x-2">
              <span className="illuminated-link text-base text-foreground">
                {post.title}
              </span>
              <span className="text-sm text-muted-foreground">
                · {post.readingTime}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDate(post.date)}
            </span>
            {post.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded border border-gold/20 px-1.5 py-0.5 text-[0.65rem] text-muted-foreground"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
