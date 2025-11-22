"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, GraduationCap, X, Loader2, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useReorder } from "@/hooks/useReorder";
import { getAllEducation, createEducation, updateEducation, deleteEducation } from "@/lib/supabase-queries";
import { EducationItem } from "@/lib/content-types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EducationAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<EducationItem>>({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    grade: "",
    location: "",
    logoUrl: "",
  });

  const loadEducation = async () => {
    try {
      setLoading(true);
      const data = await getAllEducation();
      setEducation(data);
    } catch (error) {
      console.error("Error loading education:", error);
    } finally {
      setLoading(false);
    }
  };

  const { 
    items: orderedEducation, 
    handleMoveUp, 
    handleMoveDown, 
    loading: reorderLoading 
  } = useReorder<EducationItem>(education, 'education', loadEducation);

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

  const handleOpenModal = (edu?: EducationItem) => {
    if (edu) {
      setEditingEducation(edu);
      setFormData({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field || "",
        startDate: edu.startDate ? (typeof edu.startDate === 'string' ? edu.startDate : new Date(edu.startDate).toISOString().split('T')[0]) : "",
        endDate: edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : new Date(edu.endDate).toISOString().split('T')[0]) : "",
        isCurrent: edu.isCurrent || false,
        description: edu.description || "",
        grade: edu.grade || "",
        location: edu.location || "",
        logoUrl: edu.logoUrl || "",
      });
    } else {
      setEditingEducation(null);
      setFormData({
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
        grade: "",
        location: "",
        logoUrl: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const submitData = {
        ...formData,
        endDate: formData.isCurrent ? null : formData.endDate || null,
      } as Omit<EducationItem, "id">;

      if (editingEducation && editingEducation.id) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Education Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your educational background and qualifications
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Education
          </button>
        </div>

        <div className="space-y-4">
          {orderedEducation.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 mr-2 justify-center">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0 || reorderLoading}
                      className="p-1 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === orderedEducation.length - 1 || reorderLoading}
                      className="p-1 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg h-fit">
                    <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {edu.degree}
                    </h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 mb-2">
                      {edu.institution}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {edu.field}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(edu.startDate as string)} -{" "}
                        {edu.isCurrent ? "Present" : edu.endDate ? formatDate(edu.endDate as string) : "N/A"}
                      </span>
                      {edu.grade && (
                        <span className="ml-4 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                          {edu.grade}
                        </span>
                      )}
                    </div>
                    {edu.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(edu)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => edu.id && handleDelete(edu.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {education.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No education entries yet</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingEducation ? "Edit Education" : "Add Education"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Degree *
                    </label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Field of Study *
                    </label>
                    <input
                      type="text"
                      value={formData.field}
                      onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate as string}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate as string}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      disabled={formData.isCurrent}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: "" })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="isCurrent" className="text-sm text-gray-700 dark:text-gray-300">
                    Currently studying here
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grade / GPA
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g., 3.8 GPA, First Class"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editingEducation ? "Update" : "Create"}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
