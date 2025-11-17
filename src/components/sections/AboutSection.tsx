"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Briefcase } from "lucide-react";
import { PersonalInfo } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";

interface AboutSectionProps {
  personalInfo: PersonalInfo;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function AboutSection({ personalInfo }: AboutSectionProps) {
  const infoItems = [
    { icon: MapPin, label: "Location", value: personalInfo.location },
    { icon: Mail, label: "Email", value: personalInfo.email },
    { icon: Phone, label: "Phone", value: personalInfo.phone },
    { icon: Briefcase, label: "Status", value: personalInfo.currentStatus },
  ].filter((item) => item.value); // Filter out undefined values

  // Highlight cards data with COLORFUL gradients
  const highlights = [
    {
      title: "Quick Learner",
      description: "Adaptable to new technologies and frameworks",
      icon: "🚀",
      color: "from-blue-500 via-cyan-500 to-teal-500",
    },
    {
      title: "Team Player",
      description: "Collaborative mindset with strong communication",
      icon: "🤝",
      color: "from-purple-500 via-pink-500 to-rose-500",
    },
    {
      title: "Problem Solver",
      description: "Creative solutions to complex challenges",
      icon: "💡",
      color: "from-orange-500 via-amber-500 to-yellow-500",
    },
    {
      title: "Detail Oriented",
      description: "Committed to quality and best practices",
      icon: "✨",
      color: "from-green-500 via-emerald-500 to-teal-500",
    },
  ];

  return (
    <Section id="about">
      <SectionTitle
        title="About Me"
        subtitle="Get to know more about who I am and what I do"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-12"
      >
        {/* Main Bio - ENHANCED BEAUTIFUL STYLE */}
        <motion.div variants={itemVariants} className="max-w-5xl mx-auto">
          <div className="glass-ultra p-10 md:p-14 rounded-3xl relative overflow-hidden group border-2 border-white/10 hover:border-white/20 shadow-2xl">
            {/* Large Decorative Wave Backgrounds */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-purple-500/15 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-orange-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50" />
            
            <div className="prose prose-xl dark:prose-invert max-w-none relative z-10">
              {personalInfo.longBio.split("\n\n").map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-300 leading-relaxed mb-6 last:mb-0 text-lg md:text-xl font-medium group-hover:text-gray-200 transition-colors"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Info Grid - ENHANCED BEAUTIFUL STYLE */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            // Unique gradient colors for each info card
            const cardColors = [
              { gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20", iconBg: "from-purple-500/30 to-pink-500/30", iconColor: "text-pink-300", border: "border-pink-400/30" },
              { gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20", iconBg: "from-cyan-500/30 to-blue-500/30", iconColor: "text-cyan-300", border: "border-cyan-400/30" },
              { gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20", iconBg: "from-green-500/30 to-emerald-500/30", iconColor: "text-emerald-300", border: "border-emerald-400/30" },
              { gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20", iconBg: "from-orange-500/30 to-amber-500/30", iconColor: "text-amber-300", border: "border-amber-400/30" },
            ];
            const colors = cardColors[index % cardColors.length];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.08, y: -12 }}
                className="glass-ultra p-8 rounded-3xl text-center group relative overflow-hidden card-3d border-2 border-white/10 hover:border-white/20 shadow-xl"
              >
                {/* Large Decorative Wave Background */}
                <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${colors.gradient} rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700`} />
                <div className={`absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr ${colors.gradient} rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-transform duration-700`} />
                
                {/* Icon - MUCH BIGGER */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.iconBg} mb-5 shadow-xl border-2 ${colors.border} z-10`}
                >
                  <Icon size={40} className={colors.iconColor} />
                </motion.div>
                
                {/* Label - BIGGER */}
                <h3 className="text-base font-bold text-gray-400 mb-3 relative z-10 uppercase tracking-wide">
                  {item.label}
                </h3>
                
                {/* Value - BIGGER & BOLDER */}
                <p className="text-lg md:text-xl text-white font-bold break-words relative z-10 group-hover:scale-105 transition-transform">
                  {item.value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Highlights */}
        <motion.div variants={itemVariants}>
          <h3 className="text-3xl font-display font-bold text-center mb-12">
            <span className="text-gradient neon-text">✨ Key Highlights</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="glass-ultra p-6 rounded-2xl group relative overflow-hidden card-3d border-2 border-transparent hover:border-white/20"
              >
                {/* Colorful animated background glow */}
                <motion.div
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-20 blur-2xl`}
                />
                
                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${highlight.color}`} />
                
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-5xl mb-4 relative z-10"
                >
                  {highlight.icon}
                </motion.div>
                <h4 className="text-lg font-bold mb-2 relative z-10 group-hover:text-gradient transition-all duration-300">
                  {highlight.title}
                </h4>
                <p className="text-sm text-muted-foreground relative z-10 leading-relaxed">
                  {highlight.description}
                </p>
                
                {/* Corner accent - COLORFUL */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${highlight.color} opacity-30 group-hover:opacity-60 rounded-bl-full transition-opacity duration-500`} />
                
                {/* Bottom left corner */}
                <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${highlight.color} opacity-20 group-hover:opacity-50 rounded-tr-full transition-opacity duration-500`} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}

