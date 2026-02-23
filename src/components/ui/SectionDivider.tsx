"use client";

import React from "react";

/**
 * Futuristic section divider with animated energy beam running through it,
 * plus a glowing dot at center. Used between sections for visual separation.
 */
export default function SectionDivider() {
  return (
    <div className="relative py-4" aria-hidden>
      <div className="section-divider" />
      {/* Animated energy pulse traveling along the line via CSS */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-[3px] w-16 rounded-full bg-gradient-to-r from-transparent via-[rgba(var(--section-rgb),0.8)] to-transparent blur-[1px] animate-[energy-pulse_3s_linear_infinite]"
      />
      {/* Second pulse trailing behind */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-[2px] w-10 rounded-full bg-gradient-to-r from-transparent via-[rgba(var(--section-rgb),0.5)] to-transparent blur-[2px] animate-[energy-pulse_3s_linear_infinite] [animation-delay:1.5s]"
      />
    </div>
  );
}
