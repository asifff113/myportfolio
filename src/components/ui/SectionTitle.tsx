"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  gradient?: string;
}

/**
 * Section title component with section-aware gradient colors
 * Clean, professional design - no emoji sparkles, no infinite animations
 */
export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  className,
  gradient,
}: SectionTitleProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const gradientClass = gradient || "from-white via-white/90 to-white/70";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={cn("mb-16 relative", alignmentClasses[align], className)}
    >
      {/* Title */}
      <motion.h2
        initial={{ scale: 0.95 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 relative z-10"
      >
        <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", gradientClass)}>
          {title}
        </span>
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed relative z-10"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative underline - section-colored, static */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: align === "center" ? "80px" : "60px" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={cn(
          "h-1 rounded-full mt-6 relative z-10",
          "bg-gradient-to-r",
          gradient || "from-blue-500 to-cyan-500",
          align === "center" && "mx-auto",
          align === "right" && "ml-auto"
        )}
      />
    </motion.div>
  );
}
