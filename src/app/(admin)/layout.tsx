"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Code,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Trophy,
  Award,
  Image,
  Heart,
  Target,
  MessageSquare,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: User, label: "Personal Info", href: "/admin/personal-info" },
  { icon: Code, label: "Skills", href: "/admin/skills" },
  { icon: GraduationCap, label: "Education", href: "/admin/education" },
  { icon: Briefcase, label: "Experience", href: "/admin/experience" },
  { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
  { icon: Trophy, label: "Achievements", href: "/admin/achievements", comingSoon: true },
  { icon: Award, label: "Certificates", href: "/admin/certificates", comingSoon: true },
  { icon: Image, label: "Gallery", href: "/admin/gallery", comingSoon: true },
  { icon: Heart, label: "Hobbies", href: "/admin/hobbies", comingSoon: true },
  { icon: Target, label: "Future Goals", href: "/admin/goals", comingSoon: true },
  { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials", comingSoon: true },
  { icon: BookOpen, label: "Blog Posts", href: "/admin/blog", comingSoon: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 glass-ultra rounded-xl shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 glass-ultra border-r border-white/10 flex-shrink-0 flex-col fixed h-screen left-0 top-0 z-40">
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Logo */}
          <Link href="/" className="block mb-8">
            <h1 className="text-2xl font-display font-bold text-gradient">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Portfolio Management</p>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.label}
                  href={item.comingSoon ? "#" : item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  } ${item.comingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {item.comingSoon && (
                    <span className="text-[10px] px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full">
                      Soon
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-6 border-t border-white/10">
          {user && (
            <div className="mb-4 p-3 glass rounded-lg">
              <p className="text-sm font-medium truncate">
                {user.displayName || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="lg:hidden w-64 glass-ultra border-r border-white/10 flex-shrink-0 flex-col fixed h-screen left-0 top-0 z-40 flex"
        >
          <div className="p-6 flex-1 overflow-y-auto">
            {/* Logo */}
            <Link href="/" className="block mb-8" onClick={() => setSidebarOpen(false)}>
              <h1 className="text-2xl font-display font-bold text-gradient">
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Portfolio Management</p>
            </Link>

            {/* Navigation */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.label}
                    href={item.comingSoon ? "#" : item.href}
                    onClick={() => !item.comingSoon && setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative group ${
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    } ${item.comingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.comingSoon && (
                      <span className="text-[10px] px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full">
                        Soon
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Info & Logout */}
          <div className="p-6 border-t border-white/10">
            {user && (
              <div className="mb-4 p-3 glass rounded-lg">
                <p className="text-sm font-medium truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </motion.aside>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
