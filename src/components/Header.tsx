import { Suspense } from "react";
import ModeToggle from "./ModeToggle";

export default function Header() {
  return (
    <header className="mb-12 flex w-full flex-wrap pb-3 text-sm sm:flex-nowrap">
      <nav
        className="relative mx-auto flex w-full items-center justify-between"
        aria-label="global"
      >
        {/* Left */}
        <div className="z-10 flex flex-1 items-center justify-start pb-8">
          <a
            href="/"
            className="font-[family-name:var(--font-cormorant-garamond)] text-[1.25rem] font-medium transition-colors hover:text-gold"
          >
            Home
          </a>
        </div>

        {/* Center */}
        <div className="z-0 flex w-full justify-center pb-8">
          <Suspense fallback={null}>
            <ModeToggle />
          </Suspense>
        </div>

        {/* Right */}
        <div className="z-10 flex flex-1 flex-row items-center justify-end gap-x-6 pb-8 sm:gap-x-8" />
      </nav>
    </header>
  );
}
