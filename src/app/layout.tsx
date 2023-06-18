import "./globals.css";
import { Inter } from "next/font/google";
import { jsonLd, metadataVal } from "./seo_data";

export const metadata = metadataVal;

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          inter.className + "  min-h-screen flex flex-col bg-[#030711]"
        }
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main className="flex flex-col w-full h-full pb-4 grow sm:pt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
