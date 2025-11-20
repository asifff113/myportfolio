"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Briefcase, User, Sparkles, Globe, Code } from "lucide-react";
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

  // Highlight cards data with COLORFUL gradients
  const highlights = [
    {
      title: t.sections.about.highlights.learner.title,
      description: t.sections.about.highlights.learner.desc,
      icon: "🚀",
      color: "from-blue-500 via-cyan-500 to-teal-500",
    },
    {
      title: t.sections.about.highlights.team.title,
      description: t.sections.about.highlights.team.desc,
      icon: "🤝",
      color: "from-purple-500 via-pink-500 to-rose-500",
    },
    {
      title: t.sections.about.highlights.problem.title,
      description: t.sections.about.highlights.problem.desc,
      icon: "💡",
      color: "from-orange-500 via-amber-500 to-yellow-500",
    },
    {
      title: t.sections.about.highlights.detail.title,
      description: t.sections.about.highlights.detail.desc,
      icon: "✨",
      color: "from-green-500 via-emerald-500 to-teal-500",
    },
  ];

  return (
    <Section id="about">
      <SectionTitle
        title={t.sections.about.title}
        subtitle={t.sections.about.subtitle}
      />

      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        {/* 1. Main Bio - Large Card (2x2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 row-span-2 rounded-3xl p-8 bg-card/50 backdrop-blur-sm border border-white/10 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
          
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <User className="w-6 h-6" />
            </div>
            Biography
          </h3>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground relative z-10">
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
          className="md:col-span-1 rounded-3xl p-6 bg-card/50 backdrop-blur-sm border border-white/10 shadow-xl flex flex-col justify-center items-center text-center group hover:border-green-500/50 transition-colors relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Briefcase className="w-7 h-7 text-green-500" />
          </div>
          <h4 className="text-lg font-semibold mb-1">Current Status</h4>
          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium">
            {personalInfo.currentStatus || "Available"}
          </div>
        </motion.div>

        {/* 3. Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1 rounded-3xl p-6 bg-card/50 backdrop-blur-sm border border-white/10 shadow-xl flex flex-col justify-center items-center text-center group hover:border-blue-500/50 transition-colors relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <MapPin className="w-7 h-7 text-blue-500" />
          </div>
          <h4 className="text-lg font-semibold mb-1">Location</h4>
          <p className="text-muted-foreground font-medium">{personalInfo.location}</p>
        </motion.div>

        {/* 4. Highlights Cards */}
        {highlights.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="md:col-span-1 rounded-3xl p-6 bg-card/50 backdrop-blur-sm border border-white/10 shadow-xl flex flex-col justify-between group hover:border-primary/30 transition-all relative overflow-hidden"
          >
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br", item.color)} />
            
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-300", item.color)}>
              {item.icon}
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          </motion.div>
        ))}

        {/* 5. Contact / CTA Card (Wide) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="md:col-span-2 lg:col-span-2 rounded-3xl p-8 bg-gradient-to-r from-primary/10 via-purple-500/5 to-blue-500/5 backdrop-blur-sm border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex flex-col gap-2 text-center sm:text-left relative z-10">
            <h3 className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Let's Work Together
            </h3>
            <p className="text-muted-foreground max-w-md">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
          </div>
          
          <div className="flex gap-3 relative z-10">
            <a 
              href={`mailto:${personalInfo.email}`}
              className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2"
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

