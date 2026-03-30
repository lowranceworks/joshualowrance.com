"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Mode = "professional" | "personal";

export default function ModeToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("personal");

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "professional" || urlMode === "personal") {
      setMode(urlMode);
    }
  }, [searchParams]);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "professional") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    document.dispatchEvent(
      new CustomEvent("theme-change", {
        detail: { theme: mode === "professional" ? "dark" : "light", mode },
      })
    );
  }, [mode]);

  const toggle = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      const params = new URLSearchParams(searchParams.toString());
      if (newMode === "personal") {
        params.delete("mode");
      } else {
        params.set("mode", newMode);
      }
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "/", { scroll: false });
    },
    [searchParams, router]
  );

  return (
    <div className="flex items-center gap-3">
      {/* Left ornament — animated */}
      <div className="hidden h-6 w-6 sm:block">
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-gold">
          {/* Outer ring — slow spin */}
          <g className="origin-center animate-whirl-slow">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <path d="M 12 1 A 11 11 0 0 1 23 12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          </g>
          {/* Inner ring — medium, reverse */}
          <g className="origin-center animate-whirl-medium">
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
            <path d="M 12 5 A 7 7 0 0 1 19 12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          </g>
          {/* Center dot */}
          <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.7" />
        </svg>
      </div>

      {/* Toggle track */}
      <div
        className="relative flex h-9 items-center rounded-full border border-gold/30 bg-card"
        role="radiogroup"
        aria-label="Site mode"
      >
        {/* Sliding indicator */}
        <div
          className={`absolute top-0.5 bottom-0.5 w-1/2 rounded-full bg-gold/15 transition-transform duration-300 ease-in-out ${
            mode === "personal"
              ? "translate-x-[calc(100%-4px)]"
              : "translate-x-0.5"
          }`}
        />

        <button
          onClick={() => toggle("professional")}
          className={`relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            mode === "professional"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/70"
          }`}
          role="radio"
          aria-checked={mode === "professional"}
        >
          <span>&#x2699;</span>
          <span className="hidden sm:inline">Professional</span>
        </button>

        <button
          onClick={() => toggle("personal")}
          className={`relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            mode === "personal"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/70"
          }`}
          role="radio"
          aria-checked={mode === "personal"}
        >
          <span>&#x2726;</span>
          <span className="hidden sm:inline">Personal</span>
        </button>
      </div>

      {/* Right ornament — animated, opposite direction */}
      <div className="hidden h-6 w-6 sm:block">
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-gold">
          {/* Outer ring — slow spin, reversed from left */}
          <g className="origin-center animate-whirl-medium">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <path d="M 12 23 A 11 11 0 0 1 1 12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          </g>
          {/* Inner ring — fast */}
          <g className="origin-center animate-whirl-fast">
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
            <path d="M 19 12 A 7 7 0 0 1 12 19" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          </g>
          {/* Center dot */}
          <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.7" />
        </svg>
      </div>
    </div>
  );
}
