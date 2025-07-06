import { allPosts } from "contentlayer/generated";
import Link from "next/link";

export const metadata = {
  title: "Blog | Abhay Ramesh",
  description: "Thoughts on software development, tech, and more.",
};

export default function BlogPage() {
  // Sort posts by date in descending order
  const posts = allPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="min-h-screen py-16 pt-8 text-white bg-[#0A0A0A] md:py-32 md:pt-16">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="mb-12 md:mb-20">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl font-clash">
            Blog
          </h1>
          <p className="text-lg text-white/60 md:text-xl">
            Thoughts on software development, tech, and more.
          </p>
        </div>

        <div className="grid gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-6 rounded-lg transition-all duration-300 group hover:bg-white/5"
            >
              <article>
                <div className="flex flex-wrap gap-3 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs whitespace-nowrap rounded md:text-sm bg-white/10 text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="mb-2 text-2xl font-bold transition-colors md:text-3xl group-hover:text-white text-white/90">
                  {post.title}
                </h2>

                <p className="mb-4 text-base text-white/60 md:text-lg line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-4 items-center text-sm text-white/40">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.readTime} read</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
