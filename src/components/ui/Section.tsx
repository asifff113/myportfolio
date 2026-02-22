import React from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";

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
      <div className="pointer-events-none absolute inset-x-0 top-6 h-28 opacity-90">
        <div className="absolute left-[8%] top-0 h-20 w-20 rounded-full blur-2xl bg-[rgba(var(--section-rgb),0.18)]" />
        <div className="absolute right-[10%] top-8 h-16 w-28 rounded-full blur-2xl bg-[rgba(var(--section-rgb),0.14)]" />
      </div>

      <Container size={containerSize} className="relative z-10">
        <div className="section-shell">
          {children}
        </div>
      </Container>
    </section>
  );
}
