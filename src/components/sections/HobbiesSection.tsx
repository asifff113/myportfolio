"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Hobby } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";

interface HobbiesSectionProps {
  hobbies: Hobby[];
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HobbiesSection({ hobbies }: HobbiesSectionProps) {
  if (!hobbies || hobbies.length === 0) {
    return null;
  }

  // Colorful gradients for each hobby
  const hobbyColors = [
    "from-blue-500 via-cyan-500 to-teal-500",
    "from-purple-500 via-pink-500 to-rose-500",
    "from-green-500 via-emerald-500 to-lime-500",
    "from-orange-500 via-amber-500 to-yellow-500",
    "from-red-500 via-pink-500 to-purple-500",
    "from-indigo-500 via-blue-500 to-cyan-500",
    "from-fuchsia-500 via-purple-500 to-pink-500",
    "from-violet-500 via-purple-500 to-fuchsia-500",
  ];

  return (
    <Section id="hobbies" className="relative">
      <SectionTitle
        title="Hobbies & Interests"
        subtitle="What I enjoy doing when I'm not coding"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {hobbies.map((hobby, index) => {
          const hobbyColor = hobbyColors[index % hobbyColors.length];
          
          return (
            <motion.div
              key={hobby.id || index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
              }}
              className="glass-ultra p-6 md:p-8 rounded-2xl relative overflow-hidden group card-3d border-2 border-transparent hover:border-white/20"
            >
              {/* Colorful gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${hobbyColor} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
              
              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${hobbyColor}`} />
            {/* Background Image if available */}
            {hobby.imageUrl && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <Image
                  src={hobby.imageUrl}
                  alt={hobby.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-6xl mb-4 floating"
              >
                {hobby.icon || "✨"}
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-all duration-300 neon-text-hover">{hobby.title}</h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {hobby.description}
              </p>
            </div>

              {/* Enhanced Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${hobbyColor} opacity-20 animate-pulse`} />
                <div className="absolute inset-0 neon-glow" />
              </div>
              
              {/* Colorful corner accents */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${hobbyColor} opacity-30 group-hover:opacity-60 rounded-bl-full transition-opacity duration-500`} />
              <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${hobbyColor} opacity-20 group-hover:opacity-50 rounded-tr-full transition-opacity duration-500`} />
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}

