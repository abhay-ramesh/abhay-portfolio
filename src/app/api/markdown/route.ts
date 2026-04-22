import { NextRequest } from "next/server";
import TurndownService from "turndown";
import { parse, HTMLElement } from "node-html-parser";
import { allPosts } from "contentlayer/generated";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DROP_SELECTORS = [
  "script",
  "style",
  "noscript",
  "iframe",
  "svg",
  "nav",
  "aside",
  "footer",
  "[role=navigation]",
  "[aria-hidden=true]",
  "[data-nextjs-scroll-focus-boundary]",
  // Site chrome
  "[data-hire-bar]",
  // Newsletter / CTA blocks
  "[data-newsletter]",
];

function cleanHtml(html: string): string {
  const root = parse(html, { comment: false });

  DROP_SELECTORS.forEach((sel) => {
    root.querySelectorAll(sel).forEach((el) => el.remove());
  });

  // Heuristic: remove newsletter / subscribe blocks and prev/next nav by text
  root.querySelectorAll("section, div").forEach((el) => {
    const txt = el.text.trim().slice(0, 200).toLowerCase();
    if (
      /subscribe\s*→|keep learning|no spam, ever/.test(txt) &&
      el.childNodes.length < 40
    ) {
      el.remove();
    }
  });

  // Unwrap empty anchors inside headings (rehype-autolink-headings):
  // <h2><a href="#foo"></a>Text</h2> → <h2>Text</h2>
  root.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
    h.querySelectorAll("a").forEach((a) => {
      if (!a.text.trim()) a.remove();
    });
  });

  // Rewrite Next.js image proxy URLs back to original
  root.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src") || "";
    const m = src.match(/[?&]url=([^&]+)/);
    if (src.startsWith("/_next/image") && m) {
      try {
        img.setAttribute("src", decodeURIComponent(m[1]));
      } catch {}
    }
  });

  // Insert a space between adjacent inline elements that touch with no whitespace
  // (fixes "Next.js90%" style run-ons)
  const INLINE = new Set([
    "span",
    "a",
    "strong",
    "em",
    "b",
    "i",
    "code",
    "small",
    "mark",
  ]);
  const walk = (el: HTMLElement) => {
    const kids = el.childNodes;
    for (let i = 0; i < kids.length - 1; i++) {
      const a = kids[i] as HTMLElement;
      const b = kids[i + 1] as HTMLElement;
      if (
        a &&
        b &&
        a.nodeType === 1 &&
        b.nodeType === 1 &&
        INLINE.has(a.rawTagName?.toLowerCase?.() ?? "") &&
        INLINE.has(b.rawTagName?.toLowerCase?.() ?? "") &&
        !/\s$/.test(a.text) &&
        !/^\s/.test(b.text)
      ) {
        a.insertAdjacentHTML("afterend", " ");
      }
    }
    el.childNodes.forEach((c) => {
      if ((c as HTMLElement).nodeType === 1) walk(c as HTMLElement);
    });
  };
  walk(root as unknown as HTMLElement);

  const mainEl =
    root.querySelector("main") ||
    root.querySelector("article") ||
    root.querySelector("body") ||
    root;
  return mainEl.innerHTML;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  let t = m[1].trim();
  // Collapse duplicate suffix like "X | Abhay Ramesh | Abhay Ramesh"
  t = t.replace(/(\s\|\s[^|]+?)\1+$/, "$1");
  return t;
}

function buildTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "_",
  });
  return td;
}

function postprocessMarkdown(md: string): string {
  // Decode common HTML entities that can survive turndown
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&#x27;": "'",
    "&#39;": "'",
    "&quot;": '"',
    "&#x2F;": "/",
    "&#47;": "/",
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
  };
  let out = md.replace(
    /&(amp|#x27|#39|quot|#x2F|#47|lt|gt|nbsp);/g,
    (m) => entities[m] ?? m
  );
  // Collapse 3+ blank lines to 2
  out = out.replace(/\n{3,}/g, "\n\n");
  return out.trim();
}

function renderBlogIndexMarkdown(): string {
  const posts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lines = [
    "# Blog — Abhay Ramesh",
    "",
    "Thoughts on software development, tech, and more.",
    "",
  ];
  for (const p of posts) {
    const date = new Date(p.date).toISOString().slice(0, 10);
    lines.push(`## [${p.title}](/blog/${p.slug})`);
    lines.push("");
    lines.push(`${date} • ${p.readTime} • ${p.tags.join(", ")}`);
    lines.push("");
    lines.push(p.excerpt);
    lines.push("");
  }
  return lines.join("\n").trim();
}

function renderBlogPostMarkdown(slug: string): string | null {
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return null;
  const date = new Date(post.date).toISOString().slice(0, 10);
  const frontmatter = [
    `# ${post.title}`,
    "",
    `> ${post.excerpt}`,
    "",
    `**Published:** ${date}  •  **Read time:** ${post.readTime}  •  **Tags:** ${post.tags.join(", ")}`,
    "",
    "---",
    "",
  ].join("\n");
  return frontmatter + post.body.raw.trim() + "\n";
}

function respond(markdown: string) {
  const tokens = Math.ceil(markdown.length / 4);
  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(tokens),
      "Content-Signal": "ai-train=yes, search=yes, ai-input=yes",
      Vary: "Accept",
      "Cache-Control": "public, max-age=0, s-maxage=300",
    },
  });
}

export async function GET(req: NextRequest) {
  const path =
    req.headers.get("x-md-path") ||
    req.nextUrl.searchParams.get("path") ||
    "/";

  // Blog index
  if (path === "/blog" || path === "/blog/") {
    return respond(renderBlogIndexMarkdown());
  }

  // Blog post — serve source MDX
  const blogMatch = path.match(/^\/blog\/([^/?#]+)\/?$/);
  if (blogMatch) {
    const md = renderBlogPostMarkdown(blogMatch[1]);
    if (md) return respond(md);
    return new Response(`Post not found: ${blogMatch[1]}`, { status: 404 });
  }

  // Everything else: convert HTML → markdown
  const origin = req.nextUrl.origin;
  const target = new URL(path, origin).toString();

  const upstream = await fetch(target, {
    headers: { accept: "text/html", "x-md-passthrough": "1" },
    cache: "no-store",
  });

  if (!upstream.ok) {
    return new Response(`Failed to fetch ${path}`, { status: upstream.status });
  }

  const html = await upstream.text();
  const title = extractTitle(html);
  const cleaned = cleanHtml(html);

  const td = buildTurndown();
  let markdown = td.turndown(cleaned).trim();
  markdown = postprocessMarkdown(markdown);

  // Skip prepending <title> if first heading already matches
  if (title) {
    const firstH1 = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
    const titleBase = title.split(" | ")[0].trim();
    if (!firstH1 || !firstH1.toLowerCase().includes(titleBase.toLowerCase())) {
      markdown = `# ${title}\n\n${markdown}`;
    }
  }

  return respond(markdown);
}
