import { allPosts } from "contentlayer/generated";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The blog post you're looking for doesn't exist",
    };
  }

  return {
    title: `${post.title} | Abhay Ramesh`,
    description: post.excerpt,
    authors: [{ name: "Abhay Ramesh", url: "https://abhayramesh.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://abhayramesh.com/blog/${post.slug}`,
      publishedTime: post.date,
      authors: ["Abhay Ramesh"],
      tags: post.tags,
      siteName: "Abhay Ramesh",
      locale: "en-US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: "@abhay_ramesh",
    },
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
