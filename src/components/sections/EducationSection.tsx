"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";
import { EducationItem } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { formatDateRange } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTranslatedEducation } from "@/lib/i18n/useTranslatedContent";

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function EducationSection({ education: initialEducation }: EducationSectionProps) {
  const { t, locale } = useLanguage();
  const education = useTranslatedEducation(initialEducation);

  if (!education || education.length === 0) {
    return null;
  }

  return (
    <Section id="education" sectionId="education" className="relative">
      <SectionTitle
        title={t.sections.education.title}
        subtitle={t.sections.education.subtitle}
        gradient="from-indigo-400 via-violet-400 to-indigo-300"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {education.map((item, index) => (
          <motion.div
            key={item.id || index}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/30 border-t-2 border-t-indigo-500 rounded-2xl p-6 md:p-8 transition-colors"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-2">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex-shrink-0"
                  >
                    <GraduationCap className="text-indigo-400" size={24} />
                  </motion.div>
                  <div>
                    {/* Degree */}
                    <h3 className="text-white font-bold text-xl mb-1">
                      {item.degree}
                    </h3>
                    {item.field && (
                      <p className="text-base text-indigo-400 font-semibold mb-1">
                        {item.field}
                      </p>
                    )}
                    <p className="text-sm text-zinc-400 font-medium">
                      {item.institution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Badge */}
              {item.isCurrent && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                  Current
                </span>
              )}
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-zinc-500">
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

              {/* Grade */}
              {item.grade && (
                <div className="flex items-center gap-2">
                  <Award size={14} />
                  <span className="font-semibold text-indigo-400">
                    {item.grade}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
