"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import type { ContentItem } from "@/lib/content";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TopicBadge({
  topic,
  active,
  onClick,
}: {
  topic: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded border px-1.5 py-0.5 text-[0.65rem] transition-all duration-200 ${
        active
          ? "border-gold bg-gold/20 text-foreground"
          : "border-gold/20 text-muted-foreground hover:border-gold/40 hover:text-foreground/70"
      }`}
    >
      {topic}
    </button>
  );
}

function InlineTopicBadge({
  topic,
  highlighted,
}: {
  topic: string;
  highlighted: boolean;
}) {
  return (
    <span
      className={`rounded border px-1.5 py-0.5 text-[0.65rem] ${
        highlighted
          ? "border-gold bg-gold/20 text-foreground"
          : "border-gold/20 text-muted-foreground"
      }`}
    >
      {topic}
    </span>
  );
}

function Divider() {
  return (
    <div className="flex w-full items-center gap-x-4 text-gold">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="divider-ornament"
      >
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
        <circle cx="6" cy="6" r="2" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}

interface FilteredContentProps {
  posts: PostMeta[];
  projects: ContentItem[];
  notes: ContentItem[];
}

function hasMatchingTopics(
  itemTopics: string[],
  selectedTopics: Set<string>
): boolean {
  if (selectedTopics.size === 0) return true;
  return itemTopics.some((t) => selectedTopics.has(t));
}

export default function FilteredContent({
  posts,
  projects,
  notes,
}: FilteredContentProps) {
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(
    new Set()
  );

  const allTopics = useMemo(() => {
    const topicSet = new Set<string>();
    for (const p of posts) for (const t of p.topics) topicSet.add(t);
    for (const p of projects) for (const t of p.topics) topicSet.add(t);
    for (const n of notes) for (const t of n.topics) topicSet.add(t);
    return Array.from(topicSet).sort();
  }, [posts, projects, notes]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
  };

  const clearTopics = () => setSelectedTopics(new Set());

  const filteredPosts = posts.filter((p) =>
    hasMatchingTopics(p.topics, selectedTopics)
  );
  const filteredProjects = projects.filter((p) =>
    hasMatchingTopics(p.topics, selectedTopics)
  );
  const filteredNotes = notes.filter((n) =>
    hasMatchingTopics(n.topics, selectedTopics)
  );

  return (
    <>
      {/* Topic filter bar */}
      {allTopics.length > 0 && (
        <div className="animate-entrance flex flex-col gap-y-3" style={{ animationDelay: "450ms" }}>
          <div className="flex items-baseline gap-x-3">
            <span className="text-sm font-medium text-muted-foreground">
              Topics
            </span>
            {selectedTopics.size > 0 && (
              <button
                onClick={clearTopics}
                className="text-[0.65rem] text-gold hover:text-bronze transition-colors"
              >
                clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allTopics.map((topic) => (
              <TopicBadge
                key={topic}
                topic={topic}
                active={selectedTopics.has(topic)}
                onClick={() => toggleTopic(topic)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {filteredPosts.length > 0 && (
        <>
          <div className="animate-entrance" style={{ animationDelay: "500ms" }}>
            <Divider />
          </div>
          <section
            className="animate-entrance flex flex-col gap-y-4 md:flex-row md:gap-x-10"
            style={{ animationDelay: "550ms" }}
          >
            <div className="md:w-1/5">
              <h2 className="text-2xl font-semibold text-foreground">Posts</h2>
            </div>
            <div className="flex flex-col gap-y-1 md:w-2/3">
              {filteredPosts.map((post) => (
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
                        <InlineTopicBadge
                          key={topic}
                          topic={topic}
                          highlighted={selectedTopics.has(topic)}
                        />
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Projects */}
      {filteredProjects.length > 0 && (
        <>
          <div className="animate-entrance" style={{ animationDelay: "600ms" }}>
            <Divider />
          </div>
          <section
            className="animate-entrance flex flex-col gap-y-4 md:flex-row md:gap-x-10"
            style={{ animationDelay: "650ms" }}
          >
            <div className="md:w-1/5">
              <h2 className="text-2xl font-semibold text-foreground">
                Projects
              </h2>
            </div>
            <div className="flex flex-col gap-y-1 md:w-2/3">
              {filteredProjects.map((project) => (
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
                        <InlineTopicBadge
                          key={topic}
                          topic={topic}
                          highlighted={selectedTopics.has(topic)}
                        />
                      ))}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Notes */}
      {filteredNotes.length > 0 && (
        <>
          <div className="animate-entrance" style={{ animationDelay: "700ms" }}>
            <Divider />
          </div>
          <section
            className="animate-entrance flex flex-col gap-y-4 md:flex-row md:gap-x-10"
            style={{ animationDelay: "750ms" }}
          >
            <div className="md:w-1/5">
              <h2 className="text-2xl font-semibold text-foreground">Notes</h2>
            </div>
            <div className="flex flex-col gap-y-1 md:w-2/3">
              {filteredNotes.map((note) => (
                <a
                  key={note.slug}
                  href={note.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="post-card group flex flex-col gap-y-1"
                >
                  <span className="illuminated-link text-base text-foreground">
                    {note.title}
                  </span>
                  {note.description && (
                    <span className="text-sm text-muted-foreground">
                      {note.description}
                    </span>
                  )}
                  {note.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {note.topics.map((topic) => (
                        <InlineTopicBadge
                          key={topic}
                          topic={topic}
                          highlighted={selectedTopics.has(topic)}
                        />
                      ))}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Empty state when filter matches nothing */}
      {selectedTopics.size > 0 &&
        filteredPosts.length === 0 &&
        filteredProjects.length === 0 &&
        filteredNotes.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No results for the selected topics.{" "}
            <button
              onClick={clearTopics}
              className="text-gold hover:text-bronze transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
    </>
  );
}
