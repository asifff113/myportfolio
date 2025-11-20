"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, X, Loader2, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getFutureGoals, createFutureGoal, updateFutureGoal, deleteFutureGoal } from "@/lib/supabase-queries";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FutureGoal } from "@/lib/content-types";

const categories = ["Technical", "Career", "Personal", "Other"];
const statuses = ["planned", "in_progress", "completed", "on_hold"];

export default function GoalsAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [goals, setGoals] = useState<FutureGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<FutureGoal | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", targetDate: "", category: "Personal", status: "planned" });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadGoals();
  }, [user]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await getFutureGoals();
      setGoals(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const submitData = { ...formData, targetDate: formData.targetDate || undefined };
      if (editing && editing.id) {
        await updateFutureGoal(editing.id, submitData);
      } else {
        await createFutureGoal(submitData);
      }
      await loadGoals();
      setIsModalOpen(false);
      setEditing(null);
      setFormData({ title: "", description: "", targetDate: "", category: "Personal", status: "planned" });
    } catch (error) {
      alert("Failed to save goal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this goal?")) return;
    try {
      await deleteFutureGoal(id);
      await loadGoals();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed": return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
      case "in_progress": return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300";
      case "on_hold": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300";
      default: return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  if (authLoading || loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Future Goals</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your aspirations and long-term objectives</p>
          </div>
          <button onClick={() => { setEditing(null); setFormData({ title: "", description: "", targetDate: "", category: "Personal", status: "planned" }); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <motion.div key={goal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-3 flex-1">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg h-fit">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{goal.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{goal.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {goal.category && <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded">{goal.category}</span>}
                      {goal.status && <span className={`px-2 py-1 text-xs rounded ${getStatusColor(goal.status)}`}>{goal.status.replace("_", " ")}</span>}
                      {goal.targetDate && <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">{new Date(goal.targetDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(goal); setFormData({ title: goal.title, description: goal.description, targetDate: goal.targetDate || "", category: goal.category || "Personal", status: goal.status || "planned" }); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => goal.id && handleDelete(goal.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No goals added yet</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editing ? "Edit" : "Add"} Goal</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    {statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Date (optional)</label>
                <input type="date" value={formData.targetDate} onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700" disabled={submitting}>Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2" disabled={submitting}>
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <>{editing ? "Update" : "Create"}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
