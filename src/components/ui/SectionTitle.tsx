"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

/**
 * Reusable section title component with animation
 * Used across all portfolio sections for consistent styling
 */
export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  className,
}: SectionTitleProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={cn("mb-16 relative", alignmentClasses[align], className)}
    >
      {/* Decorative Background Glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.3 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={cn(
          "absolute -top-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "left" && "left-0",
          align === "right" && "right-0"
        )}
      />
      
      {/* Title - BIGGER & MORE DRAMATIC */}
      <motion.h2 
        initial={{ scale: 0.9 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6 relative z-10"
      >
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
          {title}
        </span>
      </motion.h2>
      
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed relative z-10"
        >
          {subtitle}
        </motion.p>
      )}
      
      {/* Decorative underline - THICKER & MORE COLORFUL */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: align === "center" ? "120px" : "100px" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={cn(
          "h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mt-6 rounded-full relative z-10 shadow-lg shadow-purple-500/50",
          align === "center" && "mx-auto",
          align === "right" && "ml-auto"
        )}
      >
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-white/50 rounded-full blur-sm"
        />
      </motion.div>
      
      {/* Decorative Sparkles */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={cn(
          "absolute -top-2 text-2xl",
          align === "center" && "left-1/2 -translate-x-1/2 -ml-32",
          align === "left" && "left-0",
          align === "right" && "right-0"
        )}
      >
        <motion.span
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.span>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className={cn(
          "absolute -top-4 text-3xl",
          align === "center" && "left-1/2 -translate-x-1/2 ml-32",
          align === "left" && "left-20",
          align === "right" && "right-20"
        )}
      >
        <motion.span
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          ⭐
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

