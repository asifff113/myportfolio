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

  const gradientClass = gradient || "text-gradient";
  const subtitleAlignment = align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={cn("mb-14 md:mb-16 relative", alignmentClasses[align], className)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 glass-frosted border border-white/70 text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-slate-600",
          align === "center" && "mx-auto",
          align === "right" && "ml-auto"
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(var(--section-rgb),0.95)] shadow-[0_0_0_4px_rgba(var(--section-rgb),0.12)]" />
        Section
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ scale: 0.95 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 relative z-10 tracking-tight"
      >
        <span
          className={cn(
            gradient ? "bg-gradient-to-r bg-clip-text text-transparent" : "text-gradient",
            gradient && gradientClass
          )}
        >
          {title}
        </span>
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn(
            "text-base md:text-lg text-slate-600 max-w-2xl font-medium leading-relaxed relative z-10",
            subtitleAlignment
          )}
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
          "h-1.5 rounded-full mt-6 relative z-10 bg-gradient-to-r shadow-[0_8px_18px_-10px_rgba(var(--section-rgb),0.5)]",
          gradient || "from-[var(--section-primary)] to-[var(--section-secondary)]",
          align === "center" && "mx-auto",
          align === "right" && "ml-auto"
        )}
      />
    </motion.div>
  );
}
