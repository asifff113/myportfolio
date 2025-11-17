"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";
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
    <Section id="blog">
      <SectionTitle
        title="Blog & Articles"
        subtitle="Thoughts, tutorials, and insights I want to share"
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
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass-ultra rounded-2xl overflow-hidden group card-3d"
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 overflow-hidden">
        {!imageError && post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-animated">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-6xl"
            >
              📝
            </motion.div>
          </div>
        )}

        {/* Enhanced Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-secondary/0 group-hover:from-primary/20 group-hover:via-accent/10 group-hover:to-secondary/20 transition-all duration-500" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map((tag, index) => {
              // Colorful gradients for tags
              const tagColors = [
                "from-blue-500 to-cyan-500",
                "from-purple-500 to-pink-500",
                "from-green-500 to-emerald-500",
                "from-orange-500 to-red-500",
                "from-indigo-500 to-purple-500",
              ];
              const tagColor = tagColors[index % tagColors.length];
              
              return (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className={`px-3 py-1.5 bg-gradient-to-r ${tagColor} bg-opacity-20 text-white rounded-lg text-xs font-bold border border-white/30 hover:border-white/60 hover:shadow-lg transition-all cursor-default relative overflow-hidden group/tag`}
                >
                  <span className="relative z-10">{tag}</span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/tag:opacity-100 transition-opacity" />
                </motion.span>
              );
            })}
            {post.tags.length > 2 && (
              <span className="px-2 py-1 text-muted-foreground text-xs">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-all duration-300 line-clamp-2 neon-text-hover">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
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
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold text-sm group/link"
        >
          <span>Read More</span>
          <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
        </a>
      </div>

      {/* Enhanced Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-neon-pink/10 to-neon-cyan/10 animate-pulse" />
        <div className="absolute inset-0 neon-glow" />
      </div>
      
      {/* Floating particles on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-neon-cyan rounded-full neon-glow"
        />
      </div>
    </motion.article>
  );
}

// Add useState import at top
import { useState } from "react";

