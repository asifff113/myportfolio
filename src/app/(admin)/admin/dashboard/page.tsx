"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Trophy,
  Award,
  Image as ImageIcon,
  Heart,
  Target,
  FileText,
  MessageSquare,
  Mail,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const adminSections = [
  {
    title: "Personal Info",
    description: "Name, bio, contact details, social links",
    href: "/admin/personal-info",
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
    count: "1 profile",
  },
  {
    title: "Skills",
    description: "Manage your technical and soft skills",
    href: "/admin/skills",
    icon: Code,
    gradient: "from-green-500 to-emerald-500",
    count: "Coming soon",
  },
  {
    title: "Education",
    description: "Schools, degrees, and certifications",
    href: "/admin/education",
    icon: GraduationCap,
    gradient: "from-orange-500 to-amber-500",
    count: "Coming soon",
  },
  {
    title: "Experience",
    description: "Work history and professional roles",
    href: "/admin/experience",
    icon: Briefcase,
    gradient: "from-purple-500 to-pink-500",
    count: "Coming soon",
  },
  {
    title: "Projects",
    description: "Showcase your work and side projects",
    href: "/admin/projects",
    icon: FileText,
    gradient: "from-indigo-500 to-blue-500",
    count: "Active",
  },
  {
    title: "Achievements",
    description: "Awards, recognitions, and milestones",
    href: "/admin/achievements",
    icon: Trophy,
    gradient: "from-yellow-500 to-orange-500",
    count: "Coming soon",
  },
  {
    title: "Certificates",
    description: "Professional certifications and credentials",
    href: "/admin/certificates",
    icon: Award,
    gradient: "from-pink-500 to-rose-500",
    count: "Coming soon",
  },
  {
    title: "Gallery",
    description: "Photo gallery and media management",
    href: "/admin/gallery",
    icon: ImageIcon,
    gradient: "from-violet-500 to-purple-500",
    count: "Coming soon",
  },
  {
    title: "Hobbies",
    description: "Personal interests and activities",
    href: "/admin/hobbies",
    icon: Heart,
    gradient: "from-red-500 to-pink-500",
    count: "Coming soon",
  },
  {
    title: "Goals",
    description: "Future plans and aspirations",
    href: "/admin/goals",
    icon: Target,
    gradient: "from-teal-500 to-cyan-500",
    count: "Coming soon",
  },
  {
    title: "Blog",
    description: "Write and manage blog posts",
    href: "/admin/blog",
    icon: FileText,
    gradient: "from-blue-500 to-indigo-500",
    count: "Coming soon",
  },
  {
    title: "Testimonials",
    description: "Client feedback and recommendations",
    href: "/admin/testimonials",
    icon: MessageSquare,
    gradient: "from-green-500 to-teal-500",
    count: "Coming soon",
  },
];

const stats = [
  {
    label: "Total Sections",
    value: "12",
    icon: BarChart3,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    label: "Active Pages",
    value: "2",
    icon: Activity,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    label: "Coming Soon",
    value: "10",
    icon: TrendingUp,
    gradient: "from-orange-500 to-amber-500",
  },
];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-gradient mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage all aspects of your portfolio from one place
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="glass-ultra p-6 rounded-2xl border-2 border-white/10 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Admin Sections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {adminSections.map((section) => {
            const Icon = section.icon;
            const isActive = section.count === "Active" || section.count.includes("profile");
            
            return (
              <motion.div key={section.href} variants={itemVariants}>
                <Link
                  href={isActive ? section.href : "#"}
                  className={`block glass-ultra p-6 rounded-2xl border-2 border-white/10 hover:border-white/20 transition-all relative overflow-hidden group ${
                    !isActive ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${section.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-colors">
                      {section.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">
                      {section.description}
                    </p>
                    
                    {/* Count Badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? `bg-gradient-to-r ${section.gradient} text-white`
                        : "bg-white/10 text-muted-foreground"
                    }`}>
                      {section.count}
                    </div>
                  </div>
                  
                  {/* Coming Soon Badge */}
                  {!isActive && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30">
                      Coming Soon
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-ultra p-6 rounded-2xl border-2 border-blue-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Settings size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Setting Up Your Admin Panel</h3>
              <p className="text-muted-foreground mb-4">
                To use the admin panel, you need to set up Firebase. Follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Console</a></li>
                <li>Enable Authentication, Firestore, and Storage</li>
                <li>Add your Firebase config to <code className="px-2 py-1 bg-white/10 rounded">.env.local</code></li>
                <li>Check <code className="px-2 py-1 bg-white/10 rounded">FIREBASE_SETUP.md</code> for detailed instructions</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

