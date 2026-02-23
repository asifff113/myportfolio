"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Clock, CheckCircle2, Circle } from "lucide-react";
import { FutureGoal } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import Card3D from "@/components/ui/Card3D";

interface GoalsSectionProps {
  goals: FutureGoal[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Category colors
const categoryColors: Record<string, string> = {
  Career: "from-purple-500 to-fuchsia-500",
  Education: "from-fuchsia-500 to-purple-500",
  Personal: "from-purple-400 to-pink-500",
  Technical: "from-violet-500 to-purple-500",
  Other: "from-fuchsia-400 to-purple-400",
};

// Priority badges
const priorityConfig: Record<string, { color: string; label: string }> = {
  High: {
    color: "bg-red-100 text-red-700 border border-red-200/60",
    label: "High Priority",
  },
  Medium: {
    color: "bg-yellow-100 text-yellow-700 border border-yellow-200/60",
    label: "Medium Priority",
  },
  Low: {
    color: "bg-green-100 text-green-700 border border-green-200/60",
    label: "Low Priority",
  },
};

// Status icons
const statusIcons: Record<string, React.ElementType> = {
  Planning: Circle,
  "In Progress": Clock,
  Achieved: CheckCircle2,
};

export default function GoalsSection({ goals }: GoalsSectionProps) {
  if (!goals || goals.length === 0) {
    return null;
  }

  return (
    <Section id="future-goals" sectionId="goals">
      <SectionTitle
        title="Future Goals"
        subtitle="My aspirations and what I'm working towards"
        gradient="from-purple-400 via-fuchsia-400 to-purple-300"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {goals.map((goal, index) => {
          const StatusIcon = statusIcons[goal.status || "Planning"];
          const gradientColor = categoryColors[goal.category || "Other"];
          const progressPercent = goal.status === "Achieved" ? 100 : goal.status === "In Progress" ? 50 : 10;
          // Slightly larger ring: r=28 => circumference = 2*pi*28 = 175.93
          const circumference = 175.93;
          const offset = circumference - (circumference * progressPercent) / 100;

          return (
            <motion.div
              key={goal.id || index}
              variants={itemVariants}
              className="h-full"
            >
              <Card3D glowColor="purple" intensity="medium" className="bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 rounded-2xl p-6 relative overflow-hidden group transition-all shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.3)] border-t-2 border-t-transparent border-beam h-full">
                <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-40" />
                <div className="relative z-10 flex flex-col h-full">
              {/* Category Gradient Top Border */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradientColor}`} />

              {/* Progress Ring */}
              <div className="absolute top-6 right-6">
                <div className="relative w-18 h-18 flex items-center justify-center" style={{ width: "72px", height: "72px" }}>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-zinc-200"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      className={`${
                        goal.status === "Achieved"
                          ? "text-green-500"
                          : goal.status === "In Progress"
                          ? "text-purple-500"
                          : "text-zinc-600"
                      } transition-all duration-1000 ease-out`}
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-slate-300">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              {/* Header */}
              <div className="flex items-start justify-between mb-4 pr-24">
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`p-3 rounded-xl bg-gradient-to-r ${gradientColor}`}
                  >
                    <Target className="text-white" size={22} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-slate-400">{goal.category}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-400 mb-4 leading-relaxed">
                {goal.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Timeframe */}
                {goal.targetDate && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/15 border border-purple-200/40 rounded-full text-xs font-medium text-slate-300">
                    <Clock size={14} />
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                )}

                {/* Status */}
                {goal.status && StatusIcon && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-200/60 rounded-full text-xs font-medium">
                    <StatusIcon size={14} />
                    {goal.status}
                  </span>
                )}
              </div>
              </div>
              </Card3D>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
