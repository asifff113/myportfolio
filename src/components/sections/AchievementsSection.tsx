"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Star, Medal, ExternalLink } from "lucide-react";
import { Achievement } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import Card3D from "@/components/ui/Card3D";
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
    <Section id="achievements" sectionId="achievements">
      <SectionTitle
        title="Achievements & Awards"
        subtitle="Recognition and milestones along my journey"
        gradient="from-yellow-400 via-amber-300 to-yellow-300"
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
              className="h-full"
            >
              <Card3D glowColor="amber" intensity="medium" className="bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-amber-500/20 border-t-2 border-t-amber-500 hover:border-amber-400/40 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(245,158,11,0.3)] border-beam h-full">
                <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-40" />
                <div className="relative z-10 flex flex-col h-full">
              {/* Icon */}
              <div className="relative mb-6 z-10">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="inline-flex p-4 rounded-2xl bg-amber-500/20 border border-amber-200/40"
                >
                  <Icon className="text-amber-400" size={40} />
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Category Badge */}
                {achievement.category && (
                  <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-200/40 text-amber-300 rounded-full text-xs font-medium mb-3">
                    {achievement.category}
                  </span>
                )}

                {/* Title */}
                <h3 className={`text-xl md:text-2xl font-display font-bold mb-3 bg-gradient-to-r ${gradientColor} bg-clip-text text-transparent`}>
                  {achievement.title}
                </h3>

                {/* Organization */}
                <p className="text-base text-amber-400 font-semibold mb-2">
                  {achievement.organization}
                </p>

                {/* Date */}
                <p className="text-sm text-slate-400 mb-3">
                  {formatDate(achievement.date)}
                </p>

                {/* Description */}
                {achievement.description && (
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {achievement.description}
                  </p>
                )}

                {/* File/Certificate Link */}
                {(achievement.fileUrl || achievement.certificateUrl) && (
                  <a
                    href={achievement.fileUrl || achievement.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-500 transition-colors font-medium"
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
              </div>
              </Card3D>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Achievement Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-amber-500/20 p-8 md:p-10 rounded-xl relative overflow-hidden holo-shimmer breathing-glow"
      >
        <div className="absolute inset-0 holo-grid opacity-15 pointer-events-none rounded-xl" />
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <motion.div whileHover={{ scale: 1.05, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
            <div className="text-5xl font-display font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent mb-2 stat-glow">
              {achievements.length}
            </div>
            <div className="text-sm text-slate-400">
              Total Achievements
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
            <div className="text-5xl font-display font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent mb-2 stat-glow">
              {achievements.filter(a => a.category === "Competition").length}
            </div>
            <div className="text-sm text-slate-400">
              Competitions Won
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
            <div className="text-5xl font-display font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent mb-2 stat-glow">
              {achievements.filter(a => a.category === "Award").length}
            </div>
            <div className="text-sm text-slate-400">
              Awards Received
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
            <div className="text-5xl font-display font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-300 bg-clip-text text-transparent mb-2 stat-glow">
              {achievements.filter(a => a.category === "Recognition").length}
            </div>
            <div className="text-sm text-slate-400">
              Recognitions
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
