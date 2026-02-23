"use client";

import React, { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import useIsMobile from "@/hooks/useIsMobile";

type RevealDirection = "up" | "down" | "left" | "right" | "scale" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const getVariants = (direction: RevealDirection, duration: number): Variants => {
  const hidden: Record<string, number> = { opacity: 0 };
  const visible: Record<string, number> = { opacity: 1 };

  switch (direction) {
    case "up":
      hidden.y = 40;
      visible.y = 0;
      break;
    case "down":
      hidden.y = -40;
      visible.y = 0;
      break;
    case "left":
      hidden.x = 50;
      visible.x = 0;
      break;
    case "right":
      hidden.x = -50;
      visible.x = 0;
      break;
    case "scale":
      hidden.scale = 0.85;
      visible.scale = 1;
      break;
    case "none":
      break;
  }

  return {
    hidden,
    visible: {
      ...visible,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className = "",
  once = true,
  amount = 0.15,
}: ScrollRevealProps) {
  const isMobile = useIsMobile();

  // On mobile, skip animation entirely to avoid IntersectionObserver + transform overhead
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={getVariants(direction, duration)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Staggered Container — wrap children for sequential reveal ─── */
interface StaggerContainerProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({
  children,
  stagger = 0.1,
  delay = 0,
  className = "",
  once = true,
}: StaggerContainerProps) {
  const isMobile = useIsMobile();

  // On mobile, render children directly without stagger animations
  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stagger Item — child of StaggerContainer ─── */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
}

export function StaggerItem({ children, className = "", direction = "up" }: StaggerItemProps) {
  const hidden: Record<string, number> = { opacity: 0 };
  const visible: Record<string, number> = { opacity: 1 };

  switch (direction) {
    case "up": hidden.y = 30; visible.y = 0; break;
    case "down": hidden.y = -30; visible.y = 0; break;
    case "left": hidden.x = 40; visible.x = 0; break;
    case "right": hidden.x = -40; visible.x = 0; break;
    case "scale": hidden.scale = 0.9; visible.scale = 1; break;
  }

  return (
    <motion.div
      variants={{
        hidden,
        visible: { ...visible, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
