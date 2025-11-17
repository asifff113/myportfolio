"use client";

import React from "react";
import { motion } from "framer-motion";
import { SkillCategory, Skill } from "@/lib/content-types";
import SkillListItem from "./SkillListItem";
import { getCategoryColor } from "@/lib/skills-utils";

interface CompactListViewProps {
  skillCategories: SkillCategory[];
  onSkillClick?: (skillName: string, skillData: Skill) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export default function CompactListView({
  skillCategories,
  onSkillClick,
}: CompactListViewProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="space-y-8"
      id="skills-display"
      role="tabpanel"
      aria-label="Compact list view of skills"
    >
      {skillCategories.map((category, categoryIndex) => {
        const categoryColor = getCategoryColor(category.color, categoryIndex);
        let skillIndexCounter = 0;

        return (
          <motion.div
            key={category.id || categoryIndex}
            variants={categoryVariants}
            className="glass p-6 rounded-xl"
          >
            {/* Category Header */}
            <div className="mb-4 pb-3 border-b border-border">
              <h3 className="text-xl font-display font-bold">
                <span className="text-gradient">{category.name}</span>
              </h3>
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
              )}
            </div>

            {/* Skills List */}
            <div className="space-y-1">
              {category.skills.map((skill) => {
                const currentIndex = skillIndexCounter++;
                return (
                  <SkillListItem
                    key={skill.id || currentIndex}
                    skill={skill}
                    index={currentIndex}
                    onClick={onSkillClick}
                  />
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
