"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, X, Loader2, FileText, ExternalLink, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/supabase-queries";
import { uploadImage, STORAGE_PATHS } from "@/lib/supabase-storage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { BlogPost } from "@/lib/content-types";
import { useReorder } from "@/hooks/useReorder";

export default function BlogAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    author: "",
    publishedDate: "",
    tags: "",
    published: false,
  });

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    items: orderedPosts,
    handleMoveUp,
    handleMoveDown,
    loading: reorderLoading
  } = useReorder<BlogPost>(posts, 'blog_posts', loadPosts);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadPosts();
  }, [user]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploading(true);
      const file = e.target.files[0];
      const result = await uploadImage(file, STORAGE_PATHS.blog);
      setFormData({ ...formData, coverImageUrl: result.url });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const tagsArray = formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
      const submitData = {
        ...formData,
        tags: tagsArray,
        slug: formData.slug || generateSlug(formData.title),
        publishedDate: formData.publishedDate || new Date().toISOString(),
      };
      
      if (editing && editing.id) {
        await updateBlogPost(editing.id, submitData);
      } else {
        await createBlogPost(submitData);
      }
      
      await loadPosts();
      setIsModalOpen(false);
      setEditing(null);
      setFormData({ title: "", slug: "", excerpt: "", content: "", coverImageUrl: "", author: "", publishedDate: "", tags: "", published: false });
    } catch (error) {
      alert("Failed to save blog post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this blog post?")) return;
    try {
      await deleteBlogPost(id);
      await loadPosts();
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog Posts</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage your blog content</p>
          </div>
          <button onClick={() => { setEditing(null); setFormData({ title: "", slug: "", excerpt: "", content: "", coverImageUrl: "", author: "", publishedDate: "", tags: "", published: false }); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Post
          </button>
        </div>

        <div className="space-y-4">
          {orderedPosts.map((post, index) => (
            <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex gap-6">
                {post.coverImageUrl && (
                  <div className="w-32 h-32 flex-shrink-0">
                    <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover rounded-lg" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{post.title}</h3>
                        {post.published ? (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded">Published</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">Draft</span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>By {post.author}</span>
                        {post.publishedDate && <span>{new Date(post.publishedDate).toLocaleDateString()}</span>}
                        <span className="text-blue-600 dark:text-blue-400">/{post.slug}</span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {post.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded">{tag}</span>
                          ))}
                        </div>
                      )}
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
                        disabled={index === orderedPosts.length - 1 || reorderLoading}
                        className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => window.open(`/blog/${post.slug}`, "_blank")} className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditing(post); setFormData({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, coverImageUrl: post.coverImageUrl || "", author: post.author || "", publishedDate: post.publishedDate instanceof Date ? post.publishedDate.toISOString() : String(post.publishedDate || ""), tags: post.tags?.join(", ") || "", published: post.published || false }); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No blog posts yet</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editing ? "Edit" : "New"} Blog Post</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 notranslate">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug (auto-generated if empty)</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder={generateSlug(formData.title)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Excerpt *</label>
                <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content *</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Author *</label>
                  <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cover Image</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={formData.coverImageUrl} 
                        onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })} 
                        placeholder="Image URL"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" 
                      />
                      <label className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2">
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        <span className="text-sm">Upload</span>
                      </label>
                    </div>
                    {formData.coverImageUrl && (
                      <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <img src={formData.coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, coverImageUrl: "" })}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma-separated)</label>
                  <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="react, nextjs, tutorial" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Published Date</label>
                  <input type="date" value={formData.publishedDate} onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">Published (visible to public)</label>
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
