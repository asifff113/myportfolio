"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

/**
 * Animated loading spinner component
 * Used for loading states throughout the app
 */
export default function LoadingSpinner({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <motion.div
        className={cn(
          "border-4 border-primary/20 border-t-primary rounded-full",
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {text && (
        <p className="text-muted-foreground text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

