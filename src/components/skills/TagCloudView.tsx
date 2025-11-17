"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { SkillCategory, Skill } from "@/lib/content-types";
import SkillTag from "./SkillTag";

interface TagCloudViewProps {
  skillCategories: SkillCategory[];
  onSkillClick?: (skillName: string, skillData: Skill) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

export default function TagCloudView({
  skillCategories,
  onSkillClick,
}: TagCloudViewProps) {
  // Flatten all skills and sort by proficiency level
  const sortedSkills = useMemo(() => {
    const allSkills: Skill[] = [];
    
    skillCategories.forEach((category) => {
      category.skills.forEach((skill) => {
        allSkills.push(skill);
      });
    });

    // Sort by proficiency level (highest first) for visual hierarchy
    return allSkills.sort((a, b) => {
      const levelA = a.level || 50;
      const levelB = b.level || 50;
      return levelB - levelA;
    });
  }, [skillCategories]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="flex flex-wrap justify-center items-center gap-3 md:gap-4"
      id="skills-display"
      role="tabpanel"
      aria-label="Tag cloud view of skills"
    >
      {sortedSkills.map((skill, index) => (
        <SkillTag
          key={skill.id || `${skill.name}-${index}`}
          skill={skill}
          index={index}
          onClick={onSkillClick}
        />
      ))}
    </motion.div>
  );
}
