"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skill } from "@/lib/content-types";
import { getTagSize, getProficiencyColor } from "@/lib/skills-utils";
import { cn } from "@/lib/utils";

interface SkillTagProps {
  skill: Skill;
  index: number;
  onClick?: (skillName: string, skillData: Skill) => void;
}

export default function SkillTag({ skill, index, onClick }: SkillTagProps) {
  const level = skill.level || 50;
  const yearsOfExperience = skill.yearsOfExperience || 0;
  const tagSizeClass = getTagSize(level);
  const gradientClass = getProficiencyColor(level);

  // Calculate opacity based on years of experience (more experience = more opaque)
  const getOpacity = () => {
    if (yearsOfExperience >= 5) return "opacity-100";
    if (yearsOfExperience >= 3) return "opacity-90";
    if (yearsOfExperience >= 1) return "opacity-80";
    return "opacity-70";
  };

  // Determine if skill should have gradient background (high proficiency)
  const hasGradient = level >= 75;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.03,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      whileHover={{
        scale: 1.1,
        y: -5,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick?.(skill.name, skill)}
      className={cn(
        "relative rounded-full font-medium transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        tagSizeClass,
        getOpacity(),
        hasGradient
          ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg`
          : "glass text-foreground hover:bg-secondary/80",
        onClick && "cursor-pointer"
      )}
      aria-label={`${skill.name}, ${level}% proficiency${
        yearsOfExperience ? `, ${yearsOfExperience} years of experience` : ""
      }`}
      title={skill.description || skill.name}
    >
      {/* Icon if available */}
      {skill.icon && (
        <span className="mr-1.5" role="img" aria-hidden="true">
          {skill.icon}
        </span>
      )}
      
      {/* Skill Name */}
      <span>{skill.name}</span>

      {/* Glow effect for high proficiency skills */}
      {level >= 90 && (
        <motion.div
          className="absolute inset-0 rounded-full blur-md opacity-50 -z-10"
          style={{
            background: `linear-gradient(to right, #C084FC, #F472B6, #22D3EE)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
}
