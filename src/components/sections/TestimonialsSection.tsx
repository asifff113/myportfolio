"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Linkedin } from "lucide-react";
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
    <Section id="testimonials" sectionId="testimonials">
      <SectionTitle
        title="Testimonials"
        subtitle="What people say about working with me"
        gradient="from-orange-400 via-amber-300 to-orange-300"
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
      whileHover={{ y: -4 }}
      className="bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-orange-500/20 hover:border-orange-400/40 p-6 rounded-2xl relative overflow-hidden group border-l-[3px] border-l-orange-400 transition-all shadow-sm hover:shadow-lg hover:shadow-orange-500/15"
    >
      {/* Quote Icon - static SVG in warm orange */}
      <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-orange-500"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
        </svg>
      </div>

      {/* Rating */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < testimonial.rating!
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-200"
              }
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="relative z-10 mb-6">
        <p className="text-slate-300 leading-relaxed italic">
          &ldquo;{testimonial.quote}&rdquo;
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
            <h4 className="font-bold truncate text-white">{testimonial.name}</h4>
            {testimonial.linkedInUrl && (
              <a
                href={testimonial.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-500 transition-colors flex-shrink-0"
                aria-label={`${testimonial.name}'s LinkedIn`}
              >
                <Linkedin size={16} />
              </a>
            )}
          </div>
          <p className="text-sm text-slate-400 truncate">
            {testimonial.role}
          </p>
          {testimonial.company && (
            <p className="text-xs text-slate-400 truncate">
              {testimonial.company}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
