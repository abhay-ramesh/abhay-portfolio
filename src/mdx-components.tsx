import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,

    // We wrap the `wrapper` component in a `div` to add
    // some margin around the content and prose styles
    // to make it look nicer for all text content.
    wrapper: ({ children }) => (
      <div className="container mt-20 prose prose-invert prose-[#E1E7EF] sm:mx-auto mb-28 sm:pt-4 list-outside">
        {children}
      </div>
    ),

    // Overrides for built-in components.
    a: ({ href, children, className }) => (
      <Link href={href === undefined ? "" : href} className={className}>
        {children}
      </Link>
    ),
    link: ({ href, children, className }) => (
      <Link href={href === undefined ? "" : href} className={className}>
        {children}
      </Link>
    ),

    ...components,
  };
}
