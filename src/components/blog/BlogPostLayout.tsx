"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BlogPost } from "@/lib/content-types";

interface BlogPostLayoutProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostLayout({ post, relatedPosts }: BlogPostLayoutProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reading progress tracking
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = post.title;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Blog</span>
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            {/* Category Badge */}
            {post.tags && post.tags.length > 0 && (
              <span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full mb-6">
                {post.tags[0]}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <time dateTime={new Date(post.publishedDate).toISOString()}>
                  {new Date(post.publishedDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              {post.readTime && (
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{post.readTime} min read</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1 bg-background/50 glass rounded-full text-foreground/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-primary/10 transition-colors"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>

              {/* Share Menu */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 left-0 glass rounded-xl p-4 shadow-xl z-10 min-w-[200px]"
                  >
                    <div className="space-y-2">
                      <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Twitter size={18} />
                        <span>Twitter</span>
                      </a>
                      <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Linkedin size={18} />
                        <span>LinkedIn</span>
                      </a>
                      <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FaFacebook size={18} />
                        <span>Facebook</span>
                      </a>
                      <button
                        onClick={copyToClipboard}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors text-left"
                      >
                        {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                        <span>{copied ? "Copied!" : "Copy Link"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Author CTA / Newsletter (Optional) */}
          <div className="glass p-8 rounded-2xl mb-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Enjoyed this post?</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to get notified about new posts and updates
            </p>
            <form className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group glass p-4 rounded-xl hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    {relatedPost.tags && relatedPost.tags.length > 0 && (
                      <span className="inline-block text-xs px-2 py-1 bg-primary/10 text-primary rounded-full mb-2">
                        {relatedPost.tags[0]}
                      </span>
                    )}
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

