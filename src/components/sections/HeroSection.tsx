"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, Twitter, ArrowDown, ArrowRight } from "lucide-react";
import { PersonalInfo, SocialLink } from "@/lib/content-types";
import HeroCanvas from "@/components/3d/HeroCanvas";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTranslatedPersonalInfo } from "@/lib/i18n/useTranslatedContent";

interface HeroSectionProps {
  personalInfo: PersonalInfo;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const socialIconMap: Record<string, React.ElementType> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  Email: Mail,
  Mail: Mail,
};

export default function HeroSection({ personalInfo: initialPersonalInfo }: HeroSectionProps) {
  const { t } = useLanguage();
  const personalInfo = useTranslatedPersonalInfo(initialPersonalInfo);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToNext = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      data-section="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-24 scan-lines noise-overlay"
    >
      {/* 3D Background */}
      <HeroCanvas />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.12),transparent_32%),radial-gradient(circle_at_88%_22%,rgba(168,85,247,0.12),transparent_36%),radial-gradient(circle_at_50%_100%,rgba(251,146,60,0.08),transparent_40%)]" />
      <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-blue-400/35 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[2rem] section-shell p-6 sm:p-8 lg:p-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.1),transparent_30%,rgba(168,85,247,0.1)_60%,transparent_85%)]" />
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center"
        >
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Terminal-style greeting */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/50 backdrop-blur-md rounded-full text-sm font-mono text-cyan-400 shadow-[0_14px_24px_-20px_rgba(37,99,235,0.3)]">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
                &gt; {t.hero.welcome}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-4 tracking-tight"
            >
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_10px_24px_rgba(59,130,246,0.3)]">
                {personalInfo.name}
              </span>
            </motion.h1>

            {/* Headline */}
            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-slate-200 leading-tight"
            >
              {personalInfo.headline}
            </motion.h2>

            {/* Short Bio */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {personalInfo.shortBio}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mb-8 flex flex-wrap justify-center lg:justify-start gap-2.5"
            >
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800/60 border border-slate-700 text-slate-300 shadow-sm">
                Multi-color UI
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                Futuristic Motion
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 border border-violet-500/30 text-violet-400">
                3D Visuals
              </span>
            </motion.div>

            {/* Current Status Badge */}
            {personalInfo.currentStatus && (
              <motion.div variants={itemVariants} className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/50 backdrop-blur-md rounded-full text-sm font-medium text-slate-300 shadow-[0_14px_26px_-22px_rgba(15,23,42,0.45)]">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  {personalInfo.currentStatus}
                </span>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              {/* Download CV */}
              <motion.a
                href="/api/generate-cv"
                download
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="button-futuristic inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-500 text-white shadow-[0_20px_34px_-18px_rgba(59,130,246,0.45)] hover:shadow-[0_22px_38px_-18px_rgba(99,102,241,0.5)] transition-all"
              >
                <Download size={18} />
                <span>{t.hero.downloadCv}</span>
              </motion.a>

              {/* Contact Me */}
              <motion.button
                onClick={scrollToContact}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-slate-800/60 border border-slate-700/50 text-slate-200 hover:bg-slate-700/80 hover:border-cyan-500/50 transition-all shadow-[0_16px_26px_-22px_rgba(15,23,42,0.4)]"
              >
                <Mail size={18} />
                <span>{t.hero.contactMe}</span>
                <ArrowRight size={16} className="ml-1 text-cyan-400" />
              </motion.button>
            </motion.div>

            {/* Social Links */}
            {personalInfo.socialLinks && personalInfo.socialLinks.length > 0 && (
              <motion.div variants={itemVariants} className="flex gap-3 justify-center lg:justify-start">
                {personalInfo.socialLinks.map((social: SocialLink) => {
                  const Icon = socialIconMap[social.platform] || Mail;
                  return (
                    <motion.a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800 transition-all shadow-[0_12px_22px_-18px_rgba(15,23,42,0.35)]"
                      aria-label={social.platform}
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Right Column - Profile Image */}
          <motion.div
            variants={imageVariants}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-[conic-gradient(from_120deg,rgba(59,130,246,0.14),rgba(56,189,248,0.12),rgba(168,85,247,0.12),rgba(251,146,60,0.1),rgba(59,130,246,0.14))] blur-2xl" />
              <div className="absolute inset-2 rounded-full border border-slate-700/50" />

              {/* Profile Image Container */}
              <motion.div
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-orange-300 p-[2px] shadow-[0_28px_46px_-28px_rgba(59,130,246,0.6)]">
                  <div className="w-full h-full rounded-full bg-slate-900/80 backdrop-blur-xl p-2">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      {personalInfo.profileImageUrl ? (
                        <Image
                          src={personalInfo.profileImageUrl}
                          alt={personalInfo.name}
                          fill
                          className="object-cover"
                          priority
                          sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-violet-600 flex items-center justify-center text-6xl font-display font-bold text-white">
                          {personalInfo.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-full ring-1 ring-slate-700/50" />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-xl px-4 py-3 shadow-[0_22px_38px_-26px_rgba(15,23,42,0.45)] min-w-[190px]"
                >
                  <p className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-400 mb-1">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {personalInfo.location || "Available Worldwide"}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.button
            onClick={scrollToNext}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
            aria-label="Scroll to next section"
          >
            <span className="text-xs font-semibold tracking-[0.14em] uppercase">Scroll</span>
            <ArrowDown size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
