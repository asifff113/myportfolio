"use client";

import React from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/yourusername", hoverColor: "hover:bg-white/10 hover:text-white hover:border-white/20" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/yourusername", hoverColor: "hover:bg-blue-500/15 hover:text-blue-400 hover:border-blue-500/30" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/yourusername", hoverColor: "hover:bg-sky-500/15 hover:text-sky-400 hover:border-sky-500/30" },
  { name: "Email", icon: Mail, href: "mailto:your.email@example.com", hoverColor: "hover:bg-rose-500/15 hover:text-rose-400 hover:border-rose-500/30" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_15%_20%,rgba(99,102,241,0.10),transparent_40%),radial-gradient(ellipse_50%_35%_at_85%_15%,rgba(236,72,153,0.08),transparent_35%),radial-gradient(ellipse_60%_40%_at_60%_90%,rgba(16,185,129,0.08),transparent_40%)]" />

      <div className="container mx-auto px-4 py-12">
        <div className="rounded-3xl border border-indigo-500/15 bg-[rgba(10,10,30,0.80)] backdrop-blur-2xl shadow-[0_20px_50px_-30px_rgba(0,0,0,0.40),0_0_40px_-10px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.04)] p-6 sm:p-8 relative overflow-hidden holo-shimmer">
        {/* Holographic grid overlay */}
        <div className="absolute inset-0 holo-grid opacity-10 pointer-events-none rounded-3xl" />
        {/* Corner HUD accents */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl">
          <div className="absolute left-4 top-4 h-5 w-5 border-l-2 border-t-2 border-indigo-500/25 rounded-tl-lg" />
          <div className="absolute right-4 top-4 h-5 w-5 border-r-2 border-t-2 border-indigo-500/20 rounded-tr-lg" />
          <div className="absolute left-4 bottom-4 h-5 w-5 border-l-2 border-b-2 border-indigo-500/20 rounded-bl-lg" />
          <div className="absolute right-4 bottom-4 h-5 w-5 border-r-2 border-b-2 border-indigo-500/25 rounded-br-lg" />
        </div>
        <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent mb-4 gradient-text-animated">
              Md Asif Istiaque Zaman
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t.hero.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">{t.sections.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-slate-400 hover:text-amber-400 transition-colors text-sm font-medium neon-underline inline-block">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#projects" className="text-slate-400 hover:text-orange-400 transition-colors text-sm font-medium neon-underline inline-block">
                  {t.nav.projects}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-rose-400 transition-colors text-sm font-medium neon-underline inline-block">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-xl bg-[rgba(15,15,40,0.60)] border border-white/10 text-slate-400 shadow-[0_10px_22px_-18px_rgba(0,0,0,0.5)] transition-all ${social.hoverColor} cyber-border-glow`}
                    aria-label={social.name}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Md Asif Istiaque Zaman. {t.sections.footer.rights}
          </p>

        </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
