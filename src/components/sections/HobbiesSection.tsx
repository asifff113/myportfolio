"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Hobby } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import Card3D from "@/components/ui/Card3D";

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

// Per-hobby color variety for the top gradient bar
const uniqueHobbyColors = [
  "from-lime-500 to-green-500",
  "from-green-500 to-emerald-500",
  "from-emerald-500 to-teal-500",
  "from-teal-500 to-cyan-500",
  "from-lime-400 to-lime-600",
  "from-green-400 to-green-600",
  "from-emerald-400 to-lime-500",
  "from-cyan-500 to-green-500",
];

export default function HobbiesSection({ hobbies }: HobbiesSectionProps) {
  if (!hobbies || hobbies.length === 0) {
    return null;
  }

  return (
    <Section id="hobbies" sectionId="hobbies">
      <SectionTitle
        title="Hobbies & Interests"
        subtitle="What I enjoy doing when I'm not coding"
        gradient="from-lime-400 via-green-400 to-lime-300"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {hobbies.map((hobby, index) => {
          const hobbyColor = uniqueHobbyColors[index % uniqueHobbyColors.length];

          return (
            <motion.div
              key={hobby.id || index}
              variants={itemVariants}
              className="h-full"
            >
              <Card3D glowColor="lime" intensity="medium" className="bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-lime-500/20 hover:border-lime-400/40 rounded-2xl overflow-hidden relative group transition-all shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(132,204,22,0.3)] border-beam h-full">
                <div className="absolute inset-0 holo-grid opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-40" />
                <div className="relative z-10 flex flex-col h-full">
              {/* Top gradient bar */}
              <div className={`h-1 bg-gradient-to-r ${hobbyColor} rounded-t-2xl`} />

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
              <div className="relative z-10 p-6">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: [-10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-4"
                >
                  {hobby.icon || "✨"}
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-lime-400 transition-colors duration-300">
                  {hobby.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed">
                  {hobby.description}
                </p>
              </div>
              </div>
              </Card3D>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
