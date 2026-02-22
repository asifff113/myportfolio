"use client";

import React from "react";

/**
 * Minimal animated background with static gradients
 * Performance-optimized: zero JS animations, zero Framer Motion
 * Uses CSS-only effects for a clean, subtle atmosphere
 */

interface AnimatedBackgroundProps {
  variant?: string;
}

export default function AnimatedBackground({ variant = "default" }: AnimatedBackgroundProps) {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Base gradient - neutral dark */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-zinc-950" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Static color orbs for ambient light - no animation */}
      <div
        className="absolute top-0 left-1/4 w-[40rem] h-[40rem] rounded-full opacity-[0.05]"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[35rem] h-[35rem] rounded-full opacity-[0.04]"
        style={{
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.8) 0%, transparent 70%)",
        }}
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50" />
    </div>
  );
}
