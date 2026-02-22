"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Code2, Star, Calendar, ArrowRight } from "lucide-react";
import { Project } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { formatDate } from "@/lib/utils";
import ProjectModal from "./ProjectModal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTranslatedProjects } from "@/lib/i18n/useTranslatedContent";

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

// Project type colors
const typeColors: Record<string, string> = {
  Personal: "bg-purple-100 text-purple-700 border border-purple-200/60",
  Professional: "bg-blue-100 text-blue-700 border border-blue-200/60",
  School: "bg-green-100 text-green-700 border border-green-200/60",
  Freelance: "bg-orange-100 text-orange-700 border border-orange-200/60",
  "Open Source": "bg-cyan-100 text-cyan-700 border border-cyan-200/60",
  Practice: "bg-pink-100 text-pink-700 border border-pink-200/60",
};

// Status colors
const statusColors: Record<string, string> = {
  "In Progress": "bg-yellow-100 text-yellow-700 border border-yellow-200/60",
  Completed: "bg-green-100 text-green-700 border border-green-200/60",
  Maintained: "bg-blue-100 text-blue-700 border border-blue-200/60",
  Archived: "bg-gray-100 text-gray-600 border border-gray-200/60",
};

export default function ProjectsSection({ projects: initialProjects }: ProjectsSectionProps) {
  const { t, locale } = useLanguage();
  const projects = useTranslatedProjects(initialProjects);
  const [filter, setFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!projects || projects.length === 0) {
    return null;
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  // Get unique project types
  const types = ["All", ...Array.from(new Set(projects.map((p) => p.type).filter((t): t is string => !!t)))];

  // Filter projects
  const filteredProjects = filter === "All"
    ? projects
    : projects.filter((p) => p.type === filter);

  // Separate featured projects
  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  return (
    <Section id="projects" sectionId="projects">
      <SectionTitle
        title={t.sections.projects.title}
        subtitle={t.sections.projects.subtitle}
        gradient="from-orange-400 via-rose-400 to-orange-300"
      />

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === type
                ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-200/30"
                : "bg-white/55 backdrop-blur-sm border border-orange-200/30 text-slate-600 hover:text-slate-800 hover:border-orange-300/50"
            }`}
          >
            {type === "All" ? t.sections.projects.filterAll : type}
          </button>
        ))}
      </motion.div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div className="mb-16">
          <h3 className="text-3xl font-display font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-orange-300 bg-clip-text text-transparent">Featured Projects</span>
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
                <ProjectCard
                  key={project.id}
                  project={project}
                  featured
                  onClick={handleProjectClick}
                />
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
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleProjectClick}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* No Projects Message */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white/55 backdrop-blur-xl border border-orange-200/30 rounded-2xl"
        >
          <p className="text-slate-500">
          </p>
        </motion.div>
      )}

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Section>
  );
}

// Project Card Component
interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  onClick: (project: Project) => void;
}

function ProjectCard({ project, featured = false, onClick }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const statusColor = statusColors[project.category || "Completed"] || statusColors["Completed"];
  const typeColor = typeColors[project.category || "Personal"] || typeColors["Personal"];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      className={`bg-white/55 backdrop-blur-xl border rounded-2xl overflow-hidden group relative cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-orange-200/20 ${
        featured
          ? "border-2 border-orange-300/50 hover:border-orange-400/60"
          : "border-orange-200/30 hover:border-orange-300/50"
      }`}
      onClick={() => onClick(project)}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white font-semibold px-3 py-1 rounded-full text-xs shadow-lg">
            <Star size={12} fill="currentColor" />
            Featured
          </span>
        </div>
      )}

      {/* Project Image */}
      <div className="relative h-48 md:h-56 bg-orange-50 overflow-hidden">
        {!imageError && project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50">
            <Code2 size={48} className="text-orange-300" />
          </div>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-3 bg-white/80 border border-orange-200/40 text-slate-700 rounded-full shadow-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
              aria-label="View GitHub Repository"
            >
              <Github size={20} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-3 bg-white/80 border border-orange-200/40 text-slate-700 rounded-full shadow-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
              aria-label="View Live Demo"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-orange-600 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Type Badge */}
          {project.type && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeColors[project.type] || typeColors.Personal}`}>
              {project.type}
            </span>
          )}

          {/* Status Badge */}
          {project.status && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || statusColors.Completed}`}>
              {project.status}
            </span>
          )}

          {/* Date */}
          {project.endDate && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 border border-orange-200/40 rounded-full text-xs text-slate-500">
              <Calendar size={12} />
              {formatDate(project.endDate)}
            </span>
          )}
        </div>

        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, featured ? 8 : 5).map((tech, index) => (
                <span
                  key={index}
                  className="bg-orange-50 border border-orange-200/40 text-orange-700 rounded-md px-2 py-1 text-xs"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > (featured ? 8 : 5) && (
                <span className="text-slate-400 text-xs px-2 py-1">
                  +{project.techStack.length - (featured ? 8 : 5)} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Links & Actions */}
        <div className="flex items-center justify-between gap-3 text-sm mt-auto pt-4 border-t border-orange-200/30">
          <div className="flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={16} />
                <span className="hidden sm:inline">Code</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
                <span className="hidden sm:inline">Live Demo</span>
              </a>
            )}
          </div>

          <button
            onClick={() => onClick(project)}
            className="inline-flex items-center gap-1 text-orange-600 font-bold hover:underline group/btn"
          >
            View Details
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
