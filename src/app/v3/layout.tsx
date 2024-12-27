import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abhay Ramesh - Full Stack Developer",
  description:
    "Full Stack Developer specializing in modern web technologies, building scalable and performant applications.",
  icons: {
    icon: [
      {
        url: "https://github.com/abhay-ramesh.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://github.com/abhay-ramesh.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: {
      url: "https://github.com/abhay-ramesh.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  openGraph: {
    type: "website",
    title: "Abhay Ramesh - Full Stack Developer",
    description:
      "Full Stack Developer specializing in modern web technologies, building scalable and performant applications.",
    images: [
      {
        url: "https://github.com/abhay-ramesh.png",
        width: 400,
        height: 400,
        alt: "Abhay Ramesh",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Abhay Ramesh - Full Stack Developer",
    description:
      "Full Stack Developer specializing in modern web technologies, building scalable and performant applications.",
    images: ["https://github.com/abhay-ramesh.png"],
  },
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
