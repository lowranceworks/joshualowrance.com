import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type Mode = "personal" | "professional";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
  mode?: Mode;
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

function parsePost(filename: string): PostMeta & { content: string } {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description,
    mode: data.mode,
    readingTime: stats.text,
    content,
  };
}

/**
 * Get all posts, optionally filtered by mode.
 * Posts without a mode are shown in both modes.
 */
export function getAllPosts(mode?: Mode): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"));

  const posts = filenames.map((filename) => {
    const { content: _, ...meta } = parsePost(filename);
    return meta;
  });

  const filtered = mode
    ? posts.filter((p) => !p.mode || p.mode === mode)
    : posts;

  return filtered.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  return parsePost(`${slug}.md`);
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
