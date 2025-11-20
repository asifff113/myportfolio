import { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getAllPublicContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog | Portfolio",
  description: "Thoughts, tutorials, and insights on development and technology",
};

export default async function BlogPage() {
  const content = await getAllPublicContent();
  const posts = content.blogPosts || [];

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
            Blog & Insights
          </h1>
          <p className="text-lg text-muted-foreground">
            Sharing my thoughts on development, design, and technology
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-5xl mx-auto">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {sortedPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="glass p-6 rounded-2xl hover:shadow-xl transition-all hover:scale-[1.02]">
                    {/* Category Badge */}
                    {post.tags && post.tags.length > 0 && (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
                        {post.tags[0]}
                      </span>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(post.publishedDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{post.readTime} min read</span>
                        </div>
                      )}
                    </div>

                    {/* Read More Link */}
                    <div className="flex items-center gap-2 mt-4 text-primary font-medium group-hover:gap-3 transition-all">
                      <span>Read more</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-background/50 rounded-md text-foreground/70"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

