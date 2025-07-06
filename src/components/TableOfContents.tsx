"use client";

import { extractHeadings } from "@/lib/toc";
import { useEffect, useMemo, useState } from "react";

interface TableOfContentsProps {
  content: string;
  title?: string;
}

export function TableOfContents({ content, title }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const headings = extractHeadings(content);

  // Add title as first heading if provided
  const allHeadings = useMemo(
    () =>
      title ? [{ title, url: "#title", level: 1 }, ...headings] : headings,
    [title, headings]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    allHeadings.forEach(({ url }) => {
      const element = document.getElementById(url.slice(1));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [allHeadings]);

  return (
    <nav className="hidden lg:block sticky top-8 max-h-[calc(100vh-4rem)] overflow-auto w-full">
      <h2 className="mb-4 text-lg font-bold text-white/90">
        Table of Contents
      </h2>
      <ul className="space-y-2.5">
        {allHeadings.map(({ title, url, level }) => (
          <li
            key={url}
            className={`${level === 1 ? "" : "pl-4"} ${
              level === 3 ? "pl-8" : ""
            }`}
          >
            <a
              href={url}
              className={`block text-sm transition-colors hover:text-white ${
                "#" + activeId === url
                  ? "text-white font-medium"
                  : "text-white/60"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(url)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
