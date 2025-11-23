"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Star, Medal, ExternalLink } from "lucide-react";
import { Achievement } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { formatDate } from "@/lib/utils";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// Category icons
const categoryIcons: Record<string, React.ElementType> = {
  Competition: Trophy,
  Award: Award,
  Recognition: Star,
  Certification: Medal,
};

// Category colors
const categoryColors: Record<string, string> = {
  Competition: "from-yellow-500 to-orange-500",
  Award: "from-purple-500 to-pink-500",
  Recognition: "from-blue-500 to-cyan-500",
  Certification: "from-green-500 to-emerald-500",
};

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <Section id="achievements">
      <SectionTitle
        title="Achievements & Awards"
        subtitle="Recognition and milestones along my journey"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {achievements.map((achievement, index) => {
          const Icon = categoryIcons[achievement.category || "Recognition"] || Star;
          const gradientColor = categoryColors[achievement.category || "Recognition"] || categoryColors.Recognition;

          return (
            <motion.div
              key={achievement.id || index}
              variants={itemVariants}
              whileHover={{ y: -12, scale: 1.06 }}
              className="glass-ultra p-8 md:p-10 rounded-3xl relative overflow-hidden group card-3d border-2 border-white/10 hover:border-white/20 shadow-2xl"
            >
              {/* Large Decorative Wave Background */}
              <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-br ${gradientColor} opacity-20 blur-3xl group-hover:scale-125 group-hover:opacity-35 transition-all duration-700`} />
              <div className={`absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-gradient-to-tr ${gradientColor} opacity-15 blur-3xl group-hover:scale-125 group-hover:opacity-30 transition-all duration-700`} />
              
              {/* Gradient Top Border - THICKER */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${gradientColor} shimmer shadow-lg shadow-primary/50`} />

              {/* Icon - MUCH BIGGER & MORE BEAUTIFUL */}
              <div className="relative mb-6 z-10">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  animate={{
                    scale: [1, 1.08, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`inline-flex p-6 rounded-3xl bg-gradient-to-br ${gradientColor} relative shimmer border-2 border-white/20 shadow-2xl`}
                >
                  <Icon className="text-white" size={56} />
                  
                  {/* Enhanced Glow Effect - STRONGER */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradientColor} blur-3xl opacity-70 group-hover:opacity-100 transition-opacity glow-pulse`} />
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Category Badge */}
                {achievement.category && (
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3">
                    {achievement.category}
                  </span>
                )}

                {/* Title - BIGGER & GRADIENT */}
                <h3 className={`text-2xl md:text-3xl font-display font-bold mb-3 bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent group-hover:scale-105 transition-transform`}>
                  {achievement.title}
                </h3>

                {/* Organization - BIGGER */}
                <p className="text-lg md:text-xl text-primary font-bold mb-3 group-hover:text-primary/80 transition-colors">
                  {achievement.organization}
                </p>

                {/* Date */}
                <p className="text-sm text-muted-foreground mb-3">
                  {formatDate(achievement.date)}
                </p>

                {/* Description - BIGGER */}
                {achievement.description && (
                  <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-5 font-medium group-hover:text-gray-200 transition-colors">
                    {achievement.description}
                  </p>
                )}

                {/* File/Certificate Link */}
                {(achievement.fileUrl || achievement.certificateUrl) && (
                  <a
                    href={achievement.fileUrl || achievement.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    <span>
                      {achievement.fileUrl 
                        ? `View ${achievement.fileType === 'pdf' ? 'Certificate (PDF)' : 'Image'}`
                        : 'View Certificate'
                      }
                    </span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradientColor} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`}
              />

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-5`} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Achievement Stats (Optional Enhancement) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-12 glass-ultra p-8 md:p-10 rounded-2xl relative overflow-hidden group"
      >
        {/* Decorative glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
          <motion.div whileHover={{ scale: 1.05, y: -5 }}>
            <div className="text-5xl font-display font-bold text-gradient mb-2 neon-text">
              {achievements.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Achievements
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }}>
            <div className="text-5xl font-display font-bold text-gradient mb-2 neon-text">
              {achievements.filter(a => a.category === "Competition").length}
            </div>
            <div className="text-sm text-muted-foreground">
              Competitions Won
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }}>
            <div className="text-5xl font-display font-bold text-gradient mb-2 neon-text">
              {achievements.filter(a => a.category === "Award").length}
            </div>
            <div className="text-sm text-muted-foreground">
              Awards Received
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }}>
            <div className="text-5xl font-display font-bold text-gradient mb-2 neon-text">
              {achievements.filter(a => a.category === "Recognition").length}
            </div>
            <div className="text-sm text-muted-foreground">
              Recognitions
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}

