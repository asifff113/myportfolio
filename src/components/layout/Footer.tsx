"use client";

import React from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/yourusername", hoverColor: "hover:bg-slate-100 hover:text-slate-900 hover:border-slate-200" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/yourusername", hoverColor: "hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-200" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/yourusername", hoverColor: "hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-200" },
  { name: "Email", icon: Mail, href: "mailto:your.email@example.com", hoverColor: "hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-200" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_15%_20%,rgba(99,102,241,0.06),transparent_40%),radial-gradient(ellipse_50%_35%_at_85%_15%,rgba(236,72,153,0.05),transparent_35%),radial-gradient(ellipse_60%_40%_at_60%_90%,rgba(16,185,129,0.05),transparent_40%)]" />

      <div className="container mx-auto px-4 py-12">
        <div className="rounded-3xl border border-white/80 bg-white/65 backdrop-blur-2xl shadow-[0_20px_50px_-30px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent mb-4">
              Md Asif Istiaque Zaman
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t.hero.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-800">{t.sections.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#projects" className="text-slate-600 hover:text-orange-500 transition-colors text-sm font-medium">
                  {t.nav.projects}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-600 hover:text-rose-500 transition-colors text-sm font-medium">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-xl bg-white/75 border border-white/80 text-slate-600 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.4)] transition-all ${social.hoverColor}`}
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
        <div className="border-t border-white/70 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Md Asif Istiaque Zaman. {t.sections.footer.rights}
          </p>
          <p className="text-slate-500 text-xs flex items-center gap-1">
            {t.sections.footer.builtWith}
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}
