import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accept = req.headers.get("accept") ?? "";
  if (!accept.toLowerCase().includes("text/markdown")) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  const target = url.pathname + url.search;
  url.pathname = "/api/markdown";
  url.search = `?path=${encodeURIComponent(target)}`;

  const headers = new Headers(req.headers);
  headers.set("x-md-path", target);
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: [
    "/((?!api/|_next/|_vercel/|favicon.ico|robots.txt|sitemap.xml|fonts/|.*\\..*).*)",
  ],
};
