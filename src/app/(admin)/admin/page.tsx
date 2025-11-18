"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Award,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Trophy,
  FileText,
  Image,
  Heart,
  Target,
  MessageSquare,
  BookOpen,
  Mail,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  getAllSkills,
  getAllEducation,
  getAllExperience,
  getAllProjects,
  getAchievements,
  getCertificates,
  getGalleryItems,
  getHobbies,
  getFutureGoals,
  getTestimonials,
  getBlogPosts,
} from "@/lib/firebase-queries";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin", active: true },
  { icon: User, label: "Personal Info", href: "/admin/personal-info" },
  { icon: Award, label: "Skills", href: "/admin/skills" },
  { icon: GraduationCap, label: "Education", href: "/admin/education" },
  { icon: Briefcase, label: "Experience", href: "/admin/experience" },
  { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
  { icon: Trophy, label: "Achievements", href: "/admin/achievements" },
  { icon: FileText, label: "Certificates", href: "/admin/certificates" },
  { icon: Image, label: "Gallery", href: "/admin/gallery" },
  { icon: Heart, label: "Hobbies", href: "/admin/hobbies" },
  { icon: Target, label: "Future Goals", href: "/admin/goals" },
  { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials" },
  { icon: BookOpen, label: "Blog Posts", href: "/admin/blog" },
  { icon: Mail, label: "Contact Info", href: "/admin/contact" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    skills: 0,
    education: 0,
    experience: 0,
    projects: 0,
    achievements: 0,
    certificates: 0,
    gallery: 0,
    hobbies: 0,
    goals: 0,
    testimonials: 0,
    blogPosts: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load statistics
  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = async () => {
    try {
      setLoadingStats(true);
      const [
        skillsData,
        educationData,
        experienceData,
        projectsData,
        achievementsData,
        certificatesData,
        galleryData,
        hobbiesData,
        goalsData,
        testimonialsData,
        blogData,
      ] = await Promise.all([
        getAllSkills(),
        getAllEducation(),
        getAllExperience(),
        getAllProjects(),
        getAchievements(),
        getCertificates(),
        getGalleryItems(),
        getHobbies(),
        getFutureGoals(),
        getTestimonials(),
        getBlogPosts(),
      ]);

      setStats({
        skills: skillsData.length,
        education: educationData.length,
        experience: experienceData.length,
        projects: projectsData.length,
        achievements: achievementsData.length,
        certificates: certificatesData.length,
        gallery: galleryData.length,
        hobbies: hobbiesData.length,
        goals: goalsData.length,
        testimonials: testimonialsData.length,
        blogPosts: blogData.length,
      });
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Redirecting to login..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-border flex-shrink-0 hidden lg:block">
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-gradient">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Portfolio Management</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-6 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-display font-bold mb-2">
            Welcome back, {user.displayName || user.email?.split('@')[0]}!
          </h2>
          <p className="text-muted-foreground">
            Manage your portfolio content from this dashboard
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard icon={Award} label="Skills" value={stats.skills} color="from-blue-500 to-cyan-500" href="/admin/skills" loading={loadingStats} />
          <StatCard icon={GraduationCap} label="Education" value={stats.education} color="from-purple-500 to-pink-500" href="/admin/education" loading={loadingStats} />
          <StatCard icon={Briefcase} label="Experience" value={stats.experience} color="from-green-500 to-emerald-500" href="/admin/experience" loading={loadingStats} />
          <StatCard icon={FolderKanban} label="Projects" value={stats.projects} color="from-orange-500 to-red-500" href="/admin/projects" loading={loadingStats} />
          <StatCard icon={Trophy} label="Achievements" value={stats.achievements} color="from-yellow-500 to-amber-500" href="/admin/achievements" loading={loadingStats} />
          <StatCard icon={FileText} label="Certificates" value={stats.certificates} color="from-indigo-500 to-purple-500" href="/admin/certificates" loading={loadingStats} />
          <StatCard icon={Image} label="Gallery" value={stats.gallery} color="from-pink-500 to-rose-500" href="/admin/gallery" loading={loadingStats} />
          <StatCard icon={Heart} label="Hobbies" value={stats.hobbies} color="from-red-500 to-pink-500" href="/admin/hobbies" loading={loadingStats} />
          <StatCard icon={Target} label="Goals" value={stats.goals} color="from-teal-500 to-cyan-500" href="/admin/goals" loading={loadingStats} />
          <StatCard icon={MessageSquare} label="Testimonials" value={stats.testimonials} color="from-blue-500 to-indigo-500" href="/admin/testimonials" loading={loadingStats} />
          <StatCard icon={BookOpen} label="Blog Posts" value={stats.blogPosts} color="from-green-500 to-teal-500" href="/admin/blog" loading={loadingStats} />
          <StatCard icon={TrendingUp} label="Total Items" value={Object.values(stats).reduce((a, b) => a + b, 0)} color="from-violet-500 to-purple-500" href="/admin" loading={loadingStats} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-8 rounded-2xl"
        >
          <h3 className="text-2xl font-display font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/projects"
              className="p-6 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all group"
            >
              <FolderKanban size={32} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold mb-1">Add New Project</h4>
              <p className="text-sm text-muted-foreground">
                Showcase your latest work
              </p>
            </a>

            <a
              href="/admin/blog"
              className="p-6 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all group"
            >
              <BookOpen size={32} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold mb-1">Write Blog Post</h4>
              <p className="text-sm text-muted-foreground">
                Share your thoughts and insights
              </p>
            </a>

            <a
              href="/admin/certificates"
              className="p-6 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all group"
            >
              <FileText size={32} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold mb-1">Upload Certificate</h4>
              <p className="text-sm text-muted-foreground">
                Add your latest certification
              </p>
            </a>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Getting Started */}
          <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-gradient">🚀 Getting Started</span>
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Update your personal information and bio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Add your skills and expertise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Upload your projects and achievements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Configure contact information</span>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-gradient">💡 Tips</span>
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Keep your portfolio updated regularly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Use high-quality images for projects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Write clear, concise descriptions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>All changes are saved to Firebase automatically</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color, href, loading }: { icon: any; label: string; value: number; color: string; href: string; loading: boolean }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-4 rounded-xl relative overflow-hidden group hover:scale-105 transition-transform cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className="relative">
        <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${color} mb-3`}>
          <Icon size={20} className="text-white" />
        </div>
        {loading ? (
          <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
        ) : (
          <p className="text-2xl font-display font-bold mb-1">{value}</p>
        )}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </motion.a>
  );
}

