"use client";

import Image from "next/image";

export default function ProfilePhoto() {
  return (
    <div className="group relative h-48 w-48 cursor-pointer">
      {/* Animated orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="absolute h-full w-full">
          {/* Outer ring - slow */}
          <g className="origin-center animate-whirl-slow group-hover:[animation-play-state:paused]">
            <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold opacity-40" />
            <path d="M 100 5 A 95 95 0 0 1 195 100" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold opacity-70" />
            <path d="M 195 100 A 95 95 0 0 1 100 195" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold opacity-50" />
          </g>
          {/* Middle ring - medium, reverse */}
          <g className="origin-center animate-whirl-medium group-hover:[animation-play-state:paused]">
            <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-bronze opacity-30" />
            <path d="M 100 12 A 88 88 0 0 1 188 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bronze opacity-60" />
            <path d="M 12 100 A 88 88 0 0 1 100 12" fill="none" stroke="currentColor" strokeWidth="1" className="text-bronze opacity-40" />
          </g>
          {/* Inner ring - fast */}
          <g className="origin-center animate-whirl-fast group-hover:[animation-play-state:paused]">
            <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold opacity-20" />
            <path d="M 100 18 A 82 82 0 0 1 150 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gold opacity-60" />
            <path d="M 182 100 A 82 82 0 0 1 170 150" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gold opacity-60" />
            <path d="M 100 182 A 82 82 0 0 1 50 170" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gold opacity-60" />
            <path d="M 18 100 A 82 82 0 0 1 30 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gold opacity-60" />
          </g>
        </svg>
      </div>

      {/* Profile photos - swap based on mode */}
      <div className="relative flex h-full w-full items-center justify-center p-3">
        <div className="h-full w-full overflow-hidden rounded-full warm-shadow-lg">
          <Image
            src="/images/personal.jpeg"
            alt="Joshua Lowrance"
            width={400}
            height={400}
            className="block h-full w-full object-cover dark:hidden"
            priority
          />
          <Image
            src="/images/professional.jpeg"
            alt="Joshua Lowrance"
            width={400}
            height={400}
            className="hidden h-full w-full object-cover dark:block"
            priority
          />
        </div>
      </div>
    </div>
  );
}
