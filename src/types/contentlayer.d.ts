declare module "contentlayer/generated" {
  export interface Post {
    _id: string;
    _raw: {
      sourceFilePath: string;
      sourceFileName: string;
      sourceFileDir: string;
      contentType: string;
      flattenedPath: string;
    };
    type: "Post";
    title: string;
    excerpt: string;
    date: string;
    tags: string[];
    image?: string;
    slug: string;
    readTime: string;
    body: {
      raw: string;
      code: string;
    };
  }

  export const allPosts: Post[];
}

declare module "next-contentlayer/hooks" {
  export const useMDXComponent: (code: string) => React.ComponentType;
  export const useLiveReload: () => void;
}
