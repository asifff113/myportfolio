import React from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "full";
  noPadding?: boolean;
}

/**
 * Reusable section wrapper component
 * Provides consistent spacing and structure for all sections
 */
export default function Section({
  children,
  id,
  className,
  containerSize = "lg",
  noPadding = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        !noPadding && "py-20 md:py-32",
        className
      )}
    >
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
}

