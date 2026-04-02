"use client";

import { useEffect } from "react";

/**
 * Emits a "mode-hint" custom event on mount so the ModeToggle
 * can reflect the correct mode on non-home pages (e.g. post pages).
 */
export default function ModeHint({ mode }: { mode: string }) {
  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent("mode-hint", { detail: { mode } })
    );
  }, [mode]);

  return null;
}
