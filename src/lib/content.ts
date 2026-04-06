import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ContentItem {
  slug: string;
  title: string;
  description?: string;
  url: string;
  topics: string[];
}

function parseContentItem(
  directory: string,
  filename: string
): ContentItem {
  const slug = filename.replace(/\.md$/, "");
  const filePath = path.join(directory, filename);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description,
    url: data.url ?? "",
    topics: data.topics ?? [],
  };
}

function getAllContentItems(directory: string): ContentItem[] {
  if (!fs.existsSync(directory)) return [];

  const filenames = fs
    .readdirSync(directory)
    .filter((f) => f.endsWith(".md"));

  return filenames
    .map((filename) => parseContentItem(directory, filename))
    .sort((a, b) => a.title.localeCompare(b.title));
}

const notesDirectory = path.join(process.cwd(), "content/notes");
const projectsDirectory = path.join(process.cwd(), "content/projects");

export function getAllNotes(): ContentItem[] {
  return getAllContentItems(notesDirectory);
}

export function getAllProjects(): ContentItem[] {
  return getAllContentItems(projectsDirectory);
}
