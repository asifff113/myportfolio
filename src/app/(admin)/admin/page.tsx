"use client";

import React, { useEffect } from "react";
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
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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

const stats = [
  { label: "Total Projects", value: "12", icon: FolderKanban, color: "from-blue-500 to-cyan-500" },
  { label: "Skills", value: "24", icon: Award, color: "from-purple-500 to-pink-500" },
  { label: "Achievements", value: "8", icon: Trophy, color: "from-orange-500 to-red-500" },
  { label: "Blog Posts", value: "15", icon: BookOpen, color: "from-green-500 to-emerald-500" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user) {
      // Redirect to dashboard page
      router.push("/admin/dashboard");
    }
  }, [user, loading, router]);

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-xl relative overflow-hidden group hover:scale-105 transition-transform"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className="text-3xl font-display font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
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

