import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Abhay Ramesh",
};

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
        <main className="flex flex-col w-full h-full pb-4 grow sm:pt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
