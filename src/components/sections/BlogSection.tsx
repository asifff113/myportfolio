"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, ArrowRight, FileText } from "lucide-react";
import { BlogPost } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { formatDate } from "@/lib/utils";

interface BlogSectionProps {
  blogPosts: BlogPost[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function BlogSection({ blogPosts }: BlogSectionProps) {
  // Filter published posts
  const publishedPosts = blogPosts.filter((post) => post.published !== false);

  if (!publishedPosts || publishedPosts.length === 0) {
    return null;
  }

  return (
    <Section id="blog" sectionId="blog">
      <SectionTitle
        title="Blog & Articles"
        subtitle="Thoughts, tutorials, and insights I want to share"
        gradient="from-teal-400 via-emerald-400 to-teal-300"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {publishedPosts.map((post, index) => (
          <BlogCard key={post.id || index} post={post} />
        ))}
      </motion.div>
    </Section>
  );
}

// Blog Card Component
interface BlogCardProps {
  post: BlogPost;
}

function BlogCard({ post }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -6 }}
      className="bg-zinc-900/60 border border-zinc-800 hover:border-teal-500/30 rounded-2xl overflow-hidden group transition-colors"
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-zinc-800 overflow-hidden">
        {!imageError && post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800/80">
            <FileText size={48} className="text-zinc-600" />
          </div>
        )}

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 rounded-md px-2 py-1"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="px-2 py-1 text-zinc-500 text-xs">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-teal-300 transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-zinc-400 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 mb-4">
          {/* Date */}
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(post.publishedDate)}</span>
          </div>

          {/* Read Time */}
          {post.readTime && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readTime} min read</span>
            </div>
          )}

          {/* Views */}
          {post.views !== undefined && (
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{post.views} views</span>
            </div>
          )}
        </div>

        {/* Read More Link */}
        <a
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors font-semibold text-sm group/link"
        >
          <span>Read More</span>
          <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
        </a>
      </div>
    </motion.article>
  );
}
