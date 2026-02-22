"use client";

import React from "react";

/**
 * Vibrant Animated Background — Light Futuristic Aurora
 * Performance-optimized: CSS-only animations, GPU composited layers
 * Beautiful multi-color aurora blobs on a clean white/cream canvas
 */

interface AnimatedBackgroundProps {
  variant?: string;
}

export default function AnimatedBackground({ variant = "default" }: AnimatedBackgroundProps) {
  const isHero = variant === "hero";

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Base: very subtle warm white gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-white to-cyan-50/40" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(124,58,237,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(124,58,237,0.15) 1px, transparent 1px)
          `,
          backgroundSize: isHero ? "60px 60px" : "80px 80px",
          maskImage: "radial-gradient(ellipse 80% 60% at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at center, black 30%, transparent 80%)",
        }}
      />

      {/* Aurora blobs with vibrant colors */}
      <div className="aurora-blob top-[-8rem] left-[-4rem] h-[32rem] w-[32rem] bg-violet-400/20" />
      <div className="aurora-blob delay-1 top-[8%] right-[-6rem] h-[28rem] w-[28rem] bg-orange-300/18" />
      <div className="aurora-blob delay-2 bottom-[-6rem] left-[15%] h-[30rem] w-[30rem] bg-cyan-300/18" />
      <div className="aurora-blob delay-1 bottom-[-8rem] right-[10%] h-[26rem] w-[26rem] bg-emerald-300/15" />
      <div className="aurora-blob top-[40%] left-[50%] h-[24rem] w-[24rem] bg-rose-300/10" />

      {/* Decorative light beams */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-20 left-1/2 h-px w-[min(90vw,75rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
        <div className="absolute top-[26rem] left-1/2 h-px w-[min(85vw,65rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        <div className="absolute bottom-32 left-1/2 h-px w-[min(80vw,60rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-400/25 to-transparent" />
      </div>

      {/* Very subtle radial lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(124,58,237,0.04),transparent_60%)]" />
    </div>
  );
}
