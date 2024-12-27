import { NextResponse } from "next/server";
import { parse } from "node-html-parser";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const root = parse(html);

    // Try different meta tags for OG image
    const ogImage =
      root
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content") ||
      root.querySelector('meta[name="og:image"]')?.getAttribute("content") ||
      root
        .querySelector('meta[property="twitter:image"]')
        ?.getAttribute("content") ||
      root.querySelector('meta[name="twitter:image"]')?.getAttribute("content");

    return NextResponse.json({ ogImage });
  } catch (error) {
    console.error("Error fetching OG image:", error);
    return NextResponse.json(
      { error: "Failed to fetch OG image" },
      { status: 500 }
    );
  }
}
