"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Briefcase, User, Compass, Users, Rocket, Globe } from "lucide-react";
import { PersonalInfo } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTranslatedPersonalInfo } from "@/lib/i18n/useTranslatedContent";

interface AboutSectionProps {
  personalInfo: PersonalInfo;
}

export default function AboutSection({ personalInfo: initialPersonalInfo }: AboutSectionProps) {
  const { t, locale } = useLanguage();
  const personalInfo = useTranslatedPersonalInfo(initialPersonalInfo);

  const highlightIcons = [Compass, Users, Rocket, Globe];

  const highlights = [
    {
      title: t.sections.about.highlights.learner.title,
      description: t.sections.about.highlights.learner.desc,
      icon: Compass,
      accent: "text-amber-400",
      borderHover: "hover:border-amber-500/30",
      iconBg: "bg-amber-500/10",
    },
    {
      title: t.sections.about.highlights.team.title,
      description: t.sections.about.highlights.team.desc,
      icon: Users,
      accent: "text-yellow-400",
      borderHover: "hover:border-yellow-500/30",
      iconBg: "bg-yellow-500/10",
    },
    {
      title: t.sections.about.highlights.problem.title,
      description: t.sections.about.highlights.problem.desc,
      icon: Rocket,
      accent: "text-amber-300",
      borderHover: "hover:border-amber-400/30",
      iconBg: "bg-amber-400/10",
    },
    {
      title: t.sections.about.highlights.detail.title,
      description: t.sections.about.highlights.detail.desc,
      icon: Globe,
      accent: "text-yellow-300",
      borderHover: "hover:border-yellow-400/30",
      iconBg: "bg-yellow-400/10",
    },
  ];

  return (
    <Section id="about" sectionId="about">
      <SectionTitle
        title={t.sections.about.title}
        subtitle={t.sections.about.subtitle}
        gradient="from-amber-400 via-yellow-300 to-amber-300"
      />

      <div className="grid lg:grid-cols-2 gap-6 items-start max-w-7xl mx-auto">
        {/* 1. Main Bio Card (full width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 rounded-2xl p-8 bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/20 transition-colors"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <User className="w-6 h-6" />
            </div>
            <span className="text-zinc-100">Biography</span>
          </h3>

          <div className="prose prose-lg dark:prose-invert max-w-none text-zinc-400">
            {personalInfo.longBio.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* 2. Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="rounded-2xl p-6 bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/30 transition-colors flex flex-col justify-center items-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
            <Briefcase className="w-7 h-7 text-amber-400" />
          </div>
          <h4 className="text-lg font-semibold mb-1 text-zinc-100">Current Status</h4>
          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
            {personalInfo.currentStatus || "Available"}
          </div>
        </motion.div>

        {/* 3. Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="rounded-2xl p-6 bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/30 transition-colors flex flex-col justify-center items-center text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
            <MapPin className="w-7 h-7 text-amber-400" />
          </div>
          <h4 className="text-lg font-semibold mb-1 text-zinc-100">Location</h4>
          <p className="text-zinc-400 font-medium">{personalInfo.location}</p>
        </motion.div>

        {/* 4. Highlights Cards */}
        {highlights.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className={cn(
                "rounded-2xl p-6 bg-zinc-900/60 border border-zinc-800 transition-colors flex flex-col justify-between",
                item.borderHover
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", item.iconBg)}>
                <Icon className={cn("w-6 h-6", item.accent)} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 text-zinc-100">{item.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          );
        })}

        {/* 5. Contact / CTA Card (Wide) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 rounded-2xl p-8 bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-zinc-100">
              Let's Work Together
            </h3>
            <p className="text-zinc-400 max-w-md">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href={`mailto:${personalInfo.email}`}
              className="px-6 py-3 rounded-xl bg-amber-500 text-zinc-900 font-medium hover:bg-amber-400 transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email Me
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
