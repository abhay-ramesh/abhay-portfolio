import { Metadata } from "next";
import { Person } from "schema-dts";

const metadataVal: Metadata = {
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

const jsonLd: Person = {
  "@type": "Person",
  name: "Abhay Ramesh",
  jobTitle: "Software Engineer",
  gender: "male",
  height: "5' 10\"",
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
  sameAs: [
    "https://www.linkedin.com/in/abhay-ramesh/",
    "https://github.com/abhay-ramesh",
    "https://twitter.com/abhay__ramesh",
  ],
};

export { metadataVal, jsonLd };
