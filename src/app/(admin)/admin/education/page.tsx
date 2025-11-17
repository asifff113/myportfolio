"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  X,
  Loader2,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getAllEducation, createEducation, updateEducation, deleteEducation } from "@/lib/firebase-queries";
import { Education } from "@/lib/content-types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const educationSchema = z.object({
  school: z.string().min(1, "School name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  location: z.string().optional(),
});

type EducationFormData = z.infer<typeof educationSchema>;

export default function EducationAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      current: false,
      achievements: [],
    },
  });

  const isCurrent = watch("current");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadEducation();
    }
  }, [user]);

  const loadEducation = async () => {
    try {
      setLoading(true);
      const data = await getAllEducation();
      // Sort by start date (most recent first)
      const sorted = data.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setEducation(sorted);
    } catch (error) {
      console.error("Error loading education:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (edu?: Education) => {
    if (edu) {
      setEditingEducation(edu);
      setValue("school", edu.school);
      setValue("degree", edu.degree);
      setValue("field", edu.field);
      setValue("startDate", edu.startDate);
      setValue("endDate", edu.endDate || "");
      setValue("current", edu.current || false);
      setValue("grade", edu.grade || "");
      setValue("description", edu.description || "");
      setValue("location", edu.location || "");
      setValue("achievements", edu.achievements || []);
    } else {
      setEditingEducation(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
    reset();
  };

  const onSubmit = async (data: EducationFormData) => {
    try {
      setSubmitting(true);
      const submitData = {
        ...data,
        endDate: data.current ? undefined : data.endDate,
      };
      
      if (editingEducation) {
        await updateEducation(editingEducation.id, submitData);
      } else {
        await createEducation(submitData);
      }
      await loadEducation();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving education:", error);
      alert("Failed to save education. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      await deleteEducation(id);
      await loadEducation();
    } catch (error) {
      console.error("Error deleting education:", error);
      alert("Failed to delete education. Please try again.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading education..." />
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
              Education Management
            </h1>
            <p className="text-muted-foreground">
              Manage your academic background and achievements
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="button-futuristic flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add Education</span>
          </motion.button>
        </div>

        {/* Education Timeline */}
        <div className="space-y-6">
          <AnimatePresence>
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="glass-ultra p-6 rounded-2xl border-2 border-white/10 relative group hover:border-white/20 transition-all"
              >
                {/* Current Badge */}
                {edu.current && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white">
                    Currently Studying
                  </div>
                )}

                <div className="flex gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <GraduationCap size={32} className="text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {/* Degree and Field */}
                    <h3 className="text-2xl font-bold mb-1">
                      {edu.degree} in {edu.field}
                    </h3>

                    {/* School */}
                    <p className="text-lg text-primary mb-2">{edu.school}</p>

                    {/* Location and Date */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      {edu.location && (
                        <span>📍 {edu.location}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {edu.startDate} - {edu.current ? "Present" : edu.endDate || "N/A"}
                      </span>
                      {edu.grade && (
                        <span className="font-medium text-primary">
                          Grade: {edu.grade}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {edu.description && (
                      <p className="text-muted-foreground mb-4">
                        {edu.description}
                      </p>
                    )}

                    {/* Achievements */}
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Achievements:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {edu.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleOpenModal(edu)}
                        className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-all flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
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
        {education.length === 0 && (
          <div className="text-center py-12 glass-ultra rounded-2xl">
            <GraduationCap size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No education entries yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your academic background to showcase your qualifications
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="button-futuristic inline-flex items-center gap-2"
            >
              <Plus size={20} />
              <span>Add Your First Education</span>
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
                    {editingEducation ? "Edit Education" : "Add New Education"}
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
                  {/* School Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      School/University <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("school")}
                      type="text"
                      placeholder="e.g., Harvard University"
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                    />
                    {errors.school && (
                      <p className="text-red-500 text-sm mt-1">{errors.school.message}</p>
                    )}
                  </div>

                  {/* Degree and Field */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Degree <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("degree")}
                        type="text"
                        placeholder="e.g., Bachelor of Science"
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                      />
                      {errors.degree && (
                        <p className="text-red-500 text-sm mt-1">{errors.degree.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Field of Study <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("field")}
                        type="text"
                        placeholder="e.g., Computer Science"
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                      />
                      {errors.field && (
                        <p className="text-red-500 text-sm mt-1">{errors.field.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location
                    </label>
                    <input
                      {...register("location")}
                      type="text"
                      placeholder="e.g., Cambridge, MA"
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                    />
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
                        placeholder="e.g., September 2018"
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
                        placeholder="e.g., May 2022"
                        disabled={isCurrent}
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all disabled:opacity-50"
                      />
                      {errors.endDate && !isCurrent && (
                        <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Currently Studying Checkbox */}
                  <div className="flex items-center gap-3">
                    <input
                      {...register("current")}
                      type="checkbox"
                      id="current"
                      className="w-5 h-5 rounded border-2 border-white/10"
                    />
                    <label htmlFor="current" className="text-sm font-medium cursor-pointer">
                      I currently study here
                    </label>
                  </div>

                  {/* Grade/GPA */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Grade/GPA
                    </label>
                    <input
                      {...register("grade")}
                      type="text"
                      placeholder="e.g., 3.8/4.0, First Class"
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      placeholder="Brief description of your studies, coursework, or focus areas"
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all resize-none"
                    />
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
                        <span>{editingEducation ? "Update" : "Create"} Education</span>
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

