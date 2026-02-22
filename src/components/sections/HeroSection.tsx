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
    <section id="home" data-section="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 scan-lines">
      {/* 3D Background */}
      <HeroCanvas />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Terminal-style greeting */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block px-4 py-2 bg-zinc-900/60 border border-blue-500/20 rounded-lg text-sm font-mono text-blue-400">
                &gt; {t.hero.welcome}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-display font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
                {personalInfo.name}
              </span>
            </motion.h1>

            {/* Headline */}
            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-zinc-300"
            >
              {personalInfo.headline}
            </motion.h2>

            {/* Short Bio */}
            <motion.p
              variants={itemVariants}
              className="text-base text-zinc-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {personalInfo.shortBio}
            </motion.p>

            {/* Current Status Badge */}
            {personalInfo.currentStatus && (
              <motion.div variants={itemVariants} className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm font-medium text-zinc-300">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow"
              >
                <Download size={18} />
                <span>{t.hero.downloadCv}</span>
              </motion.a>

              {/* Contact Me */}
              <motion.button
                onClick={scrollToContact}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold bg-zinc-800/80 border border-zinc-700/50 text-zinc-200 hover:bg-zinc-700/80 hover:border-zinc-600/50 transition-all"
              >
                <Mail size={18} />
                <span>{t.hero.contactMe}</span>
                <ArrowRight size={16} className="ml-1" />
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
                      className="p-2.5 rounded-lg bg-zinc-800/60 border border-zinc-700/30 text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
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
              {/* Profile Image Container */}
              <motion.div
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-sky-500 p-[2px]">
                  <div className="w-full h-full rounded-full bg-zinc-950 p-2">
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
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-6xl font-display font-bold text-white">
                          {personalInfo.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtle glow behind image */}
                <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl -z-10 scale-110" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

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
            className="flex flex-col items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Scroll to next section"
          >
            <span className="text-xs font-medium">Scroll Down</span>
            <ArrowDown size={18} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
