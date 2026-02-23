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
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gradient-to-r from-transparent via-white/5 to-transparent">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 via-cyan-400 via-emerald-400 via-orange-400 to-rose-500 transition-[width] duration-200 ease-out shadow-[0_0_20px_rgba(99,102,241,0.4),0_0_40px_rgba(99,102,241,0.15)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-2"
            : "py-3.5"
        }`}
      >
        <div className="w-full px-3 sm:px-5 max-w-[100vw]">
          <div
            className={`flex items-center justify-between gap-2 rounded-2xl border transition-all duration-500 px-2 sm:px-3 ${
              scrolled
                ? "bg-[rgba(10,10,30,0.85)] border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_-30px_rgba(99,102,241,0.25),0_0_0_1px_rgba(99,102,241,0.10)]"
                : "bg-[rgba(10,10,30,0.60)] border-white/8 backdrop-blur-xl shadow-[0_12px_30px_-20px_rgba(99,102,241,0.15)]"
            }`}
          >
            {/* Logo */}
            <button
              onClick={() => scrollToSection("#home")}
              className="relative group flex items-center gap-2 rounded-xl p-1.5"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 p-[1.5px] shadow-[0_8px_20px_-10px_rgba(99,102,241,0.35)] group-hover:shadow-[0_12px_28px_-8px_rgba(99,102,241,0.45)] transition-shadow">
                <div className="absolute inset-0 rounded-[11px] bg-[rgba(10,10,30,0.95)] backdrop-blur-xl flex items-center justify-center">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500">
                    A
                  </span>
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto no-scrollbar px-2 sm:px-3 py-2 mask-fade-sides">
              {navLinks.map((link) => {
                const translationKey = (link.id === 'future-goals' ? 'goals' : link.id) as keyof typeof t.nav;
                const name = t.nav[translationKey] || link.name;
                const isActive = activeSection === link.id;

                return (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className={`group relative px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {!isActive && (
                      <span className="absolute inset-0 rounded-xl border border-transparent group-hover:border-white/10 transition-colors" />
                    )}

                    {/* Active Background with glow */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSection"
                        className={`absolute inset-0 ${link.color} rounded-xl -z-10 shadow-[0_8px_20px_-8px_currentColor]`}
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      />
                    )}

                    {isActive && (
                      <div className="absolute inset-[1px] rounded-[11px] bg-gradient-to-b from-white/25 to-transparent -z-10" />
                    )}

                    <span className="relative z-10">{name}</span>
                  </button>
                );
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-2 py-1.5 text-[10px] sm:text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl border border-transparent hover:border-blue-500/30 transition-all inline-flex items-center gap-1"
                  title="Admin Panel"
                >
                  <Shield size={16} />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 py-1">
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
            className="fixed bottom-8 right-8 z-40 p-3 rounded-2xl bg-[rgba(10,10,30,0.80)] border border-indigo-500/20 shadow-[0_16px_40px_-20px_rgba(99,102,241,0.35)] hover:bg-[rgba(10,10,30,0.90)] hover:shadow-[0_20px_48px_-20px_rgba(99,102,241,0.45)] transition-all hover:scale-110 group backdrop-blur-xl"
            title="Back to top"
          >
            <ArrowUp size={20} className="text-indigo-400 group-hover:text-indigo-300 group-hover:-translate-y-0.5 transition-all" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
