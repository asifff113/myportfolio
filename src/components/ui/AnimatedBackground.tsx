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
  const isHero = variant === "hero";

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none noise-overlay">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#0b0c15_0%,#160b1f_35%,#0d1326_68%,#1a0b1a_100%)]" />

      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99,102,241,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99,102,241,0.12) 1px, transparent 1px)
          `,
          backgroundSize: isHero ? "72px 72px" : "96px 96px",
          maskImage: "radial-gradient(circle at center, black 45%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 45%, transparent 100%)",
        }}
      />

      <div className="aurora-blob top-[-10rem] left-[-6rem] h-[28rem] w-[28rem] bg-cyan-600/15" />
      <div className="aurora-blob delay-1 top-[10%] right-[-8rem] h-[30rem] w-[30rem] bg-violet-600/15" />
      <div className="aurora-blob delay-2 bottom-[-8rem] left-[20%] h-[26rem] w-[26rem] bg-indigo-600/15" />
      <div className="aurora-blob delay-1 bottom-[-9rem] right-[8%] h-[24rem] w-[24rem] bg-blue-600/15" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(11,12,21,0.5),transparent_52%),radial-gradient(circle_at_50%_100%,rgba(11,12,21,0.5),transparent_56%)]" />

      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-16 left-1/2 h-px w-[min(92vw,80rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute top-[22rem] left-1/2 h-px w-[min(88vw,70rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-fuchsia-500/35 to-transparent" />
        <div className="absolute bottom-24 left-1/2 h-px w-[min(86vw,72rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent" />
      </div>
    </div>
  );
}
