"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

function subscribeToTheme(callback: () => void) {
  document.addEventListener("theme-change", callback);
  return () => document.removeEventListener("theme-change", callback);
}

function getFlipped() {
  return document.documentElement.classList.contains("dark");
}

function getServerFlipped() {
  return false;
}

export default function ProfilePhoto() {
  const flipped = useSyncExternalStore(subscribeToTheme, getFlipped, getServerFlipped);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setHasInitialized(true));
  }, []);

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

      {/* Coin-flip photo container */}
      <div className="relative flex h-full w-full items-center justify-center p-3">
        <div
          className="coin-flip relative h-full w-full"
          style={{
            transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)",
            transitionDuration: hasInitialized ? "0.6s" : "0s",
          }}
        >
          {/* Front face — personal */}
          <div className="coin-face overflow-hidden rounded-full warm-shadow-lg">
            <Image
              src="/images/personal.jpeg"
              alt="Joshua Lowrance"
              width={400}
              height={400}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          {/* Back face — professional */}
          <div className="coin-face overflow-hidden rounded-full warm-shadow-lg"
            style={{ transform: "rotateY(180deg)" }}
          >
            <Image
              src="/images/professional.jpeg"
              alt="Joshua Lowrance"
              width={400}
              height={400}
              className="h-full w-full object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
