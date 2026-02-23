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
            className="fixed inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(249,115,22,0.18),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,0.16),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.14),transparent_40%),rgba(0,0,0,0.82)] backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden pointer-events-auto relative border-beam">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(249,115,22,0.08),rgba(236,72,153,0.05),rgba(99,102,241,0.06))] rounded-2xl" />
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-orange-500/15 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-rose-500/10 blur-3xl" />
              <div className="relative bg-[rgba(12,12,30,0.95)] backdrop-blur-2xl border border-orange-200/20 w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 bg-[rgba(12,12,30,0.85)] border border-white/10 rounded-full text-slate-400 hover:text-white hover:border-orange-400/30 transition-all z-10"
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
                <div className="absolute inset-0 holo-grid opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,18,0.96)] via-[rgba(8,8,18,0.55)] to-transparent" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <span>{project.title}</span>
                    <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-orange-300/85">
                      <span className="h-2 w-2 rounded-full bg-orange-400 twinkle" />
                      Futuristic
                    </span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.category && (
                      <span className="px-3 py-1 bg-orange-500/15 text-orange-300 rounded-full text-sm font-medium border border-orange-200/60">
                        {project.category}
                      </span>
                    )}
                    {project.featured && (
                      <span className="px-3 py-1 bg-yellow-500/15 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/20">
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
                      <p className="text-lg text-slate-400 leading-relaxed">
                        {project.description || project.summary}
                      </p>
                    </div>

                    {/* Deep Dive Sections */}
                    {(project.problem || project.solution || project.challenges) && (
                      <div className="space-y-6">
                        {project.problem && (
                          <div className="bg-red-500/10 border border-red-300/20 p-6 rounded-xl border-l-4 border-l-red-500 border-beam">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                              <AlertTriangle className="text-red-500" size={20} />
                              The Problem
                            </h3>
                            <p className="text-slate-400">{project.problem}</p>
                          </div>
                        )}

                        {project.solution && (
                          <div className="bg-green-500/10 border border-green-300/20 p-6 rounded-xl border-l-4 border-l-green-500 border-beam">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                              <Lightbulb className="text-green-500" size={20} />
                              The Solution
                            </h3>
                            <p className="text-slate-400">{project.solution}</p>
                          </div>
                        )}

                        {project.challenges && (
                          <div className="bg-orange-500/10 border border-orange-300/20 p-6 rounded-xl border-l-4 border-l-orange-500 border-beam">
                            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                              <Layers className="text-orange-500" size={20} />
                              Technical Challenges
                            </h3>
                            <p className="text-slate-400">{project.challenges}</p>
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
                          className="button-futuristic flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-bold transition-all hover:-translate-y-1"
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
                          className="flex items-center justify-center gap-2 w-full py-3 bg-[rgba(12,12,30,0.85)] hover:bg-[rgba(20,20,46,0.95)] text-white rounded-xl font-bold transition-all border border-white/10 hover:border-orange-400/30 border-beam"
                        >
                          <Github size={20} />
                          View Source Code
                        </a>
                      )}
                    </div>

                    {/* Tech Stack */}
                    <div className="bg-[rgba(12,12,30,0.90)] backdrop-blur-sm border border-orange-200/20 p-5 rounded-xl border-beam">
                      <h3 className="font-bold mb-4 flex items-center gap-2 text-white">
                        <Layers size={18} className="text-slate-400" />
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="bg-orange-500/12 border border-orange-200/30 text-orange-300 rounded-md px-2.5 py-1 text-sm font-medium hover:bg-orange-500/18 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stack Details */}
                    {project.stackDetails && (
                      <div className="bg-[rgba(12,12,30,0.90)] backdrop-blur-sm border border-orange-200/20 p-5 rounded-xl border-beam">
                        <h3 className="font-bold mb-4 text-white">Architecture Highlights</h3>
                        <ul className="space-y-3">
                          {project.stackDetails.map((detail, idx) => (
                            <li key={idx} className="text-sm">
                              <span className="font-bold text-slate-200 block mb-1">{detail.name}</span>
                              <span className="text-slate-400">{detail.usage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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
