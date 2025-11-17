"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type DisplayMode = "grid" | "tagCloud" | "compact";

interface DisplayModeConfig {
  mode: DisplayMode;
  label: string;
  icon: JSX.Element;
  description: string;
}

interface DisplayModeToggleProps {
  currentMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  className?: string;
}

const DISPLAY_MODES: DisplayModeConfig[] = [
  {
    mode: "grid",
    label: "Grid View",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
        />
      </svg>
    ),
    description: "Card-based layout with detailed information",
  },
  {
    mode: "tagCloud",
    label: "Tag Cloud",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"
        />
      </svg>
    ),
    description: "Visual tag cloud weighted by proficiency",
  },
  {
    mode: "compact",
    label: "Compact List",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    ),
    description: "Dense list for quick scanning",
  },
];

export default function DisplayModeToggle({
  currentMode,
  onModeChange,
  className,
}: DisplayModeToggleProps) {
  return (
    <div
      className={cn("flex justify-center mb-8", className)}
      role="tablist"
      aria-label="Display mode selection"
    >
      <div className="glass rounded-xl p-1 inline-flex gap-1">
        {DISPLAY_MODES.map((config) => {
          const isActive = currentMode === config.mode;

          return (
            <button
              key={config.mode}
              onClick={() => onModeChange(config.mode)}
              role="tab"
              aria-selected={isActive}
              aria-controls="skills-display"
              aria-label={`${config.label}: ${config.description}`}
              title={config.description}
              className={cn(
                "relative px-4 py-2 rounded-lg transition-all duration-300",
                "flex items-center gap-2 font-medium text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan rounded-lg"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}

              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                {config.icon}
                <span className="hidden sm:inline">{config.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
