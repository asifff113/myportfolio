"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import { ExperienceItem } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { formatDateRange } from "@/lib/utils";

interface ExperienceSectionProps {
  experience: ExperienceItem[];
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

// Type badge colors
const typeColors: Record<string, string> = {
  "Full-time": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Part-time": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Internship": "bg-green-500/10 text-green-500 border-green-500/20",
  "Freelance": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Contract": "bg-pink-500/10 text-pink-500 border-pink-500/20",
};

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  // If no experience, show a friendly message
  if (!experience || experience.length === 0) {
    return (
      <Section id="experience" className="bg-muted/20">
        <SectionTitle
          title="Work Experience"
          subtitle="Building skills through projects and learning"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="glass p-12 rounded-2xl">
            <div className="text-6xl mb-6">🚀</div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-gradient">Just Getting Started</span>
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              I'm actively learning and building projects to develop my skills. 
              While I may not have formal work experience yet, I'm passionate 
              about technology and eager to contribute to meaningful projects.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold">Open to Opportunities</span>
            </div>
          </div>
        </motion.div>
      </Section>
    );
  }

  return (
    <Section id="experience" className="bg-muted/20">
      <SectionTitle
        title="Work Experience"
        subtitle="My professional journey and contributions"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative"
      >
        {/* Timeline Line */}
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-pink to-neon-purple opacity-30" />

        {/* Experience Items */}
        <div className="space-y-8">
          {experience.map((item, index) => (
            <motion.div
              key={item.id || index}
              variants={itemVariants}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="hidden md:flex absolute left-8 top-8 w-4 h-4 -ml-2 items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink animate-pulse" />
              </div>

              {/* Content Card - ENHANCED BEAUTIFUL STYLE */}
              <motion.div
                whileHover={{ scale: 1.03, x: 15, y: -8 }}
                className="md:ml-20 glass-ultra p-8 md:p-10 rounded-3xl relative overflow-hidden group card-3d border-2 border-white/10 hover:border-white/20 shadow-2xl"
              >
                {/* Large Decorative Wave Background */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-gradient-to-tr from-pink-500/15 via-purple-500/15 to-fuchsia-500/15 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                
                {/* Gradient Accent - THICKER & BRIGHTER */}
                <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-cyan-500 via-pink-500 to-purple-500 glow-pulse shadow-lg shadow-pink-500/50" />

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
                        className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-blue-500/30 to-indigo-500/30 flex-shrink-0 border-2 border-cyan-400/40 group-hover:border-pink-400/60 shadow-xl shadow-cyan-500/20 group-hover:shadow-2xl group-hover:shadow-pink-500/40 transition-all"
                      >
                        <Briefcase className="text-cyan-300 group-hover:text-pink-200 transition-colors" size={36} />
                      </motion.div>
                      <div>
                        {/* Role - BIGGER & GRADIENT TEXT */}
                        <h3 className="text-2xl md:text-3xl font-display font-bold mb-2 bg-gradient-to-r from-white via-cyan-200 to-pink-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-pink-300 group-hover:to-purple-300 transition-all">
                          {item.role}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-lg md:text-xl text-cyan-400 font-bold group-hover:text-pink-300 transition-colors">
                            {item.company}
                          </p>
                          {item.companyUrl && (
                            <a
                              href={item.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
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

                    {/* Type Badge */}
                    {item.type && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${typeColors[item.type] || typeColors["Full-time"]}`}>
                        {item.type}
                      </span>
                    )}
                  </div>
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
                </div>

                {/* Description */}
                {item.description && (
                  <div className="mb-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {item.description.split("\n").map((line, i) => (
                        <p key={i} className="text-muted-foreground leading-relaxed mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                      Technologies Used:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, techIndex) => (
                        <motion.span
                          key={techIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: techIndex * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 via-neon-pink/10 to-neon-purple/10 animate-pulse" />
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

