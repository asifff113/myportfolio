"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skill } from "@/lib/content-types";
import { formatExperience } from "@/lib/skills-utils";
import ProficiencyIndicator from "./ProficiencyIndicator";
import { cn } from "@/lib/utils";

interface SkillListItemProps {
  skill: Skill;
  index: number;
  onClick?: (skillName: string, skillData: Skill) => void;
}

export default function SkillListItem({
  skill,
  index,
  onClick,
}: SkillListItemProps) {
  const level = skill.level || 50;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      onClick={() => onClick?.(skill.name, skill)}
      className={cn(
        "flex items-center justify-between py-2 px-3 rounded-lg",
        "transition-colors duration-200",
        onClick && "cursor-pointer hover:bg-secondary/50",
        "focus-within:bg-secondary/50"
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(skill.name, skill);
        }
      }}
    >
      {/* Left side: Icon and Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Icon */}
        {skill.icon && (
          <span
            className="text-lg flex-shrink-0"
            role="img"
            aria-label={skill.name}
          >
            {skill.icon}
          </span>
        )}

        {/* Skill Name */}
        <span className="font-medium truncate">{skill.name}</span>
      </div>

      {/* Middle: Dot Separator (visual only) */}
      <div className="hidden sm:flex items-center gap-2 mx-4 flex-shrink-0">
        <div className="flex-1 border-t border-dotted border-muted-foreground/30 min-w-[20px]" />
      </div>

      {/* Right side: Proficiency and Experience */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Proficiency Dots */}
        {skill.level !== undefined && (
          <ProficiencyIndicator
            level={level}
            variant="dots"
            showPercentage={false}
            size="sm"
          />
        )}

        {/* Years of Experience */}
        {skill.yearsOfExperience !== undefined && (
          <span className="text-xs text-muted-foreground whitespace-nowrap hidden md:inline">
            {formatExperience(skill.yearsOfExperience)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
