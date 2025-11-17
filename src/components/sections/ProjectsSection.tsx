"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Code2, Star, Calendar } from "lucide-react";
import { Project } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { formatDate } from "@/lib/utils";

interface ProjectsSectionProps {
  projects: Project[];
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// Project type colors - MORE VIBRANT
const typeColors: Record<string, string> = {
  Personal: "bg-purple-500/30 text-purple-300 border-purple-400/50 shadow-lg shadow-purple-500/20",
  Professional: "bg-blue-500/30 text-blue-300 border-blue-400/50 shadow-lg shadow-blue-500/20",
  School: "bg-green-500/30 text-green-300 border-green-400/50 shadow-lg shadow-green-500/20",
  Freelance: "bg-orange-500/30 text-orange-300 border-orange-400/50 shadow-lg shadow-orange-500/20",
  "Open Source": "bg-cyan-500/30 text-cyan-300 border-cyan-400/50 shadow-lg shadow-cyan-500/20",
  Practice: "bg-pink-500/30 text-pink-300 border-pink-400/50 shadow-lg shadow-pink-500/20",
};

// Status colors - MORE VIBRANT
const statusColors: Record<string, string> = {
  "In Progress": "bg-yellow-500/30 text-yellow-300 border-yellow-400/50 shadow-lg shadow-yellow-500/20",
  Completed: "bg-green-500/30 text-green-300 border-green-400/50 shadow-lg shadow-green-500/20",
  Maintained: "bg-blue-500/30 text-blue-300 border-blue-400/50 shadow-lg shadow-blue-500/20",
  Archived: "bg-gray-500/30 text-gray-300 border-gray-400/50 shadow-lg shadow-gray-500/20",
};

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<string>("All");

  if (!projects || projects.length === 0) {
    return null;
  }

  // Get unique project types
  const types = ["All", ...Array.from(new Set(projects.map((p) => p.type)))];

  // Filter projects
  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter((p) => p.type === filter);

  // Separate featured projects
  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  return (
    <Section id="projects" className="relative bg-muted/20">
      <SectionTitle
        title="Projects"
        subtitle="Some of my work and side projects"
      />

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {types.map((type, idx) => {
          const filterColors = [
            "from-blue-500 to-cyan-500",
            "from-purple-500 to-pink-500",
            "from-green-500 to-emerald-500",
            "from-orange-500 to-red-500",
            "from-indigo-500 to-purple-500",
            "from-pink-500 to-rose-500",
          ];
          const filterColor = filterColors[idx % filterColors.length];
          
          return (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(type)}
              className={`px-6 py-3 rounded-full font-bold transition-all ripple relative overflow-hidden ${
                filter === type
                  ? `bg-gradient-to-r ${filterColor} text-white shadow-lg border-2 border-white/30`
                  : "glass-ultra hover:bg-primary/20 border-2 border-transparent hover:border-white/20"
              }`}
            >
              <span className="relative z-10">{type}</span>
              {filter === type && (
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div className="mb-16">
          <h3 className="text-3xl font-display font-bold text-center mb-8">
            <span className="text-gradient neon-text">⭐ Featured Projects</span>
          </h3>

          <AnimatePresence mode="wait">
            <motion.div
              key={`featured-${filter}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Regular Projects */}
      {regularProjects.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`regular-${filter}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {regularProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* No Projects Message */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 glass rounded-2xl"
        >
          <p className="text-muted-foreground">
            No projects found in this category.
          </p>
        </motion.div>
      )}
    </Section>
  );
}

// Project Card Component
interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`glass-ultra rounded-2xl overflow-hidden group relative card-3d ${
        featured ? "lg:col-span-1 neon-border" : ""
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="absolute top-4 left-4 z-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 rounded-full text-xs font-bold shadow-xl glow-pulse shimmer">
            <Star size={14} fill="currentColor" className="animate-spin-slow" />
            Featured
          </span>
        </motion.div>
      )}

      {/* Project Image */}
      <div className="relative h-48 md:h-56 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 overflow-hidden">
        {!imageError && project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
            onError={() => setImageError(true)}
            sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-animated">
            <Code2 size={48} className="text-primary/50 group-hover:scale-110 transition-transform" />
          </div>
        )}
        
        {/* Animated overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-secondary/0 group-hover:from-primary/20 group-hover:via-accent/10 group-hover:to-secondary/20 transition-all duration-500" />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 gap-4">
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 glass-ultra rounded-full shadow-2xl hover:bg-primary hover:text-primary-foreground transition-colors neon-glow-hover magnetic"
              aria-label="View GitHub Repository"
            >
              <Github size={22} />
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="p-4 glass-ultra rounded-full shadow-2xl hover:bg-primary hover:text-primary-foreground transition-colors neon-glow-hover magnetic"
              aria-label="View Live Demo"
            >
              <ExternalLink size={22} />
            </motion.a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-all duration-300 neon-text-hover">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Type Badge */}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shimmer-hover ${typeColors[project.type] || typeColors.Personal}`}>
            {project.type}
          </span>

          {/* Status Badge */}
          {project.status && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shimmer-hover ${statusColors[project.status] || statusColors.Completed}`}>
              {project.status}
            </span>
          )}

          {/* Date */}
          {project.endDate && (
            <span className="inline-flex items-center gap-1 px-3 py-1 glass-ultra rounded-full text-xs">
              <Calendar size={12} />
              {formatDate(project.endDate)}
            </span>
          )}
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, featured ? 8 : 5).map((tech, index) => {
                // Generate colorful gradient for each tech
                const techColors = [
                  "from-blue-500 to-cyan-500",
                  "from-purple-500 to-pink-500",
                  "from-green-500 to-emerald-500",
                  "from-orange-500 to-red-500",
                  "from-indigo-500 to-purple-500",
                  "from-pink-500 to-rose-500",
                  "from-teal-500 to-cyan-500",
                  "from-violet-500 to-fuchsia-500",
                ];
                const techColor = techColors[index % techColors.length];
                
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-3 py-1.5 bg-gradient-to-r ${techColor} bg-opacity-20 text-white rounded-lg text-xs font-bold border border-white/30 hover:border-white/60 hover:shadow-lg transition-all cursor-default relative overflow-hidden group/tech`}
                  >
                    <span className="relative z-10">{tech}</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/tech:opacity-100 transition-opacity" />
                  </motion.span>
                );
              })}
              {project.techStack.length > (featured ? 8 : 5) && (
                <span className="px-3 py-1 text-muted-foreground text-xs glass-ultra rounded-lg">
                  +{project.techStack.length - (featured ? 8 : 5)} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex gap-3 text-sm">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={16} />
              <span>Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink size={16} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Enhanced Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-neon-pink/10 to-neon-cyan/10 animate-pulse" />
        <div className="absolute inset-0 neon-glow" />
      </div>
      
      {/* Floating particles on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-neon-cyan rounded-full neon-glow"
        />
      </div>
    </motion.div>
  );
}

