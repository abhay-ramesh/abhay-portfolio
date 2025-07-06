interface TableOfContentsItem {
  title: string;
  url: string;
  level: number;
}

export function extractHeadings(content: string): TableOfContentsItem[] {
  const headingLines = content
    .split("\n")
    .filter((line) => line.match(/^#{1,3} /));

  const usedUrls = new Set<string>();

  return headingLines
    .map((raw) => {
      const match = raw.match(/^(#{1,3})\s+(.+)$/);
      if (!match) return null;

      const [, level, title] = match;

      let baseUrl = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      // Ensure unique URL with more descriptive suffixes
      let url = baseUrl;
      let counter = 1;
      while (usedUrls.has(url)) {
        // Try to make it more descriptive by adding section context
        const levelPrefix =
          level.length === 1
            ? "section"
            : level.length === 2
            ? "subsection"
            : "item";
        url = `${baseUrl}-${levelPrefix}-${counter}`;
        counter++;
      }
      usedUrls.add(url);

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
  const usedIds = new Set<string>();

  return lines
    .map((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (!match) return line;

      const [, level, title] = match;
      let baseId = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      // Ensure unique ID with more descriptive suffixes
      let id = baseId;
      let counter = 1;
      while (usedIds.has(id)) {
        // Try to make it more descriptive by adding section context
        const levelPrefix =
          level.length === 1
            ? "section"
            : level.length === 2
            ? "subsection"
            : "item";
        id = `${baseId}-${levelPrefix}-${counter}`;
        counter++;
      }
      usedIds.add(id);

      return `${level} ${title} {#${id}}`;
    })
    .join("\n");
}
