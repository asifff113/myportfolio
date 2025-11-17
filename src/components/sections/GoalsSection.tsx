"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Clock, CheckCircle2, Circle } from "lucide-react";
import { FutureGoal } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";

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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Category colors - MORE VIBRANT
const categoryColors: Record<string, string> = {
  Career: "from-purple-500 via-pink-500 to-rose-500",
  Education: "from-cyan-500 via-blue-500 to-indigo-500",
  Personal: "from-pink-500 via-rose-500 to-red-500",
  Technical: "from-blue-500 via-cyan-500 to-teal-500",
  Other: "from-orange-500 via-amber-500 to-yellow-500",
};

// Priority badges - MORE COLORFUL
const priorityConfig: Record<string, { color: string; gradient: string; label: string }> = {
  High: { 
    color: "bg-red-500/30 text-red-300 border-red-400/60 shadow-lg shadow-red-500/30", 
    gradient: "from-red-500 via-pink-500 to-rose-500",
    label: "High Priority" 
  },
  Medium: { 
    color: "bg-yellow-500/30 text-yellow-300 border-yellow-400/60 shadow-lg shadow-yellow-500/30", 
    gradient: "from-yellow-500 via-amber-500 to-orange-500",
    label: "Medium Priority" 
  },
  Low: { 
    color: "bg-green-500/30 text-green-300 border-green-400/60 shadow-lg shadow-green-500/30", 
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    label: "Low Priority" 
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
    <Section id="future-goals" className="bg-muted/20">
      <SectionTitle
        title="Future Goals"
        subtitle="My aspirations and what I'm working towards"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative"
      >
        {/* Timeline Line */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple via-neon-pink to-neon-cyan opacity-30" />

        {/* Goals */}
        <div className="space-y-8">
          {goals.map((goal, index) => {
            const isEven = index % 2 === 0;
            const StatusIcon = statusIcons[goal.status || "Planning"];
            const gradientColor = categoryColors[goal.category || "Other"];
            const priorityStyle = priorityConfig[goal.priority || "Medium"];

            return (
              <motion.div
                key={goal.id || index}
                variants={itemVariants}
                className={`relative lg:w-1/2 ${isEven ? "lg:ml-auto lg:pl-12" : "lg:pr-12"}`}
              >
                {/* Timeline Dot */}
                <div className="hidden lg:block absolute top-8 w-4 h-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan">
                  <div className={`absolute inset-0 ${isEven ? "left-full ml-[-8px]" : "right-full mr-[-8px]"}`} />
                </div>

                {/* Goal Card */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="glass-ultra p-6 md:p-8 rounded-2xl relative overflow-hidden group card-3d"
                >
                  {/* Category Gradient Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${gradientColor} shimmer`} />

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`p-3 rounded-xl bg-gradient-to-r ${gradientColor} shimmer`}
                      >
                        <Target className="text-white" size={26} />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-gradient transition-all duration-300 neon-text-hover">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {goal.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Timeframe */}
                    <span className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full text-xs font-medium">
                      <Clock size={14} />
                      {goal.timeframe}
                    </span>

                    {/* Priority */}
                    {goal.priority && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${priorityStyle.color}`}>
                        {priorityStyle.label}
                      </span>
                    )}

                    {/* Status */}
                    {goal.status && StatusIcon && (
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        <StatusIcon size={14} />
                        {goal.status}
                      </span>
                    )}
                  </div>

                  {/* Enhanced Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-10 animate-pulse`} />
                    <div className="absolute inset-0 neon-glow" />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}

