"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import { ExperienceItem } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import Card3D from "@/components/ui/Card3D";
import { formatDateRange } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTranslatedExperience } from "@/lib/i18n/useTranslatedContent";

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Type badge colors
const typeColors: Record<string, string> = {
  "Full-time": "bg-blue-500/20 text-blue-300 border-blue-200/60",
  "Part-time": "bg-purple-100 text-purple-700 border-purple-200/60",
  "Internship": "bg-green-100 text-green-700 border-green-200/60",
  "Freelance": "bg-orange-100 text-orange-700 border-orange-200/60",
  "Contract": "bg-pink-100 text-pink-700 border-pink-200/60",
};

export default function ExperienceSection({ experience: initialExperience }: ExperienceSectionProps) {
  const { t, locale } = useLanguage();
  const experience = useTranslatedExperience(initialExperience);

  // If no experience, show a friendly message
  if (!experience || experience.length === 0) {
    return (
      <Section id="experience" sectionId="experience">
        <SectionTitle
          title={t.sections.experience.title}
          subtitle={t.sections.experience.subtitle}
          gradient="from-blue-400 via-slate-300 to-blue-300"
        />
        <div className="text-center py-12 text-slate-400">
          No experience entries found.
        </div>
      </Section>
    );
  }

  return (
    <Section id="experience" sectionId="experience">
      <SectionTitle
        title={t.sections.experience.title}
        subtitle={t.sections.experience.subtitle}
        gradient="from-blue-400 via-slate-300 to-blue-300"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {experience.map((item, index) => (
          <motion.div
            key={item.id || index}
            variants={itemVariants}
          >
            <Card3D
              glowColor="blue"
              className="bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-blue-500/20 hover:border-blue-400/40 border-t-2 border-t-blue-500 rounded-2xl p-6 md:p-8 transition-all shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(59,130,246,0.3)] border-beam"
            >
              <div className="absolute inset-0 holo-grid opacity-20 group-hover:opacity-40 pointer-events-none transition-opacity duration-300" />
              <div className="relative z-10">
              {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-2">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-blue-500/20 border border-blue-200/40 rounded-xl p-3 flex-shrink-0"
                  >
                    <Briefcase className="text-blue-400" size={24} />
                  </motion.div>
                  <div>
                    {/* Role */}
                    <h3 className="text-white font-bold text-xl mb-1">
                      {item.role}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-base text-blue-400 font-semibold">
                        {item.company}
                      </p>
                      {item.companyUrl && (
                        <a
                          href={item.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {/* Current Badge */}
                {item.isCurrent && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-200/60 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Current
                  </span>
                )}

                {/* Type Badge */}
                {item.type && (
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${typeColors[item.type] || typeColors["Full-time"]}`}>
                    {item.type}
                  </span>
                )}
              </div>
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-400">
              {/* Date Range */}
              <div className="flex items-center gap-2">
                <Calendar size={14} />
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
                  <MapPin size={14} />
                  <span>{item.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <div className="mb-4">
                {item.description.split("\n").map((line: string, i: number) => (
                  <p key={i} className="text-slate-300 leading-relaxed mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            )}

            {/* Technologies */}
            {item.technologies && item.technologies.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 text-slate-400">
                  Technologies Used:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-blue-500/15 border border-blue-200/40 text-blue-300 rounded-md px-2 py-1 text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  </div>
                </div>
              )}
              </div>
            </Card3D>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
