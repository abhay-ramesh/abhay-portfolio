interface TableOfContentsItem {
  title: string;
  url: string;
  level: number;
}

export function extractHeadings(content: string): TableOfContentsItem[] {
  const headingLines = content
    .split("\n")
    .filter((line) => line.match(/^#{1,3} /));

  return headingLines
    .map((raw) => {
      const match = raw.match(/^(#{1,3})\s+(.+)$/);
      if (!match) return null;

      const [, level, title] = match;

      const url = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      return {
        title,
        url: `#${url}`,
        level: level.length,
      };
    })
    .filter((heading): heading is TableOfContentsItem => heading !== null);
}

export function addHeadingIds(content: string): string {
  const lines = content.split("\n");
  return lines
    .map((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (!match) return line;

      const [, level, title] = match;
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      return `${level} ${title} {#${id}}`;
    })
    .join("\n");
}
