import React from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";
import FloatingOrbs from "./FloatingOrbs";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "full";
  noPadding?: boolean;
  sectionId?: string;
}

/**
 * Reusable section wrapper component
 * Provides consistent spacing, structure, and data-section for color cascade
 * Enhanced with futuristic holo-grid, section dividers, ambient glow, and floating orbs
 */
export default function Section({
  children,
  id,
  className,
  containerSize = "lg",
  noPadding = false,
  sectionId,
}: SectionProps) {
  return (
    <section
      id={id}
      data-section={sectionId || id}
      className={cn(
        "relative overflow-visible",
        !noPadding && "py-20 md:py-28",
        className
      )}
    >
      {/* Floating ambient orbs for depth */}
      <FloatingOrbs count={3} />

      {/* Section-colored ambient glow orbs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70">
        <div className="absolute left-[6%] top-4 h-24 w-24 rounded-full blur-3xl bg-[rgba(var(--section-rgb),0.18)]" />
        <div className="absolute right-[8%] top-10 h-20 w-32 rounded-full blur-3xl bg-[rgba(var(--section-rgb),0.14)]" />
        <div className="absolute left-[40%] -top-4 h-16 w-40 rounded-full blur-3xl bg-[rgba(var(--section-rgb),0.10)]" />
      </div>

      {/* Bottom section divider line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(var(--section-rgb),0.25)] to-transparent" />

      <Container size={containerSize} className="relative z-10">
        <div className="section-shell holo-card">
          {children}
        </div>
      </Container>
    </section>
  );
}
