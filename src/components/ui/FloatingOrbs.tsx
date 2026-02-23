"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useIsMobile from "@/hooks/useIsMobile";

interface FloatingOrbsProps {
  count?: number;
  className?: string;
  color?: string;
}

/**
 * Ambient floating orbs that add depth and atmosphere to sections.
 * Disabled on mobile devices to prevent performance issues.
 */
export default function FloatingOrbs({
  count = 3,
  className,
  color,
}: FloatingOrbsProps) {
  const isMobile = useIsMobile();

  // Skip rendering on mobile — too many instances running simultaneously
  if (isMobile) return null;
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 60 + Math.random() * 120,
    x: 10 + (i * 30) + Math.random() * 20,
    y: 10 + Math.random() * 60,
    duration: 12 + Math.random() * 8,
    delay: i * 1.5,
  }));

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden -z-10",
        className
      )}
      aria-hidden
    >
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: color || `rgba(var(--section-rgb), 0.08)`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [0.4, 0.7, 0.5, 0.8, 0.4],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
