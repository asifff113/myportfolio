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
        "card-lift glass-ultra p-6 md:p-8 rounded-2xl transition-all duration-300",
        "neon-glow-hover",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        isHovered && "border-gradient shimmer"
      )}
      style={{
        borderColor: isHovered ? categoryColor : undefined,
      }}
    >
      {/* Category Header */}
      <div className="mb-6">
        {/* Category Icon/Emoji */}
        {category.name && (
          <div className="mb-3">
            <span className="text-3xl" role="img" aria-label={category.name}>
              {getCategoryIcon(category.name)}
            </span>
          </div>
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
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

      {/* Skills List */}
      <div className="space-y-4">
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
              "space-y-2 p-3 rounded-lg transition-colors duration-200",
              onSkillClick && "cursor-pointer hover:bg-secondary/50"
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
                <span className="font-semibold">{skill.name}</span>
              </div>
              {skill.level !== undefined && (
                <span className="text-sm text-muted-foreground">
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
