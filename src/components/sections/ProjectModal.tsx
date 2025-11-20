"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink, Layers, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import Image from "next/image";
import { Project } from "@/lib/content-types";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col pointer-events-auto relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors z-10 backdrop-blur-md"
              >
                <X size={24} />
              </button>

              {/* Header Image */}
              <div className="relative h-48 sm:h-64 w-full shrink-0">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">{project.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.category && (
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/20">
                        {project.category}
                      </span>
                    )}
                    {project.featured && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/20">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Summary */}
                    <div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {project.description || project.summary}
                      </p>
                    </div>

                    {/* Deep Dive Sections */}
                    {(project.problem || project.solution || project.challenges) && (
                      <div className="space-y-6">
                        {project.problem && (
                          <div className="glass p-6 rounded-xl border-l-4 border-red-500">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                              <AlertTriangle className="text-red-500" size={20} />
                              The Problem
                            </h3>
                            <p className="text-muted-foreground">{project.problem}</p>
                          </div>
                        )}

                        {project.solution && (
                          <div className="glass p-6 rounded-xl border-l-4 border-green-500">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                              <Lightbulb className="text-green-500" size={20} />
                              The Solution
                            </h3>
                            <p className="text-muted-foreground">{project.solution}</p>
                          </div>
                        )}

                        {project.challenges && (
                          <div className="glass p-6 rounded-xl border-l-4 border-orange-500">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                              <Layers className="text-orange-500" size={20} />
                              Technical Challenges
                            </h3>
                            <p className="text-muted-foreground">{project.challenges}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Links */}
                    <div className="flex flex-col gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1"
                        >
                          <ExternalLink size={20} />
                          View Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/10 hover:border-white/30"
                        >
                          <Github size={20} />
                          View Source Code
                        </a>
                      )}
                    </div>

                    {/* Tech Stack */}
                    <div className="glass-ultra p-5 rounded-xl">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Layers size={18} className="text-primary" />
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs font-medium rounded-lg border border-white/10 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stack Details */}
                    {project.stackDetails && (
                      <div className="glass-ultra p-5 rounded-xl">
                        <h3 className="font-bold mb-4">Architecture Highlights</h3>
                        <ul className="space-y-3">
                          {project.stackDetails.map((detail, idx) => (
                            <li key={idx} className="text-sm">
                              <span className="font-bold text-primary block mb-1">{detail.name}</span>
                              <span className="text-muted-foreground">{detail.usage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
