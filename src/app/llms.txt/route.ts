import { allPosts } from "contentlayer/generated";

export const runtime = "nodejs";
export const dynamic = "force-static";

const SITE = "https://abhayramesh.com";

export function GET() {
  const posts = [...allPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lines: string[] = [
    "# Abhay Ramesh",
    "",
    "> Founder & CEO of Hunchbite Technologies. Senior frontend engineer building production-grade web applications with Next.js, TypeScript, and React. Portfolio, blog, and contact.",
    "",
    "This site supports content negotiation: append `Accept: text/markdown` to any page URL to receive a clean markdown version. Blog posts are served from their original MDX source.",
    "",
    "## Core pages",
    "",
    `- [Home](${SITE}/): profile, skills, experience, ventures, selected projects, and contact.`,
    `- [Blog](${SITE}/blog): articles on TypeScript, Next.js, developer tooling, and shell productivity.`,
    "",
    "## Blog posts",
    "",
  ];

  for (const p of posts) {
    lines.push(
      `- [${p.title}](${SITE}/blog/${p.slug}): ${p.excerpt}`
    );
  }

  lines.push(
    "",
    "## Identity",
    "",
    `- [GitHub](https://github.com/abhay-ramesh)`,
    `- [LinkedIn](https://www.linkedin.com/in/abhay-ramesh/)`,
    `- [Twitter / X](https://twitter.com/abhay__ramesh)`,
    "",
    "## Machine-readable resources",
    "",
    `- [Sitemap](${SITE}/sitemap.xml)`,
    `- [robots.txt](${SITE}/robots.txt)`,
    ""
  );

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
