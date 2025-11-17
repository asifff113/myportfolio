import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  fallbackText?: string;
}

/**
 * Reusable Avatar component with fallback
 * Shows image if available, otherwise displays initials
 */
export default function Avatar({
  src,
  alt,
  size = "md",
  className,
  fallbackText,
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-lg",
    lg: "w-24 h-24 text-2xl",
    xl: "w-32 h-32 text-4xl",
    "2xl": "w-48 h-48 text-6xl",
  };

  const getInitials = (name: string): string => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = fallbackText || getInitials(alt);

  return (
    <div className={cn("relative rounded-full overflow-hidden", sizeClasses[size], className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={
            size === "sm"
              ? "40px"
              : size === "md"
              ? "64px"
              : size === "lg"
              ? "96px"
              : size === "xl"
              ? "128px"
              : "192px"
          }
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center font-display font-bold text-white">
          {initials}
        </div>
      )}
    </div>
  );
}

