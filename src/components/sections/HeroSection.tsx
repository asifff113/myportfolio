"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Mail, Twitter, ArrowDown } from "lucide-react";
import { PersonalInfo, SocialLink } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import { Button } from "@/components/ui/button";
import HeroCanvas from "@/components/3d/HeroCanvas";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTranslatedContent, useTranslatedPersonalInfo } from "@/lib/i18n/useTranslatedContent";

interface HeroSectionProps {
  personalInfo: PersonalInfo;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

// Social icon mapping
const socialIconMap: Record<string, React.ElementType> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  Email: Mail,
  Mail: Mail,
};

export default function HeroSection({ personalInfo: initialPersonalInfo }: HeroSectionProps) {
  const { t } = useLanguage();
  
  // Use the hook to ensure consistent behavior (which now returns initial content)
  // or just use initialPersonalInfo directly since we are relying on Google Translate
  const personalInfo = useTranslatedPersonalInfo(initialPersonalInfo);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToNext = () => {
    const aboutSection = document.getElementById("about");
    aboutSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* 3D Background Element */}
      <HeroCanvas />
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Enhanced Decorative Elements with glow */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-20 left-10 w-3 h-3 bg-neon-cyan rounded-full neon-glow" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute top-1/4 right-20 w-4 h-4 bg-neon-pink rounded-full neon-glow" 
        />
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-neon-purple rounded-full neon-glow" 
        />
        {/* Additional floating orbs */}
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-accent rounded-full neon-glow" 
        />
        <motion.div 
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-secondary rounded-full neon-glow" 
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Greeting */}
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-block px-4 py-2 glass-ultra rounded-full text-sm font-medium neon-border shimmer">
                👋 {t.hero.welcome}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-4"
            >
              <span className="text-gradient neon-text">{personalInfo.name}</span>
            </motion.h1>

            {/* Headline */}
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 gradient-animated bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(90deg, currentColor 0%, var(--primary) 50%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              {personalInfo.headline}
            </motion.h2>

            {/* Short Bio */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {personalInfo.shortBio}
            </motion.p>

            {/* Current Status Badge */}
            {personalInfo.currentStatus && (
              <motion.div variants={itemVariants} className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 glass-ultra border border-primary/20 rounded-full text-sm font-medium glow-pulse">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse neon-glow" />
                  {personalInfo.currentStatus}
                </span>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              {/* Download CV Button - RAINBOW GRADIENT */}
              <motion.a
                href="/api/generate-cv"
                download
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold shadow-2xl transition-all ripple overflow-hidden group"
              >
                {/* Animated Rainbow Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 animate-gradient transition-opacity" />
                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
                
                {/* Content */}
                <Download size={22} className="relative z-10 text-white" />
                <span className="relative z-10 text-white">{t.hero.downloadCv}</span>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.a>

              {/* Contact Me Button - COLORFUL GRADIENT */}
              <motion.button
                onClick={scrollToContact}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold shadow-2xl transition-all ripple overflow-hidden group"
              >
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 animate-gradient transition-opacity" />
                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
                
                {/* Content */}
                <Mail size={22} className="relative z-10 text-white" />
                <span className="relative z-10 text-white">{t.hero.contactMe}</span>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            </motion.div>

            {/* Social Links */}
            {personalInfo.socialLinks && personalInfo.socialLinks.length > 0 && (
              <motion.div variants={itemVariants} className="flex gap-4 justify-center lg:justify-start">
                {personalInfo.socialLinks.map((social: SocialLink) => {
                  const Icon = socialIconMap[social.platform] || Mail;
                  return (
                    <motion.a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.15, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className="magnetic p-3 glass-ultra rounded-lg neon-glow-hover transition-all relative group"
                      aria-label={social.platform}
                    >
                      <Icon size={24} className="relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Right Column - Profile Image */}
          <motion.div
            variants={imageVariants}
            className="order-1 lg:order-2 flex justify-center floating"
          >
            <div className="relative">
              {/* Enhanced Glow Effect Background */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan rounded-full blur-3xl opacity-40 glow-pulse"
              />

              {/* Profile Image Container with 3D effect */}
              <motion.div 
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 card-3d"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 rounded-full neon-border gradient-animated p-1">
                  <div className="w-full h-full rounded-full bg-background p-2">
                    <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
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
                        <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-6xl font-display font-bold text-white holographic">
                          {personalInfo.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating Decoration Elements with particles */}
                <motion.div
                  animate={{ y: [0, -25, 0], rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-24 h-24 bg-neon-cyan/30 rounded-full blur-xl particles"
                />
                <motion.div
                  animate={{ y: [0, 25, 0], rotate: [360, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 w-32 h-32 bg-neon-purple/30 rounded-full blur-xl particles"
                />
                <motion.div
                  animate={{ x: [0, 15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 -right-8 w-20 h-20 bg-neon-pink/25 rounded-full blur-xl"
                />
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
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll to next section"
          >
            <span className="text-sm font-medium">Scroll Down</span>
            <ArrowDown size={24} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

