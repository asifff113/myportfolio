"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Download, Github, Linkedin, Mail, Twitter, ArrowDown, ArrowRight, Sparkles, Terminal } from "lucide-react";
import { PersonalInfo, SocialLink } from "@/lib/content-types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTranslatedPersonalInfo } from "@/lib/i18n/useTranslatedContent";

const HeroCanvas = dynamic(() => import("@/components/3d/HeroCanvas"), { ssr: false });

/* ─── Typewriter Hook ─── */
function useTypewriter(texts: string[], typingSpeed = 60, deletingSpeed = 35, pauseTime = 2200) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex] || "";

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(current.slice(0, displayText.length + 1));
          if (displayText.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          setDisplayText(current.slice(0, displayText.length - 1));
          if (displayText.length === 0) {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return displayText;
}

interface HeroSectionProps {
  personalInfo: PersonalInfo;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
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

  const typewriterTexts = [
    personalInfo.headline || "Full Stack Developer",
    "Building the Future",
    "Crafting Digital Experiences",
  ];
  const typedText = useTypewriter(typewriterTexts);

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-24"
    >
      <HeroCanvas />

      {/* Ambient glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_20%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_50%_40%_at_80%_25%,rgba(139,92,246,0.14),transparent_50%),radial-gradient(ellipse_60%_45%_at_50%_90%,rgba(6,182,212,0.12),transparent_45%)]" />
      <div className="absolute inset-0 holo-grid opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.03),transparent_55%)]" />

      {/* Top decorative line */}
      <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[2rem] section-shell p-6 sm:p-8 lg:p-10 overflow-hidden">
          {/* Inner accent gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(99,102,241,0.10),transparent_30%,rgba(6,182,212,0.10)_60%,transparent_85%)]" />
          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
          <div className="absolute top-6 left-6 h-2 w-2 rounded-full bg-cyan-400 twinkle" />
          <div className="absolute top-14 left-16 h-1.5 w-1.5 rounded-full bg-violet-400 twinkle delay-1" />
          <div className="absolute top-10 right-20 h-2 w-2 rounded-full bg-emerald-400 twinkle delay-2" />
          <div className="absolute bottom-10 right-14 h-1.5 w-1.5 rounded-full bg-orange-400 twinkle" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="hidden xl:flex absolute top-8 right-8 items-center gap-3 rounded-xl border border-cyan-500/20 bg-[rgba(10,10,30,0.72)] backdrop-blur-xl px-4 py-3 shadow-[0_12px_32px_-18px_rgba(6,182,212,0.35)] border-beam"
          >
            <div className="relative">
              <div className="h-9 w-9 rounded-full border border-cyan-400/30 flex items-center justify-center pulse-ring">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 pulse-soft" />
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-300/80">System Mode</p>
              <p className="text-sm font-semibold text-slate-200">Futuristic UI</p>
            </div>
          </motion.div>

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
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(15,15,40,0.70)] border border-indigo-500/25 backdrop-blur-lg rounded-full text-sm font-mono text-indigo-300 shadow-[0_8px_20px_-12px_rgba(99,102,241,0.3)]">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 animate-pulse" />
                  &gt; {t.hero.welcome}
                </span>
              </motion.div>

              {/* Name with glitch effect */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-4 tracking-tight"
              >
                <span
                  className="glitch-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(99,102,241,0.4)]"
                  data-text={personalInfo.name}
                >
                  {personalInfo.name}
                </span>
              </motion.h1>

              {/* Headline with Typewriter */}
              <motion.h2
                variants={itemVariants}
                className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-slate-300 leading-tight h-[2.4em]"
              >
                <span className="inline-flex items-center gap-1 font-mono">
                  <Terminal className="w-5 h-5 text-cyan-400 opacity-70" />
                  <span>{typedText}</span>
                  <span className="inline-block w-[2px] h-[1.1em] bg-cyan-400 ml-0.5 align-middle animate-[cursor-blink_0.8s_step-end_infinite]" />
                </span>
              </motion.h2>

              {/* Short Bio */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                {personalInfo.shortBio}
              </motion.p>

              {/* Feature Tags */}
              <motion.div
                variants={itemVariants}
                className="mb-8 flex flex-wrap justify-center lg:justify-start gap-2.5"
              >
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 shadow-sm border-beam">
                  <Sparkles className="inline w-3 h-3 mr-1" />
                  Multi-color UI
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 border-beam">
                  Futuristic Motion
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-500/15 border border-violet-500/30 text-violet-300 border-beam">
                  3D Visuals
                </span>
              </motion.div>

              {/* Current Status Badge */}
              {personalInfo.currentStatus && (
                <motion.div variants={itemVariants} className="mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(15,15,40,0.70)] border border-emerald-500/25 backdrop-blur-lg rounded-full text-sm font-medium text-slate-300 shadow-[0_8px_20px_-14px_rgba(16,185,129,0.3)]">
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
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="button-futuristic inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white shadow-[0_16px_32px_-12px_rgba(99,102,241,0.50)] hover:shadow-[0_20px_40px_-12px_rgba(99,102,241,0.65)] transition-all"
                >
                  <Download size={18} />
                  <span>{t.hero.downloadCv}</span>
                </motion.a>

                {/* Contact Me */}
                <motion.button
                  onClick={scrollToContact}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-semibold bg-[rgba(15,15,40,0.70)] border border-indigo-500/25 text-slate-200 hover:bg-[rgba(15,15,40,0.85)] hover:border-indigo-400/40 transition-all shadow-[0_10px_24px_-14px_rgba(0,0,0,0.4)] backdrop-blur-lg"
                >
                  <Mail size={18} />
                  <span>{t.hero.contactMe}</span>
                  <ArrowRight size={16} className="ml-1 text-indigo-500" />
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
                        whileHover={{ scale: 1.12, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2.5 rounded-xl bg-[rgba(15,15,40,0.65)] border border-indigo-500/20 text-slate-400 hover:text-indigo-300 hover:border-indigo-400/40 hover:bg-[rgba(15,15,40,0.80)] transition-all shadow-[0_6px_16px_-10px_rgba(0,0,0,0.3)] backdrop-blur-lg"
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
                {/* Outer aurora glow — breathing nebula instead of spinning rings */}
                <div className="absolute -inset-10 rounded-full bg-[conic-gradient(from_120deg,rgba(99,102,241,0.20),rgba(6,182,212,0.18),rgba(244,63,94,0.15),rgba(16,185,129,0.15),rgba(99,102,241,0.20))] blur-3xl pulse-soft" />

                {/* Hexagonal scan-line overlay */}
                <div className="absolute -inset-4 rounded-full opacity-20"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(99,102,241,0.12) 3px, rgba(99,102,241,0.12) 4px)",
                    maskImage: "radial-gradient(circle, black 55%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 70%)",
                  }}
                />

                {/* Static decorative ring */}
                <div className="absolute inset-2 rounded-full border border-indigo-500/25" />

                {/* Profile Image Container */}
                <motion.div
                  className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    aria-hidden
                    animate={{ scale: [1, 1.03, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-4 rounded-full border border-indigo-500/15"
                  />

                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 p-[2.5px] shadow-[0_24px_50px_-20px_rgba(99,102,241,0.50)]">
                    <div className="w-full h-full rounded-full bg-[rgba(10,10,26,0.90)] backdrop-blur-xl p-2">
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
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 flex items-center justify-center text-6xl font-display font-bold text-white">
                            {personalInfo.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ring accent */}
                  <div className="absolute inset-0 rounded-full ring-1 ring-indigo-500/25" />

                  {/* Location badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-2 rounded-2xl bg-[rgba(10,10,30,0.85)] border border-indigo-500/20 backdrop-blur-xl px-4 py-3 shadow-[0_12px_28px_-16px_rgba(0,0,0,0.4)] min-w-[190px] border-beam"
                  >
                    <p className="text-xs font-semibold tracking-[0.14em] uppercase text-indigo-400/80 mb-1">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-slate-200 truncate">
                      {personalInfo.location || "Available Worldwide"}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.55 }}
                    className="hidden lg:block absolute top-6 -left-10 rounded-xl bg-[rgba(10,10,30,0.80)] border border-violet-500/20 backdrop-blur-lg px-3 py-2 shadow-[0_12px_24px_-16px_rgba(139,92,246,0.5)] float-y-slow"
                  >
                    <p className="text-[10px] uppercase tracking-[0.14em] text-violet-300/70">Latency</p>
                    <p className="text-sm font-semibold text-white">Smooth UX</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1, duration: 0.55 }}
                    className="hidden lg:block absolute bottom-16 -right-12 rounded-xl bg-[rgba(10,10,30,0.80)] border border-cyan-500/20 backdrop-blur-lg px-3 py-2 shadow-[0_12px_24px_-16px_rgba(6,182,212,0.45)] float-y-slow delay-1"
                  >
                    <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-300/70">Engine</p>
                    <p className="text-sm font-semibold text-white">3D Active</p>
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
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-indigo-500 transition-colors"
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
