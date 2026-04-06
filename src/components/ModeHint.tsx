/**
 * Server component that hints the content mode to the ModeToggle.
 *
 * Renders a small inline <script> that sets data-content-mode on <html>
 * synchronously during page load — before React hydrates. This ensures
 * ModeToggle reads the correct mode on first render, even on a hard
 * refresh where there's no ?mode= search param in the URL.
 *
 * Also emits a "mode-hint" custom event for client-side navigations.
 */
export default function ModeHint({ mode }: { mode: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          document.documentElement.setAttribute("data-content-mode", ${JSON.stringify(mode)});
          document.dispatchEvent(new CustomEvent("mode-hint", { detail: { mode: ${JSON.stringify(mode)} } }));
        `,
      }}
    />
  );
}
