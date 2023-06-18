import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | Abhay Ramesh`,
    default: "Abhay Ramesh",
  },
  description:
    "Hi I'm Abhay Ramesh, a software engineer based out of Bangalore, India. I'm currently working at Fabitin Inc. as a Software Engineer.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abhayramesh.com",
    images: [
      {
        url: "https://github.com/abhay-ramesh.png",
        width: 1200,
        height: 630,
        alt: "Abhay Ramesh",
      },
    ],
  },
  creator: "Abhay Ramesh",
  robots: {
    follow: true,
    index: true,
    googleBot: {
      follow: true,
      index: true,
    },
  },
  keywords: [
    "Abhay Ramesh",
    "abhayramesh",
    "abhay ramesh",
    "abhay",
    "ramesh",
    "software engineer",
    "software developer",
    "bangalore",
    "india",
    "fabitin",
    "fabitin inc",
    "fabitin.com",
    "fabitin inc.",
  ],
  applicationName: "Abhay Ramesh | My Personal Website",
};

const jsonLd = {
  "@context": "http://www.schema.org",
  "@type": "person",
  name: "Abhay Ramesh",
  jobTitle: "Software Engineer",
  gender: "male",
  url: "https://abhayramesh.com",
  image: "https://github.com/abhay-ramesh.png",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Banglore",
    addressRegion: "Karnataka",
    addressCountry: "India",
  },
  email: "ramesh.abhay14@gmail.com",
  birthDate: "2002-07-14",
  alumniOf: "PES University",
  birthPlace: "Hassan",
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
