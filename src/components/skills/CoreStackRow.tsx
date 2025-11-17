"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Skill } from "@/lib/content-types";

interface CoreStackRowProps {
  coreSkills: Skill[];
  onSkillClick?: (skillName: string, skill: Skill) => void;
}

export default function CoreStackRow({ coreSkills, onSkillClick }: CoreStackRowProps) {
  if (coreSkills.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="glass p-6 rounded-2xl border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Zap size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Core Tech Stack</h3>
            <p className="text-sm text-muted-foreground">
              Technologies I use daily in production
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {coreSkills.map((skill, index) => (
            <motion.button
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSkillClick?.(skill.name, skill)}
              className="group relative px-4 py-2 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 hover:from-primary/20 hover:via-accent/20 hover:to-secondary/20 rounded-lg border border-primary/20 hover:border-primary/40 transition-all hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center gap-2">
                {skill.icon && (
                  <span className="text-lg">{skill.icon}</span>
                )}
                <span className="font-medium">{skill.name}</span>
                {skill.level && skill.level >= 85 && (
                  <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-500 rounded">
                    Expert
                  </span>
                )}
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-0 group-hover:opacity-20 rounded-lg blur-xl transition-opacity" />
            </motion.button>
          ))}
        </div>

        {coreSkills.length > 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            Click any skill to see details and projects using it
          </p>
        )}
      </div>
    </motion.div>
  );
}

