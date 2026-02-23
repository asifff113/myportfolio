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
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-6 z-0 opacity-80",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "left" && "left-0",
          align === "right" && "right-0"
        )}
      >
        <div className="relative h-10 w-28">
          <div className="absolute inset-0 rounded-full border border-[rgba(var(--section-rgb),0.18)]" />
          <div className="absolute inset-2 rounded-full border border-[rgba(var(--section-rgb),0.10)] spin-slower" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[rgba(var(--section-rgb),0.95)] twinkle" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[rgba(var(--section-rgb),0.8)] twinkle delay-1" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={cn(
          "border-beam inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 bg-[rgba(15,15,40,0.70)] backdrop-blur-lg border border-[rgba(var(--section-rgb),0.20)] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-slate-400 shadow-[0_4px_16px_-8px_rgba(var(--section-rgb),0.20)]",
          align === "center" && "mx-auto",
          align === "right" && "ml-auto"
        )}
      >
        <span className="data-dot text-[rgba(var(--section-rgb),0.95)]" />
        Section
      </motion.div>

      {/* Title with animated gradient */}
      <motion.h2
        initial={{ scale: 0.95 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4 relative z-10 tracking-tight"
      >
        <span className="pointer-events-none absolute -inset-x-6 top-1/2 h-8 -translate-y-1/2 blur-2xl opacity-40 bg-[radial-gradient(circle_at_center,rgba(var(--section-rgb),0.32),transparent_65%)]" />
        <span
          className={cn(
            gradient ? "bg-gradient-to-r bg-clip-text text-transparent" : "gradient-text-animated",
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
            "text-base md:text-lg text-slate-400 max-w-2xl font-medium leading-relaxed relative z-10",
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
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className={cn(
          "pointer-events-none mt-3 h-px bg-gradient-to-r from-transparent via-[rgba(var(--section-rgb),0.28)] to-transparent",
          align === "center" ? "mx-auto w-40" : "w-28",
          align === "right" && "ml-auto"
        )}
      />
    </motion.div>
  );
}
