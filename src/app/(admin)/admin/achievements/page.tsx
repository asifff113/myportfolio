"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Trophy, X, Loader2, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from "@/lib/supabase-queries";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Achievement } from "@/lib/content-types";
import { useReorder } from "@/hooks/useReorder";

const categories = ["Competition", "Academic", "Community", "Professional", "Other"];

export default function AchievementsAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const loadAchievements = async () => {
    try {
      setLoading(true);
      const data = await getAchievements();
      setAchievements(data);
    } catch (error) {
      console.error("Error loading achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    items: orderedAchievements,
    handleMoveUp,
    handleMoveDown,
    loading: reorderLoading
  } = useReorder<Achievement>(achievements, 'achievements', loadAchievements);

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    description: "",
    date: "",
    iconUrl: "",
    category: "Professional",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const handleOpenModal = (achievement?: Achievement) => {
    if (achievement) {
      setEditingAchievement(achievement);
      setFormData({
        title: achievement.title,
        organization: achievement.organization,
        description: achievement.description || "",
        date: achievement.date instanceof Date ? achievement.date.toISOString().split('T')[0] : String(achievement.date),
        iconUrl: achievement.iconUrl || "",
        category: achievement.category || "Professional",
      });
    } else {
      setEditingAchievement(null);
      setFormData({
        title: "",
        organization: "",
        description: "",
        date: "",
        iconUrl: "",
        category: "Professional",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAchievement(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      if (editingAchievement && editingAchievement.id) {
        await updateAchievement(editingAchievement.id, formData);
      } else {
        await createAchievement(formData);
      }

      await loadAchievements();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving achievement:", error);
      alert("Failed to save achievement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    try {
      await deleteAchievement(id);
      await loadAchievements();
    } catch (error) {
      console.error("Error deleting achievement:", error);
      alert("Failed to delete achievement. Please try again.");
    }
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
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
              Achievements Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your accomplishments and milestones
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Achievement
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">
                    {achievement.iconUrl || "🏆"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {achievement.organization}
                    </p>
                    {achievement.category && (
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                        {achievement.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0 || reorderLoading}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === orderedAchievements.length - 1 || reorderLoading}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenModal(achievement)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(achievement.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {achievement.description}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(achievement.date)}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No achievements yet</p>
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
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingAchievement ? "Edit Achievement" : "Add Achievement"}
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
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
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
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Icon (emoji)
                    </label>
                    <input
                      type="text"
                      value={formData.iconUrl}
                      onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                      placeholder="🏆"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
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
                      <>{editingAchievement ? "Update" : "Create"}</>
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
