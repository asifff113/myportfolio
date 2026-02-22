"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAdmin } from "@/hooks/useAdmin";
import { Shield, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const navLinks = [
  { name: "Home", href: "#home", id: "home", color: "bg-blue-500" },
  { name: "About", href: "#about", id: "about", color: "bg-amber-500" },
  { name: "Skills", href: "#skills", id: "skills", color: "bg-emerald-500" },
  { name: "Education", href: "#education", id: "education", color: "bg-indigo-500" },
  { name: "Experience", href: "#experience", id: "experience", color: "bg-blue-500" },
  { name: "Projects", href: "#projects", id: "projects", color: "bg-orange-500" },
  { name: "Achievements", href: "#achievements", id: "achievements", color: "bg-yellow-500" },
  { name: "Certificates", href: "#certificates", id: "certificates", color: "bg-cyan-500" },
  { name: "Gallery", href: "#gallery", id: "gallery", color: "bg-rose-500" },
  { name: "Hobbies", href: "#hobbies", id: "hobbies", color: "bg-lime-500" },
  { name: "Goals", href: "#future-goals", id: "future-goals", color: "bg-purple-500" },
  { name: "Blog", href: "#blog", id: "blog", color: "bg-teal-500" },
  { name: "Testimonials", href: "#testimonials", id: "testimonials", color: "bg-orange-400" },
  { name: "Contact", href: "#contact", id: "contact", color: "bg-red-500" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const ticking = useRef(false);
  const { user } = useAuth();
  const isAdmin = useAdmin();
  const { t } = useLanguage();

  // Throttled scroll handler with requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          setShowBackToTop(window.scrollY > 500);

          // Calculate scroll progress
          const winScroll = document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (height > 0) {
            setScrollProgress((winScroll / height) * 100);
          }

          // Detect active section
          const scrollPosition = window.scrollY + 200;
          for (let i = navLinks.length - 1; i >= 0; i--) {
            const section = document.getElementById(navLinks[i].id);
            if (section && section.offsetTop <= scrollPosition) {
              setActiveSection(navLinks[i].id);
              break;
            }
          }

          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Progress Bar - rainbow multi-spectrum */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-zinc-900/50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 via-orange-500 via-purple-500 to-red-500 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-zinc-950/80 backdrop-blur-sm shadow-lg shadow-black/20 py-2"
            : "bg-transparent py-3"
        }`}
      >
        <div className="w-full px-2 sm:px-4 max-w-[100vw]">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("#home")}
              className="relative group flex items-center gap-2"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-[1px]">
                <div className="absolute inset-0 bg-zinc-950/90 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                    A
                  </span>
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="flex-1 flex items-center justify-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar px-2 mask-fade-sides">
              {navLinks.map((link) => {
                const translationKey = (link.id === 'future-goals' ? 'goals' : link.id) as keyof typeof t.nav;
                const name = t.nav[translationKey] || link.name;
                const isActive = activeSection === link.id;

                return (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className={`relative px-2 sm:px-2.5 py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                      isActive
                        ? "text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {/* Active Background - simple solid color */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSection"
                        className={`absolute inset-0 ${link.color} rounded-md -z-10 opacity-90`}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}

                    <span className="relative z-10">{name}</span>
                  </button>
                );
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition-all inline-flex items-center gap-1"
                  title="Admin Panel"
                >
                  <Shield size={16} />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-zinc-800/80 border border-zinc-700/50 shadow-lg hover:bg-zinc-700/80 transition-all hover:scale-110 group"
            title="Back to top"
          >
            <ArrowUp size={20} className="text-zinc-300 group-hover:text-white group-hover:-translate-y-0.5 transition-all" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
