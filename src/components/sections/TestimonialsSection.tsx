"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star, Linkedin } from "lucide-react";
import { Testimonial } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import Avatar from "@/components/ui/Avatar";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <Section id="testimonials" className="bg-muted/20">
      <SectionTitle
        title="Testimonials"
        subtitle="What people say about working with me"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id || index} testimonial={testimonial} />
        ))}
      </motion.div>
    </Section>
  );
}

// Testimonial Card Component
interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.03 }}
      className="glass-ultra p-6 md:p-8 rounded-2xl relative overflow-hidden group card-3d"
    >
      {/* Quote Icon */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity"
      >
        <Quote size={56} className="text-primary" />
      </motion.div>

      {/* Rating */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => {
            // Rainbow colors for stars!
            const starColors = [
              "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]",
              "text-orange-400 fill-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]",
              "text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]",
              "text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]",
              "text-orange-500 fill-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]",
            ];
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <Star
                  size={20}
                  className={
                    i < testimonial.rating!
                      ? starColors[i % starColors.length]
                      : "text-muted-foreground/30"
                  }
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quote */}
      <blockquote className="relative z-10 mb-6">
        <p className="text-muted-foreground leading-relaxed italic">
          "{testimonial.quote}"
        </p>
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Avatar
          src={testimonial.avatarUrl}
          alt={testimonial.name}
          size="md"
          fallbackText={testimonial.name}
        />

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold truncate">{testimonial.name}</h4>
            {testimonial.linkedInUrl && (
              <a
                href={testimonial.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                aria-label={`${testimonial.name}'s LinkedIn`}
              >
                <Linkedin size={16} />
              </a>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {testimonial.role}
          </p>
          {testimonial.company && (
            <p className="text-xs text-muted-foreground truncate">
              {testimonial.company}
            </p>
          )}
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan opacity-50 group-hover:opacity-100 rounded-b-2xl shimmer transition-opacity duration-500" />
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-neon-pink/5 to-neon-cyan/5 animate-pulse" />
      </div>
    </motion.div>
  );
}

