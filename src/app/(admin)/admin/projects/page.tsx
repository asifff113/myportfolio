"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  ExternalLink,
  Github,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/firebase-queries";
import { uploadProjectImage } from "@/lib/firebase-storage";
import { Project } from "@/lib/content-types";
import { generateSlug } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Form validation schema
const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["Personal", "Professional", "School", "Freelance", "Open Source", "Practice"]),
  status: z.enum(["In Progress", "Completed", "Maintained", "Archived"]).optional(),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  techStack: z.string().min(1, "Add at least one technology"),
  featured: z.boolean().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProjects();
    }
  }, [user]);

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      reset({
        title: project.title,
        summary: project.summary,
        description: project.description,
        type: project.type,
        status: project.status,
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        techStack: project.techStack.join(", "),
        featured: project.featured || false,
      });
      setImageUrl(project.imageUrl || "");
    } else {
      setEditingProject(null);
      reset({
        title: "",
        summary: "",
        description: "",
        type: "Personal",
        status: "In Progress",
        githubUrl: "",
        liveUrl: "",
        techStack: "",
        featured: false,
      });
      setImageUrl("");
    }
    setIsModalOpen(true);
    setSaveStatus("idle");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setImageUrl("");
    setSaveStatus("idle");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const result = await uploadProjectImage(file, (progress) => {
        setUploadProgress(progress);
      });
      setImageUrl(result.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    setSaveStatus("idle");

    try {
      const projectData: Omit<Project, "id"> = {
        title: data.title,
        slug: generateSlug(data.title),
        summary: data.summary,
        description: data.description,
        imageUrl: imageUrl,
        techStack: data.techStack.split(",").map((s) => s.trim()).filter(Boolean),
        githubUrl: data.githubUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        type: data.type,
        status: data.status,
        featured: data.featured,
        order: editingProject?.order || projects.length,
        createdAt: editingProject?.createdAt || new Date().toISOString(),
      };

      if (editingProject?.id) {
        await updateProject(editingProject.id, projectData);
        setProjects(
          projects.map((p) =>
            p.id === editingProject.id ? { ...p, ...projectData } : p
          )
        );
      } else {
        const id = await createProject(projectData);
        setProjects([...projects, { id, ...projectData }]);
      }

      setSaveStatus("success");
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error("Error saving project:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading projects..." />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">
              <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-muted-foreground">
              Manage your portfolio projects ({projects.length} total)
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Add Project
          </button>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => openModal(project)}
              onDelete={() => handleDelete(project.id!)}
            />
          ))}
        </motion.div>

        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass rounded-2xl"
          >
            <p className="text-muted-foreground mb-6">No projects yet. Start by adding your first project!</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
            >
              <Plus size={20} />
              Add Your First Project
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass p-8 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Project Image</label>
                  <div className="flex gap-4 items-start">
                    {imageUrl && (
                      <div className="w-32 h-32 rounded-lg overflow-hidden">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 flex items-center justify-center gap-2 px-6 py-12 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                      <Upload size={20} />
                      <span>{uploadingImage ? `Uploading... ${uploadProgress}%` : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">Title *</label>
                  <input {...register("title")} type="text" id="title" className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.title ? "border-red-500" : "border-border"}`} />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                </div>

                {/* Type & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-2">Type *</label>
                    <select {...register("type")} id="type" className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="Personal">Personal</option>
                      <option value="Professional">Professional</option>
                      <option value="School">School</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Open Source">Open Source</option>
                      <option value="Practice">Practice</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-2">Status</label>
                    <select {...register("status")} id="status" className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Maintained">Maintained</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium mb-2">Summary *</label>
                  <input {...register("summary")} type="text" id="summary" placeholder="One-line description" className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.summary ? "border-red-500" : "border-border"}`} />
                  {errors.summary && <p className="mt-1 text-sm text-red-500">{errors.summary.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">Description *</label>
                  <textarea {...register("description")} id="description" rows={4} className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${errors.description ? "border-red-500" : "border-border"}`} />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                </div>

                {/* Tech Stack */}
                <div>
                  <label htmlFor="techStack" className="block text-sm font-medium mb-2">Tech Stack * (comma-separated)</label>
                  <input {...register("techStack")} type="text" id="techStack" placeholder="React, Next.js, TypeScript, Tailwind" className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.techStack ? "border-red-500" : "border-border"}`} />
                  {errors.techStack && <p className="mt-1 text-sm text-red-500">{errors.techStack.message}</p>}
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium mb-2">GitHub URL</label>
                    <input {...register("githubUrl")} type="url" id="githubUrl" placeholder="https://github.com/..." className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.githubUrl ? "border-red-500" : "border-border"}`} />
                    {errors.githubUrl && <p className="mt-1 text-sm text-red-500">{errors.githubUrl.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="liveUrl" className="block text-sm font-medium mb-2">Live Demo URL</label>
                    <input {...register("liveUrl")} type="url" id="liveUrl" placeholder="https://..." className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${errors.liveUrl ? "border-red-500" : "border-border"}`} />
                    {errors.liveUrl && <p className="mt-1 text-sm text-red-500">{errors.liveUrl.message}</p>}
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input {...register("featured")} type="checkbox" id="featured" className="w-5 h-5" />
                  <label htmlFor="featured" className="text-sm font-medium">Mark as Featured Project</label>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4">
                  <button type="submit" disabled={saving} className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${saving ? "bg-primary/50 cursor-not-allowed" : "bg-primary text-primary-foreground hover:shadow-lg"}`}>
                    {saving ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save size={20} />}
                    <span>{saving ? "Saving..." : "Save Project"}</span>
                  </button>
                  <button type="button" onClick={closeModal} className="px-8 py-3 glass hover:bg-primary/10 rounded-lg font-semibold transition-colors">
                    Cancel
                  </button>
                  {saveStatus === "success" && (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle size={20} />
                      <span>Saved!</span>
                    </div>
                  )}
                  {saveStatus === "error" && (
                    <div className="flex items-center gap-2 text-red-500">
                      <AlertCircle size={20} />
                      <span>Failed to save</span>
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Project Card Component
function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20">
        {project.imageUrl && (
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
        )}
        {project.featured && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.summary}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 3).map((tech, i) => (
            <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{tech}</span>
          ))}
          {project.techStack.length > 3 && <span className="text-xs text-muted-foreground">+{project.techStack.length - 3}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors">
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button onClick={onDelete} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

