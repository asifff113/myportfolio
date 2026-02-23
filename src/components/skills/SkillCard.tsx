"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SkillCategory } from "@/lib/content-types";
import { getCategoryColor, formatExperience } from "@/lib/skills-utils";
import ProficiencyIndicator from "./ProficiencyIndicator";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  category: SkillCategory;
  categoryIndex: number;
  onSkillClick?: (skillName: string, skillData: any) => void;
}

const skillItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
    },
  }),
};

export default function SkillCard({
  category,
  categoryIndex,
  onSkillClick,
}: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const categoryColor = React.useMemo(
    () => getCategoryColor(category.color, categoryIndex),
    [category.color, categoryIndex]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: categoryIndex * 0.1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      className={cn(
        "group relative overflow-hidden card-lift glass-ultra p-6 md:p-8 rounded-2xl transition-all duration-300 border-beam",
        "neon-glow-hover",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        isHovered && "border-gradient shimmer"
      )}
      style={{
        borderColor: isHovered ? categoryColor : undefined,
      }}
    >
      <div className="pointer-events-none absolute inset-0 holo-grid opacity-30" />
      <div className="pointer-events-none absolute -top-14 -right-10 h-24 w-24 rounded-full blur-2xl bg-[rgba(var(--section-rgb),0.14)] group-hover:scale-110 transition-transform duration-500" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 h-24 w-24 rounded-full blur-2xl bg-[rgba(var(--section-rgb),0.10)]" />
      <div className="pointer-events-none absolute top-4 right-4 flex items-center gap-1.5 opacity-70">
        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(var(--section-rgb),0.9)] twinkle" />
        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(var(--section-rgb),0.6)] twinkle delay-1" />
        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(var(--section-rgb),0.45)] twinkle delay-2" />
      </div>

      {/* Category Header */}
      <div className="mb-6 relative z-10">
        {/* Category Icon/Emoji */}
        {category.name && (
          <motion.div
            className="mb-3 inline-flex items-center gap-3 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5 px-3 py-2"
            animate={isHovered ? { y: -2 } : { y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <span className="text-3xl" role="img" aria-label={category.name}>
              {getCategoryIcon(category.name)}
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Category</span>
          </motion.div>
        )}

        {/* Category Name */}
        <h3 className="text-2xl font-display font-bold mb-2">
          <span className="text-gradient">{category.name}</span>
        </h3>

        {/* Category Description */}
        {category.description && (
          <p className="text-sm text-muted-foreground">{category.description}</p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6 relative z-10" />

      {/* Skills List */}
      <div className="space-y-4 relative z-10">
        {category.skills.map((skill, skillIndex) => (
          <motion.div
            key={skill.id || skillIndex}
            custom={skillIndex}
            variants={skillItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onClick={() => onSkillClick?.(skill.name, skill)}
            className={cn(
              "space-y-2 p-3 rounded-xl transition-all duration-200 border border-transparent",
              onSkillClick && "cursor-pointer hover:bg-secondary/20 hover:border-white/10 hover:translate-x-1"
            )}
            role={onSkillClick ? "button" : undefined}
            tabIndex={onSkillClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onSkillClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSkillClick(skill.name, skill);
              }
            }}
          >
            {/* Skill Name and Level */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {skill.icon && (
                  <span className="text-lg" role="img" aria-label={skill.name}>
                    {skill.icon}
                  </span>
                )}
                <span className="font-semibold text-white/95">{skill.name}</span>
              </div>
              {skill.level !== undefined && (
                <span className="text-sm text-muted-foreground tabular-nums">
                  {skill.level}%
                </span>
              )}
            </div>

            {/* Progress Bar */}
            {skill.level !== undefined && (
              <ProficiencyIndicator
                level={skill.level}
                variant="progress"
                showPercentage={false}
                size="md"
              />
            )}

            {/* Years of Experience */}
            {skill.yearsOfExperience !== undefined && (
              <p className="text-xs text-muted-foreground">
                {formatExperience(skill.yearsOfExperience)} of experience
              </p>
            )}

            {/* Description */}
            {skill.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {skill.description}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Helper function to get category icon based on name
function getCategoryIcon(categoryName: string): string {
  const name = categoryName.toLowerCase();
  
  if (name.includes("frontend") || name.includes("front-end")) return "🎨";
  if (name.includes("backend") || name.includes("back-end")) return "⚙️";
  if (name.includes("database")) return "🗄️";
  if (name.includes("devops") || name.includes("deployment")) return "🚀";
  if (name.includes("mobile")) return "📱";
  if (name.includes("design")) return "✨";
  if (name.includes("tool")) return "🔧";
  if (name.includes("language")) return "💻";
  if (name.includes("framework")) return "🏗️";
  if (name.includes("soft") || name.includes("personal")) return "🤝";
  if (name.includes("cloud")) return "☁️";
  if (name.includes("security")) return "🔒";
  if (name.includes("testing") || name.includes("qa")) return "🧪";
  
  return "📚"; // Default icon
}
