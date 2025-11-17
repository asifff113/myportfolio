"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";
import { EducationItem } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { formatDateRange } from "@/lib/utils";

interface EducationSectionProps {
  education: EducationItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function EducationSection({ education }: EducationSectionProps) {
  if (!education || education.length === 0) {
    return null;
  }

  return (
    <Section id="education" className="relative">
      <SectionTitle
        title="Education"
        subtitle="My academic journey and qualifications"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative"
      >
        {/* Timeline Line */}
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-purple via-neon-pink to-neon-cyan opacity-30" />

        {/* Education Items */}
        <div className="space-y-8">
          {education.map((item, index) => (
            <motion.div
              key={item.id || index}
              variants={itemVariants}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="hidden md:flex absolute left-8 top-8 w-4 h-4 -ml-2 items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan animate-pulse" />
              </div>

              {/* Content Card - ENHANCED BEAUTIFUL STYLE */}
              <motion.div
                whileHover={{ scale: 1.03, x: 15, y: -8 }}
                className="md:ml-20 glass-ultra p-8 md:p-10 rounded-3xl relative overflow-hidden group card-3d border-2 border-white/10 hover:border-white/20 shadow-2xl"
              >
                {/* Large Decorative Wave Background */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-gradient-to-tr from-purple-500/15 via-pink-500/15 to-rose-500/15 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                
                {/* Gradient Accent - THICKER & BRIGHTER */}
                <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 via-cyan-500 to-teal-500 glow-pulse shadow-lg shadow-cyan-500/50" />

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1 relative z-10">
                    <div className="flex items-start gap-5 mb-2">
                      {/* Icon - MUCH BIGGER & MORE BEAUTIFUL */}
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 3, -3, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/30 via-cyan-500/30 to-teal-500/30 flex-shrink-0 border-2 border-cyan-400/40 group-hover:border-cyan-400/60 shadow-xl shadow-blue-500/20 group-hover:shadow-2xl group-hover:shadow-cyan-500/40 transition-all"
                      >
                        <GraduationCap className="text-cyan-300 group-hover:text-cyan-200 transition-colors" size={36} />
                      </motion.div>
                      <div>
                        {/* Degree - BIGGER & GRADIENT TEXT */}
                        <h3 className="text-2xl md:text-3xl font-display font-bold mb-2 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-teal-300 transition-all">
                          {item.degree}
                        </h3>
                        {item.field && (
                          <p className="text-lg md:text-xl text-cyan-400 font-bold mb-1 group-hover:text-cyan-300 transition-colors">
                            {item.field}
                          </p>
                        )}
                        <p className="text-base md:text-lg text-gray-300 font-semibold group-hover:text-gray-200 transition-colors">
                          {item.institution}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Badge - MORE PROMINENT */}
                  {item.isCurrent && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 border-2 border-green-400/50 rounded-full text-sm font-bold shadow-lg shadow-green-500/20 relative z-10"
                    >
                      <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                      Current
                    </motion.span>
                  )}
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  {/* Date Range */}
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {formatDateRange(
                        item.startDate,
                        item.endDate,
                        item.isCurrent
                      )}
                    </span>
                  </div>

                  {/* Location */}
                  {item.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{item.location}</span>
                    </div>
                  )}

                  {/* Grade */}
                  {item.grade && (
                    <div className="flex items-center gap-2">
                      <Award size={16} />
                      <span className="font-semibold text-primary">
                        {item.grade}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-pink/10 to-neon-cyan/10 animate-pulse" />
                  <div className="absolute inset-0 neon-glow" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

