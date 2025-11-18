"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdmin } from "@/hooks/useAdmin";
import { Shield } from "lucide-react";
import { Settings, ArrowUp, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { name: "Home", href: "#home", id: "home", gradient: "from-blue-400 via-cyan-400 to-teal-400" },
  { name: "About", href: "#about", id: "about", gradient: "from-purple-400 via-pink-400 to-rose-400" },
  { name: "Skills", href: "#skills", id: "skills", gradient: "from-green-400 via-emerald-400 to-lime-400" },
  { name: "Education", href: "#education", id: "education", gradient: "from-orange-400 via-amber-400 to-yellow-400" },
  { name: "Experience", href: "#experience", id: "experience", gradient: "from-red-400 via-pink-400 to-purple-400" },
  { name: "Projects", href: "#projects", id: "projects", gradient: "from-indigo-400 via-blue-400 to-cyan-400" },
  { name: "Achievements", href: "#achievements", id: "achievements", gradient: "from-fuchsia-400 via-purple-400 to-pink-400" },
  { name: "Certificates", href: "#certificates", id: "certificates", gradient: "from-sky-400 via-blue-400 to-indigo-400" },
  { name: "Gallery", href: "#gallery", id: "gallery", gradient: "from-violet-400 via-purple-400 to-fuchsia-400" },
  { name: "Hobbies", href: "#hobbies", id: "hobbies", gradient: "from-lime-400 via-green-400 to-emerald-400" },
  { name: "Goals", href: "#future-goals", id: "future-goals", gradient: "from-cyan-400 via-blue-400 to-purple-400" },
  { name: "Blog", href: "#blog", id: "blog", gradient: "from-pink-400 via-rose-400 to-red-400" },
  { name: "Testimonials", href: "#testimonials", id: "testimonials", gradient: "from-teal-400 via-cyan-400 to-sky-400" },
  { name: "Contact", href: "#contact", id: "contact", gradient: "from-rose-400 via-pink-400 to-fuchsia-400" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { user } = useAuth();
  const isAdmin = useAdmin();

  // Scroll-spy effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 500);

      // Calculate scroll progress
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // Detect active section
      const sections = navLinks.map(link => document.getElementById(link.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-background/20">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <nav
        className={`fixed top-1 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg py-2" : "bg-transparent py-3"
        }`}
      >
        <div className="w-full px-2 sm:px-4 max-w-[100vw]">
          <div className="flex items-center justify-between gap-2">
            {/* Logo/Home - Smaller */}
            <button
              onClick={() => scrollToSection("#home")}
              className="text-base sm:text-lg font-display font-bold text-gradient hover:opacity-80 transition-opacity flex-shrink-0"
            >
              Portfolio
            </button>

            {/* Navigation Links - SOLID COLORFUL STYLE */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-1 justify-center overflow-x-auto scrollbar-hide max-w-[calc(100vw-250px)]">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollToSection(link.href)}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all duration-300 whitespace-nowrap relative overflow-hidden group ${
                    activeSection === link.id
                      ? "shadow-xl"
                      : "shadow-md hover:shadow-lg"
                  }`}
                >
                  {/* Solid Gradient Background - Always Visible */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${link.gradient} transition-opacity duration-300 ${
                      activeSection === link.id
                        ? "opacity-100"
                        : "opacity-70 group-hover:opacity-90"
                    }`}
                  />
                  
                  {/* Pulsing Glow Effect for Active */}
                  {activeSection === link.id && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${link.gradient} blur-lg`}
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  
                  {/* White Text - Always Visible */}
                  <span className={`relative z-10 text-white font-black ${
                    activeSection === link.id
                      ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                      : "drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
                  }`}>
                    {link.name}
                  </span>
                  
                  {/* Shimmer Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    }}
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  {/* Bottom Accent Line for Active */}
                  {activeSection === link.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-white shadow-lg"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-medium text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-all inline-flex items-center gap-1"
                  title="Admin Panel"
                >
                  <Shield size={16} />
                </Link>
              )}
            </div>

            {/* Dark Mode Indicator - Smaller */}
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Moon size={14} className="text-primary" />
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
            className="fixed bottom-8 right-8 z-40 p-3 rounded-full glass shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
            title="Back to top"
          >
            <ArrowUp size={20} className="text-primary group-hover:translate-y-[-2px] transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

