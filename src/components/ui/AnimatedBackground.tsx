"use client";

import React from "react";

/**
 * Vibrant Animated Background — Dark Futuristic Aurora
 * Performance-optimized: CSS-only animations, GPU composited layers
 * Rich multi-color aurora blobs on a deep dark canvas
 */

interface AnimatedBackgroundProps {
  variant?: string;
}

export default function AnimatedBackground({ variant = "default" }: AnimatedBackgroundProps) {
  const isHero = variant === "hero";

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Base: deep dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0c0e24] to-[#0a0a1a]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(124,58,237,0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(124,58,237,0.25) 1px, transparent 1px)
          `,
          backgroundSize: isHero ? "60px 60px" : "80px 80px",
          maskImage: "radial-gradient(ellipse 80% 60% at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at center, black 30%, transparent 80%)",
        }}
      />

      {/* Vivid aurora blobs with rich colors - mix-blend-mode: screen for glow */}
      <div className="aurora-blob top-[-10rem] left-[-6rem] h-[36rem] w-[36rem] bg-violet-600/30" />
      <div className="aurora-blob delay-1 top-[5%] right-[-8rem] h-[32rem] w-[32rem] bg-orange-500/20" />
      <div className="aurora-blob delay-2 bottom-[-8rem] left-[10%] h-[34rem] w-[34rem] bg-cyan-500/25" />
      <div className="aurora-blob delay-1 bottom-[-10rem] right-[8%] h-[30rem] w-[30rem] bg-emerald-500/20" />
      <div className="aurora-blob top-[35%] left-[45%] h-[28rem] w-[28rem] bg-rose-500/15" />
      <div className="aurora-blob delay-2 top-[60%] left-[20%] h-[24rem] w-[24rem] bg-indigo-500/20" />

      {/* Rotating conic halo ring */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25">
        <div className="w-[min(96vw,72rem)] h-[min(96vw,72rem)] rounded-full border border-violet-500/10 relative">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(124,58,237,0.2),transparent,rgba(6,182,212,0.16),transparent)] animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-10 rounded-full border border-cyan-500/10 animate-[spin_22s_linear_infinite_reverse]" />
        </div>
      </div>

      {/* Drifting neon dots */}
      <div className="absolute inset-0">
        <div className="absolute top-[22%] left-[12%] w-2 h-2 rounded-full bg-cyan-400/70 blur-[1px] float-y-slow" />
        <div className="absolute top-[30%] right-[16%] w-1.5 h-1.5 rounded-full bg-violet-400/70 blur-[1px] float-y-slow delay-1" />
        <div className="absolute bottom-[18%] left-[20%] w-2 h-2 rounded-full bg-orange-400/60 blur-[1px] float-y-slow delay-2" />
        <div className="absolute bottom-[24%] right-[22%] w-1.5 h-1.5 rounded-full bg-emerald-400/70 blur-[1px] float-y-slow" />
      </div>

      {/* Decorative light beams */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-1/2 h-px w-[min(90vw,75rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div className="absolute top-[26rem] left-1/2 h-px w-[min(85vw,65rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="absolute bottom-32 left-1/2 h-px w-[min(80vw,60rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-400/35 to-transparent" />
      </div>

      {/* Radial spot lighting from top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(124,58,237,0.10),transparent_60%)]" />
      
      {/* Bottom glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(6,182,212,0.08),transparent_50%)]" />
    </div>
  );
}
