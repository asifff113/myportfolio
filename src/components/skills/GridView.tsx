"use client";

import React from "react";
import { motion } from "framer-motion";
import { SkillCategory } from "@/lib/content-types";
import SkillCard from "./SkillCard";

interface GridViewProps {
  skillCategories: SkillCategory[];
  onSkillClick?: (skillName: string, skillData: any) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function GridView({
  skillCategories,
  onSkillClick,
}: GridViewProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      id="skills-display"
      role="tabpanel"
      aria-label="Grid view of skills"
    >
      {skillCategories.map((category, index) => (
        <SkillCard
          key={category.id || index}
          category={category}
          categoryIndex={index}
          onSkillClick={onSkillClick}
        />
      ))}
    </motion.div>
  );
}
