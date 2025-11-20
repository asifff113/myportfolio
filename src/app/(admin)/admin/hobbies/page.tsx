"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, X, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getHobbies, createHobby, updateHobby, deleteHobby } from "@/lib/supabase-queries";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Hobby } from "@/lib/content-types";
import { useReorder } from "@/hooks/useReorder";

export default function HobbiesAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Hobby | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", icon: "" });

  const {
    items: orderedHobbies,
    handleMoveUp,
    handleMoveDown,
    loading: reorderLoading
  } = useReorder<Hobby>(hobbies, 'hobbies', loadHobbies);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadHobbies();
  }, [user]);

  const loadHobbies = async () => {
    try {
      setLoading(true);
      const data = await getHobbies();
      setHobbies(data);
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
      if (editing && editing.id) {
        await updateHobby(editing.id, formData);
      } else {
        await createHobby(formData);
      }
      await loadHobbies();
      setIsModalOpen(false);
      setEditing(null);
      setFormData({ title: "", description: "", icon: "" });
    } catch (error) {
      alert("Failed to save hobby");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hobby?")) return;
    try {
      await deleteHobby(id);
      await loadHobbies();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  if (authLoading || loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hobbies & Interests</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your hobbies and personal interests</p>
          </div>
          <button onClick={() => { setEditing(null); setFormData({ title: "", description: "", icon: "" }); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Hobby
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orderedHobbies.map((hobby, index) => (
            <motion.div key={hobby.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="text-4xl">{hobby.icon || "🎯"}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{hobby.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{hobby.description}</p>
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
                    disabled={index === orderedHobbies.length - 1 || reorderLoading}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditing(hobby); setFormData({ title: hobby.title, description: hobby.description, icon: hobby.icon || "" }); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => hobby.id && handleDelete(hobby.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hobbies.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">No hobbies added yet</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editing ? "Edit" : "Add"} Hobby</h2>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon (emoji)</label>
                <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="📷" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
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
