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
        "relative",
        !noPadding && "py-20 md:py-28",
        className
      )}
    >
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
}
