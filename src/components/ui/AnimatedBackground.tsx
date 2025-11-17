"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Animated gradient background with floating orbs and grid pattern
 * Creates a futuristic, dynamic background effect
 */

interface AnimatedBackgroundProps {
  variant?: "hero" | "purple" | "blue" | "green" | "orange" | "pink" | "default";
}

export default function AnimatedBackground({ variant = "default" }: AnimatedBackgroundProps) {
  // Color configurations for different variants
  const variants = {
    hero: {
      gradient: "from-purple-900/50 via-blue-900/30 to-pink-900/50",
      orbs: [
        { color: "bg-purple-500/30", size: "w-96 h-96", position: "top-1/4 left-1/4" },
        { color: "bg-blue-500/25", size: "w-[32rem] h-[32rem]", position: "top-1/2 right-1/4" },
        { color: "bg-pink-500/30", size: "w-80 h-80", position: "bottom-1/4 left-1/2" },
      ],
    },
    purple: {
      gradient: "from-purple-900/40 via-fuchsia-900/30 to-violet-900/40",
      orbs: [
        { color: "bg-purple-500/25", size: "w-80 h-80", position: "top-20 right-20" },
        { color: "bg-fuchsia-500/20", size: "w-96 h-96", position: "bottom-20 left-20" },
      ],
    },
    blue: {
      gradient: "from-blue-900/40 via-cyan-900/30 to-indigo-900/40",
      orbs: [
        { color: "bg-blue-500/25", size: "w-96 h-96", position: "top-1/3 left-20" },
        { color: "bg-cyan-500/20", size: "w-80 h-80", position: "bottom-1/3 right-20" },
      ],
    },
    green: {
      gradient: "from-green-900/40 via-emerald-900/30 to-teal-900/40",
      orbs: [
        { color: "bg-green-500/25", size: "w-80 h-80", position: "top-40 left-1/4" },
        { color: "bg-emerald-500/20", size: "w-96 h-96", position: "bottom-40 right-1/4" },
      ],
    },
    orange: {
      gradient: "from-orange-900/40 via-amber-900/30 to-yellow-900/40",
      orbs: [
        { color: "bg-orange-500/25", size: "w-96 h-96", position: "top-20 right-1/3" },
        { color: "bg-amber-500/20", size: "w-80 h-80", position: "bottom-20 left-1/3" },
      ],
    },
    pink: {
      gradient: "from-pink-900/40 via-rose-900/30 to-red-900/40",
      orbs: [
        { color: "bg-pink-500/25", size: "w-80 h-80", position: "top-1/4 right-20" },
        { color: "bg-rose-500/20", size: "w-96 h-96", position: "bottom-1/4 left-20" },
      ],
    },
    default: {
      gradient: "from-slate-900/40 via-purple-900/30 to-slate-900/40",
      orbs: [
        { color: "bg-purple-500/20", size: "w-72 h-72", position: "top-1/4 left-1/4" },
        { color: "bg-cyan-500/15", size: "w-96 h-96", position: "bottom-1/3 right-1/4" },
      ],
    },
  };

  const config = variants[variant];

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Base Dark Background with Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />

      {/* Grid Pattern - Like the reference image */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing Grid Intersection Points */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0 0, rgba(139, 92, 246, 0.4) 2px, transparent 2px)
          `,
          backgroundSize: "60px 60px",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated Floating Orbs */}
      {config.orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute ${orb.position} ${orb.size} ${orb.color} rounded-full blur-3xl`}
          animate={{
            x: [0, index % 2 === 0 ? 100 : -100, 0],
            y: [0, index % 2 === 0 ? -100 : 100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20 + index * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Additional Glow Orbs */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Glowing Dots - Scattered */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 rounded-full bg-purple-400/60"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: "0 0 10px rgba(139, 92, 246, 0.8)",
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
    </div>
  );
}

