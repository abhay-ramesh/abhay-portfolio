import { cn } from "@/lib/utils";
import { clash, inter, satoshi } from "./fonts";
import "./globals.css";
import { GoogleAnalytics } from "./GoogleAnalytics";
import { PostHogProvider } from "./providers";
import { JsonLd, metadataVal } from "./seo_data";

export const metadata = metadataVal;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preload"
          href="/fonts/ClashDisplay-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn(
          inter.variable,
          clash.variable,
          satoshi.variable,
          "min-h-screen flex font-inter flex-col bg-[#030711]"
        )}
      >
        <JsonLd />
        <GoogleAnalytics />
        <main className="flex flex-col pb-4 w-full h-full grow sm:pt-4">
          <PostHogProvider>{children}</PostHogProvider>
        </main>
      </body>
    </html>
  );
}
