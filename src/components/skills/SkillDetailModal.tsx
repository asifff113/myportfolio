"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Skill, Project } from "@/lib/content-types";
import { getProficiencyBand } from "@/lib/skills-utils";
import ProficiencyIndicator from "./ProficiencyIndicator";
import { cn } from "@/lib/utils";
import { ExternalLink, Folder } from "lucide-react";

interface SkillDetailModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
  relatedProjects?: Project[];
}

export default function SkillDetailModal({
  skill,
  isOpen,
  onClose,
  relatedProjects = [],
}: SkillDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      // Focus first element (close button)
      closeButtonRef.current?.focus();

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleTab);
      return () => document.removeEventListener("keydown", handleTab);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!skill) return null;

  const level = skill.level || 50;
  const proficiencyBand = getProficiencyBand(level);
  
  const formatExperience = (years: number) => {
    if (years === 0) return "Less than 1 year";
    if (years === 1) return "1 year";
    return `${years}+ years`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="skill-modal-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "glass rounded-2xl p-6 md:p-8 max-w-lg w-full",
                "shadow-2xl border border-white/20",
                "max-h-[90vh] overflow-y-auto"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className={cn(
                  "absolute top-4 right-4 p-2 rounded-full",
                  "hover:bg-secondary/50 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary"
                )}
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Content */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                  {skill.icon && (
                    <span
                      className="text-4xl flex-shrink-0"
                      role="img"
                      aria-label={skill.name}
                    >
                      {skill.icon}
                    </span>
                  )}
                  <div className="flex-1">
                    <h2
                      id="skill-modal-title"
                      className="text-2xl font-display font-bold text-gradient"
                    >
                      {skill.name}
                    </h2>
                    {skill.isPrimary && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full mt-2">
                        ⚡ Core Skill
                      </span>
                    )}
                    {level !== undefined && (
                      <p className={`text-sm mt-1 font-medium ${proficiencyBand.color}`}>
                        {proficiencyBand.label} · {proficiencyBand.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Proficiency Indicators */}
                {level !== undefined && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-3">
                        Proficiency Level
                      </h3>
                      <div className="flex items-center gap-6">
                        <div className="flex-1">
                          <ProficiencyIndicator
                            level={level}
                            variant="progress"
                            showPercentage={true}
                            size="lg"
                          />
                        </div>
                        <ProficiencyIndicator
                          level={level}
                          variant="circular"
                          showPercentage={true}
                          size="md"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Rating:
                      </span>
                      <ProficiencyIndicator
                        level={level}
                        variant="stars"
                        showPercentage={false}
                        size="md"
                      />
                    </div>
                  </div>
                )}

                {/* Years of Experience */}
                {skill.yearsOfExperience !== undefined && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Experience</h3>
                    <p className="text-muted-foreground">
                      {formatExperience(skill.yearsOfExperience)} of hands-on
                      experience
                    </p>
                  </div>
                )}

                {/* Description */}
                {skill.description && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                )}

                {/* Related Projects */}
                {relatedProjects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Folder size={16} />
                      Used in {relatedProjects.length} {relatedProjects.length === 1 ? 'Project' : 'Projects'}
                    </h3>
                    <div className="space-y-2">
                      {relatedProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`#projects`}
                          onClick={() => {
                            onClose();
                            setTimeout(() => {
                              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                            }, 300);
                          }}
                          className="group flex items-start gap-3 p-3 glass rounded-lg hover:bg-primary/10 transition-all"
                        >
                          <div className="flex-1">
                            <div className="font-medium group-hover:text-primary transition-colors">
                              {project.title}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {project.description}
                            </p>
                          </div>
                          <ExternalLink size={16} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    {relatedProjects.length > 0 ? 'Click a project to see more details · ' : ''}
                    Press ESC to close
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
