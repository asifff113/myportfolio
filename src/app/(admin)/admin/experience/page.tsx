"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  X,
  Loader2,
  Calendar,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getAllExperience, createExperience, updateExperience, deleteExperience } from "@/lib/firebase-queries";
import { Experience } from "@/lib/content-types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().min(1, "Description is required"),
  location: z.string().optional(),
  type: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export default function ExperienceAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [techStackInput, setTechStackInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      current: false,
      techStack: [],
      achievements: [],
    },
  });

  const isCurrent = watch("current");
  const techStack = watch("techStack") || [];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadExperiences();
    }
  }, [user]);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await getAllExperience();
      // Sort by start date (most recent first)
      const sorted = data.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setExperiences(sorted);
    } catch (error) {
      console.error("Error loading experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (exp?: Experience) => {
    if (exp) {
      setEditingExperience(exp);
      setValue("company", exp.company);
      setValue("role", exp.role);
      setValue("startDate", exp.startDate);
      setValue("endDate", exp.endDate || "");
      setValue("current", exp.current || false);
      setValue("description", exp.description);
      setValue("location", exp.location || "");
      setValue("type", exp.type || "");
      setValue("techStack", exp.techStack || []);
      setValue("achievements", exp.achievements || []);
    } else {
      setEditingExperience(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    setTechStackInput("");
    reset();
  };

  const handleAddTech = () => {
    if (techStackInput.trim()) {
      const newStack = [...techStack, techStackInput.trim()];
      setValue("techStack", newStack);
      setTechStackInput("");
    }
  };

  const handleRemoveTech = (index: number) => {
    const newStack = techStack.filter((_, i) => i !== index);
    setValue("techStack", newStack);
  };

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      setSubmitting(true);
      const submitData = {
        ...data,
        endDate: data.current ? undefined : data.endDate,
      };
      
      if (editingExperience) {
        await updateExperience(editingExperience.id, submitData);
      } else {
        await createExperience(submitData);
      }
      await loadExperiences();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving experience:", error);
      alert("Failed to save experience. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await deleteExperience(id);
      await loadExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Failed to delete experience. Please try again.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading experiences..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient mb-2">
              Work Experience
            </h1>
            <p className="text-muted-foreground">
              Manage your professional work history
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="button-futuristic flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add Experience</span>
          </motion.button>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-6">
          <AnimatePresence>
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="glass-ultra p-6 rounded-2xl border-2 border-white/10 relative group hover:border-white/20 transition-all"
              >
                {/* Current Badge */}
                {exp.current && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white">
                    Current Position
                  </div>
                )}

                <div className="flex gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Briefcase size={32} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Role */}
                    <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>

                    {/* Company */}
                    <p className="text-lg text-primary mb-2">{exp.company}</p>

                    {/* Location, Type and Date */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {exp.location}
                        </span>
                      )}
                      {exp.type && (
                        <span className="px-2 py-1 bg-primary/20 rounded-full text-xs font-medium">
                          {exp.type}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate || "N/A"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-4 whitespace-pre-line">
                      {exp.description}
                    </p>

                    {/* Tech Stack */}
                    {exp.techStack && exp.techStack.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Tech Stack:</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.techStack.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium border border-primary/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Key Achievements:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleOpenModal(exp)}
                        className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-all flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {experiences.length === 0 && (
          <div className="text-center py-12 glass-ultra rounded-2xl">
            <Briefcase size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No work experience yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your professional work history to showcase your career path
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="button-futuristic inline-flex items-center gap-2"
            >
              <Plus size={20} />
              <span>Add Your First Experience</span>
            </button>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-ultra p-8 rounded-2xl border-2 border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingExperience ? "Edit Experience" : "Add New Experience"}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Company and Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("company")}
                        type="text"
                        placeholder="e.g., Google"
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                      />
                      {errors.company && (
                        <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Role/Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("role")}
                        type="text"
                        placeholder="e.g., Senior Software Engineer"
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                      />
                      {errors.role && (
                        <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Location and Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <input
                        {...register("location")}
                        type="text"
                        placeholder="e.g., San Francisco, CA"
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Employment Type
                      </label>
                      <select
                        {...register("type")}
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                      >
                        <option value="">Select type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("startDate")}
                        type="text"
                        placeholder="e.g., January 2020"
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                      />
                      {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        End Date {!isCurrent && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        {...register("endDate")}
                        type="text"
                        placeholder="e.g., December 2022"
                        disabled={isCurrent}
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all disabled:opacity-50"
                      />
                      {errors.endDate && !isCurrent && (
                        <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Currently Working Checkbox */}
                  <div className="flex items-center gap-3">
                    <input
                      {...register("current")}
                      type="checkbox"
                      id="current"
                      className="w-5 h-5 rounded border-2 border-white/10"
                    />
                    <label htmlFor="current" className="text-sm font-medium cursor-pointer">
                      I currently work here
                    </label>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("description")}
                      rows={5}
                      placeholder="Describe your role, responsibilities, and key contributions..."
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all resize-none"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tech Stack
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={techStackInput}
                        onChange={(e) => setTechStackInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTech();
                          }
                        }}
                        placeholder="Add technology (press Enter)"
                        className="flex-1 px-4 py-2 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddTech}
                        className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-xl transition-all"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(index)}
                            className="hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-6 py-3 glass rounded-xl hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 button-futuristic flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>{editingExperience ? "Update" : "Create"} Experience</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

