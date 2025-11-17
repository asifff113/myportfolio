"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Star,
  Code,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getAllSkills, createSkill, updateSkill, deleteSkill } from "@/lib/firebase-queries";
import { Skill } from "@/lib/content-types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().min(1, "Category is required"),
  level: z.number().min(0).max(100),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
  icon: z.string().optional(),
  description: z.string().optional(),
  isPrimary: z.boolean().optional(),
  yearsOfExperience: z.number().optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

const proficiencyColors = {
  Expert: "from-purple-500 to-pink-500",
  Advanced: "from-blue-500 to-cyan-500",
  Intermediate: "from-green-500 to-emerald-500",
  Beginner: "from-orange-500 to-yellow-500",
};

export default function SkillsAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      level: 50,
      proficiency: "Intermediate",
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadSkills();
    }
  }, [user]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await getAllSkills();
      setSkills(data);
    } catch (error) {
      console.error("Error loading skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setValue("name", skill.name);
      setValue("category", skill.category);
      setValue("level", skill.level);
      setValue("proficiency", skill.proficiency);
      setValue("icon", skill.icon || "");
      setValue("description", skill.description || "");
      setValue("isPrimary", skill.isPrimary || false);
      setValue("yearsOfExperience", skill.yearsOfExperience);
    } else {
      setEditingSkill(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    reset();
  };

  const onSubmit = async (data: SkillFormData) => {
    try {
      setSubmitting(true);
      if (editingSkill) {
        await updateSkill(editingSkill.id, data);
      } else {
        await createSkill(data);
      }
      await loadSkills();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving skill:", error);
      alert("Failed to save skill. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteSkill(id);
      await loadSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill. Please try again.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading skills..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-gradient mb-2">
              Skills Management
            </h1>
            <p className="text-muted-foreground">
              Add and manage your technical and soft skills
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="button-futuristic flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Add Skill</span>
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="glass-ultra p-6 rounded-2xl mb-8 border-2 border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : "glass hover:bg-primary/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-ultra p-6 rounded-2xl border-2 border-white/10 relative group hover:border-white/20 transition-all"
              >
                {/* Primary Badge */}
                {skill.isPrimary && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white">
                    <Star size={12} fill="white" />
                    <span>Primary</span>
                  </div>
                )}

                {/* Icon */}
                {skill.icon && (
                  <div className="text-4xl mb-4">{skill.icon}</div>
                )}

                {/* Skill Name */}
                <h3 className="text-xl font-bold mb-2">{skill.name}</h3>

                {/* Category */}
                <p className="text-sm text-muted-foreground mb-3">{skill.category}</p>

                {/* Proficiency */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className={`font-medium bg-gradient-to-r ${proficiencyColors[skill.proficiency]} bg-clip-text text-transparent`}>
                      {skill.proficiency}
                    </span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full bg-gradient-to-r ${proficiencyColors[skill.proficiency]}`}
                    />
                  </div>
                </div>

                {/* Description */}
                {skill.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {skill.description}
                  </p>
                )}

                {/* Years of Experience */}
                {skill.yearsOfExperience && (
                  <p className="text-xs text-muted-foreground mb-4">
                    {skill.yearsOfExperience} years of experience
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleOpenModal(skill)}
                    className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <Code size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No skills found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or filter"
                : "Get started by adding your first skill"}
            </p>
            {!searchQuery && selectedCategory === "All" && (
              <button
                onClick={() => handleOpenModal()}
                className="button-futuristic inline-flex items-center gap-2"
              >
                <Plus size={20} />
                <span>Add Your First Skill</span>
              </button>
            )}
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
                    {editingSkill ? "Edit Skill" : "Add New Skill"}
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
                  {/* Skill Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Skill Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="e.g., React, Python, UI Design"
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("category")}
                      type="text"
                      placeholder="e.g., Frontend, Backend, Design"
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                    />
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Level and Proficiency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Level (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("level", { valueAsNumber: true })}
                        type="number"
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                      />
                      {errors.level && (
                        <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Proficiency <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("proficiency")}
                        className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                      {errors.proficiency && (
                        <p className="text-red-500 text-sm mt-1">{errors.proficiency.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Icon (emoji or text)
                    </label>
                    <input
                      {...register("icon")}
                      type="text"
                      placeholder="e.g., ⚛️, 🐍, 🎨"
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                    />
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Years of Experience
                    </label>
                    <input
                      {...register("yearsOfExperience", { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="e.g., 3.5"
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      placeholder="Brief description of your experience with this skill"
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-white/10 focus:border-primary/50 transition-all resize-none"
                    />
                  </div>

                  {/* Primary Skill Checkbox */}
                  <div className="flex items-center gap-3">
                    <input
                      {...register("isPrimary")}
                      type="checkbox"
                      id="isPrimary"
                      className="w-5 h-5 rounded border-2 border-white/10"
                    />
                    <label htmlFor="isPrimary" className="text-sm font-medium cursor-pointer">
                      Mark as primary skill
                    </label>
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
                        <span>{editingSkill ? "Update" : "Create"} Skill</span>
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

