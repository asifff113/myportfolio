"use client";

import React from "react";
import { motion } from "framer-motion";
import { getProficiencyColor } from "@/lib/skills-utils";
import { cn } from "@/lib/utils";

type ProficiencyVariant = "progress" | "circular" | "stars" | "dots";

interface ProficiencyIndicatorProps {
  level: number;
  variant?: ProficiencyVariant;
  showPercentage?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ProficiencyIndicator({
  level,
  variant = "progress",
  showPercentage = true,
  className,
  size = "md",
}: ProficiencyIndicatorProps) {
  const gradientClass = getProficiencyColor(level);

  switch (variant) {
    case "progress":
      return (
        <ProgressBar
          level={level}
          gradientClass={gradientClass}
          showPercentage={showPercentage}
          className={className}
          size={size}
        />
      );
    case "circular":
      return (
        <CircularProgress
          level={level}
          gradientClass={gradientClass}
          showPercentage={showPercentage}
          className={className}
          size={size}
        />
      );
    case "stars":
      return (
        <StarRating
          level={level}
          gradientClass={gradientClass}
          className={className}
          size={size}
        />
      );
    case "dots":
      return (
        <DotIndicator
          level={level}
          gradientClass={gradientClass}
          className={className}
          size={size}
        />
      );
    default:
      return null;
  }
}

// Progress Bar Variant
function ProgressBar({
  level,
  gradientClass,
  showPercentage,
  className,
  size,
}: {
  level: number;
  gradientClass: string;
  showPercentage: boolean;
  className?: string;
  size: "sm" | "md" | "lg";
}) {
  const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div className={cn("space-y-1", className)}>
      {showPercentage && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{level}%</span>
        </div>
      )}
      <div
        className={cn(
          "relative bg-secondary rounded-full overflow-hidden",
          heightClass
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r",
            gradientClass,
            level >= 90 && "neon-glow"
          )}
        />
      </div>
    </div>
  );
}

// Circular Progress Variant
function CircularProgress({
  level,
  gradientClass,
  showPercentage,
  className,
  size,
}: {
  level: number;
  gradientClass: string;
  showPercentage: boolean;
  className?: string;
  size: "sm" | "md" | "lg";
}) {
  const sizeValue = size === "sm" ? 40 : size === "lg" ? 80 : 60;
  const strokeWidth = size === "sm" ? 3 : size === "lg" ? 6 : 4;
  const radius = (sizeValue - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={sizeValue} height={sizeValue} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={sizeValue / 2}
          cy={sizeValue / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-secondary"
        />
        {/* Progress circle */}
        <motion.circle
          cx={sizeValue / 2}
          cy={sizeValue / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      </svg>
      {showPercentage && (
        <span
          className={cn(
            "absolute font-semibold",
            size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"
          )}
        >
          {level}%
        </span>
      )}
    </div>
  );
}

// Star Rating Variant
function StarRating({
  level,
  gradientClass,
  className,
  size,
}: {
  level: number;
  gradientClass: string;
  className?: string;
  size: "sm" | "md" | "lg";
}) {
  const stars = level / 20; // Convert 0-100 to 0-5 stars
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 >= 0.5;
  const sizeClass = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4";

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(5)].map((_, index) => {
        const isFilled = index < fullStars;
        const isHalf = index === fullStars && hasHalfStar;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative"
          >
            {isFilled ? (
              <svg
                className={cn(sizeClass, "fill-current")}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`star-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C084FC" />
                    <stop offset="50%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#star-gradient-${index})`}
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                />
              </svg>
            ) : isHalf ? (
              <svg
                className={cn(sizeClass)}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`star-gradient-half-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C084FC" />
                    <stop offset="50%" stopColor="#F472B6" />
                    <stop offset="50%" stopColor="currentColor" className="text-secondary" />
                    <stop offset="100%" stopColor="currentColor" className="text-secondary" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#star-gradient-half-${index})`}
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                />
              </svg>
            ) : (
              <svg
                className={cn(sizeClass, "fill-current text-secondary")}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// Dot Indicator Variant
function DotIndicator({
  level,
  gradientClass,
  className,
  size,
}: {
  level: number;
  gradientClass: string;
  className?: string;
  size: "sm" | "md" | "lg";
}) {
  const dots = Math.round(level / 20); // Convert 0-100 to 0-5 dots
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : size === "lg" ? "w-3 h-3" : "w-2 h-2";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(5)].map((_, index) => {
        const isFilled = index < dots;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={cn(
              "rounded-full",
              dotSize,
              isFilled
                ? `bg-gradient-to-r ${gradientClass}`
                : "bg-secondary"
            )}
          />
        );
      })}
    </div>
  );
}
