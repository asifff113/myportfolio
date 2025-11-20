"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Upload, X, Plus, CheckCircle, AlertCircle, Trash2, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getPersonalInfo, updatePersonalInfo } from "@/lib/supabase-queries";
import { uploadProfileImage, uploadResume } from "@/lib/supabase-storage";
import { PersonalInfo, SocialLink } from "@/lib/content-types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Form validation schema
const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  headline: z.string().min(3, "Headline is required"),
  shortBio: z.string().min(10, "Short bio must be at least 10 characters"),
  longBio: z.string().min(50, "Long bio must be at least 50 characters"),
  location: z.string().min(2, "Location is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  currentStatus: z.string().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumeUploadProgress, setResumeUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
  });

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPersonalInfo();
        if (data) {
          reset({
            name: data.name,
            headline: data.headline,
            shortBio: data.shortBio,
            longBio: data.longBio,
            location: data.location,
            email: data.email,
            phone: data.phone || "",
            currentStatus: data.currentStatus || "",
          });
          setProfileImageUrl(data.profileImageUrl || "");
          setResumeUrl(data.resumeUrl || "");
          setSocialLinks(data.socialLinks || []);
        }
      } catch (error) {
        console.error("Error loading personal info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const result = await uploadProfileImage(file, (progress) => {
        setUploadProgress(progress);
      });
      setProfileImageUrl(result.url);
      setSaveStatus("idle");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setResumeUploadProgress(0);

    try {
      const result = await uploadResume(file, (progress) => {
        setResumeUploadProgress(progress);
      });
      setResumeUrl(result.url);
      setSaveStatus("idle");
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setUploadingResume(false);
      setResumeUploadProgress(0);
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    setSaving(true);
    setSaveStatus("idle");

    try {
      const personalInfoData: Omit<PersonalInfo, "id"> = {
        ...data,
        profileImageUrl,
        resumeUrl,
        socialLinks: socialLinks.filter((link) => link.platform && link.url),
        updatedAt: new Date().toISOString(),
      };

      console.log("Saving personal info:", personalInfoData);
      await updatePersonalInfo(personalInfoData);
      console.log("Save successful!");
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error: any) {
      console.error("Error saving personal info:", error);
      console.error("Error message:", error?.message);
      alert(`Failed to save: ${error?.message || "Unknown error"}`);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading personal info..." />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-2">
            <span className="text-gradient">Personal Information</span>
          </h1>
          <p className="text-muted-foreground">
            Update your personal details and public profile
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Profile Image */}
          <div className="glass p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Profile Image</h3>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Image Preview */}
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-display font-bold text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors cursor-pointer">
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
                  {profileImageUrl && (
                    <button
                      type="button"
                      onClick={() => setProfileImageUrl("")}
                      className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove Image"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: Square image, at least 400x400px, max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Resume / CV */}
          <div className="glass p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Resume / CV</h3>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors cursor-pointer">
                    <Upload size={20} />
                    <span>{uploadingResume ? `Uploading... ${resumeUploadProgress}%` : "Upload Resume (PDF)"}</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                  </label>
                  {resumeUrl && (
                    <>
                      <a 
                        href={resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View Resume"
                      >
                        <FileText size={20} />
                      </a>
                      <button
                        type="button"
                        onClick={() => setResumeUrl("")}
                        className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove Resume"
                      >
                        <Trash2 size={20} />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: PDF format, max 10MB
                </p>
                {resumeUrl && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Resume uploaded
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="glass p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.name ? "border-red-500" : "border-border"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Headline */}
            <div>
              <label htmlFor="headline" className="block text-sm font-medium mb-2">
                Professional Headline *
              </label>
              <input
                {...register("headline")}
                type="text"
                id="headline"
                placeholder="e.g., Full Stack Developer & Creative Problem Solver"
                className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.headline ? "border-red-500" : "border-border"
                }`}
              />
              {errors.headline && (
                <p className="mt-1 text-sm text-red-500">{errors.headline.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.email ? "border-red-500" : "border-border"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                {...register("phone")}
                type="tel"
                id="phone"
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Location *
              </label>
              <input
                {...register("location")}
                type="text"
                id="location"
                placeholder="e.g., San Francisco, CA"
                className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.location ? "border-red-500" : "border-border"
                }`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            {/* Current Status */}
            <div>
              <label htmlFor="currentStatus" className="block text-sm font-medium mb-2">
                Current Status
              </label>
              <input
                {...register("currentStatus")}
                type="text"
                id="currentStatus"
                placeholder="e.g., Open to opportunities"
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="glass p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-semibold mb-4">About Me</h3>

            {/* Short Bio */}
            <div>
              <label htmlFor="shortBio" className="block text-sm font-medium mb-2">
                Short Bio * (for hero section)
              </label>
              <textarea
                {...register("shortBio")}
                id="shortBio"
                rows={3}
                placeholder="2-3 sentences introducing yourself"
                className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                  errors.shortBio ? "border-red-500" : "border-border"
                }`}
              />
              {errors.shortBio && (
                <p className="mt-1 text-sm text-red-500">{errors.shortBio.message}</p>
              )}
            </div>

            {/* Long Bio */}
            <div>
              <label htmlFor="longBio" className="block text-sm font-medium mb-2">
                Long Bio * (for about section)
              </label>
              <textarea
                {...register("longBio")}
                id="longBio"
                rows={8}
                placeholder="Detailed description about yourself, your journey, interests, etc."
                className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                  errors.longBio ? "border-red-500" : "border-border"
                }`}
              />
              {errors.longBio && (
                <p className="mt-1 text-sm text-red-500">{errors.longBio.message}</p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Social Links</h3>
              <button
                type="button"
                onClick={addSocialLink}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
              >
                <Plus size={16} />
                Add Link
              </button>
            </div>

            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Platform (e.g., GitHub)"
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                    className="flex-1 px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                    className="flex-[2] px-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              {socialLinks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No social links added yet. Click "Add Link" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all ${
                saving
                  ? "bg-primary/50 cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:shadow-lg neon-glow"
              }`}
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>

            {/* Status Messages */}
            {saveStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-green-500"
              >
                <CheckCircle size={20} />
                <span>Saved successfully!</span>
              </motion.div>
            )}

            {saveStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-500"
              >
                <AlertCircle size={20} />
                <span>Failed to save. Please try again.</span>
              </motion.div>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}

