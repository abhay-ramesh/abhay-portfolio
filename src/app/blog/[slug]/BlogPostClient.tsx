"use client";

import { Post, allPosts } from "contentlayer/generated";
import { motion } from "framer-motion";
import { useMDXComponent } from "next-contentlayer/hooks";
import Image from "next/image";
import Link from "next/link";

function BlogNavigation({ currentPost }: { currentPost: Post }) {
  // Sort posts by date
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Find current post index
  const currentIndex = sortedPosts.findIndex(
    (post) => post.slug === currentPost.slug
  );
  const prevPost =
    currentIndex < sortedPosts.length - 1
      ? sortedPosts[currentIndex + 1]
      : null;
  const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;

  if (!prevPost && !nextPost) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="flex flex-col gap-4 pt-8 mt-16 border-t border-white/10 md:flex-row md:gap-8"
    >
      {prevPost && (
        <Link
          href={`/blog/${prevPost.slug}`}
          className="flex flex-col flex-1 p-4 rounded-lg transition-colors bg-white/5 hover:bg-white/10"
        >
          <span className="text-sm text-white/60">Previous Post</span>
          <span className="mt-2 font-medium line-clamp-2">
            {prevPost.title}
          </span>
        </Link>
      )}
      {nextPost && (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="flex flex-col flex-1 p-4 text-right rounded-lg transition-colors bg-white/5 hover:bg-white/10"
        >
          <span className="text-sm text-white/60">Next Post</span>
          <span className="mt-2 font-medium line-clamp-2">
            {nextPost.title}
          </span>
        </Link>
      )}
    </motion.div>
  );
}

export default function BlogPostClient({ post }: { post: Post }) {
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-16 text-white bg-[#0A0A0A] md:py-32"
    >
      <div className="container px-4 mx-auto max-w-4xl">
        {/* Back to Blog */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="flex gap-2 items-center text-sm transition-colors text-white/60 hover:text-white"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </Link>
        </motion.div>

        <div className="mb-8 md:mb-16">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 text-4xl font-bold md:text-6xl font-clash"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 items-center text-white/60"
          >
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>{post.readTime} read</span>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs whitespace-nowrap rounded md:text-sm bg-white/10"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex gap-4 items-center mt-8"
          >
            <div className="overflow-hidden relative w-12 h-12 rounded-full">
              <Image
                src="https://github.com/abhay-ramesh.png"
                alt="Abhay Ramesh"
                fill
                className="object-cover"
                sizes="48px"
                priority
              />
            </div>
            <div>
              <div className="font-medium">Abhay Ramesh</div>
              <div className="text-sm text-white/60">Full Stack Developer</div>
            </div>
          </motion.div>
        </div>

        <motion.article
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="max-w-none prose prose-invert prose-lg"
        >
          <MDXContent key={post.slug} />
        </motion.article>

        {/* Blog Navigation */}
        <BlogNavigation currentPost={post} />
      </div>
    </motion.div>
  );
}
