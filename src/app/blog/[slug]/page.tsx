import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPublicContent } from "@/lib/content";
import BlogPostLayout from "@/components/blog/BlogPostLayout";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getAllPublicContent();
  const post = content.blogPosts?.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const content = await getAllPublicContent();
  const posts = content.blogPosts || [];

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const content = await getAllPublicContent();
  const post = content.blogPosts?.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category or tags)
  const relatedPosts = content.blogPosts
    ?.filter((p) => p.id !== post.id)
    .filter((p) => 
      p.category === post.category ||
      (p.tags && post.tags && p.tags.some((tag) => post.tags?.includes(tag)))
    )
    .slice(0, 3);

  return <BlogPostLayout post={post} relatedPosts={relatedPosts || []} />;
}

