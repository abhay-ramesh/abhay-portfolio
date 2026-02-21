"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const STORAGE_KEY = "hire-bar-dismissed";

export function HireBar() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setDismissed(stored === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
      setDismissed(true);
    } catch {
      setDismissed(true);
    }
  };

  if (dismissed) return null;

  return (
    <div
      role="banner"
      className="sticky top-0 z-[100] flex shrink-0 items-center justify-center gap-2 border-b border-white/10 bg-[#0A0A0A] px-4 py-2 text-center text-sm text-white/90"
    >
      <span className="font-medium">Open to new projects</span>
      <span className="text-white/50">·</span>
      <Link
        href="/#contact"
        className="font-medium text-white underline decoration-white/40 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
      >
        Say hi
      </Link>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
        aria-label="Dismiss"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
