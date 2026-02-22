"use client";

import React from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/yourusername", hoverColor: "hover:bg-zinc-700/50 hover:text-white" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/yourusername", hoverColor: "hover:bg-blue-500/20 hover:text-blue-400" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/yourusername", hoverColor: "hover:bg-sky-500/20 hover:text-sky-400" },
  { name: "Email", icon: Mail, href: "mailto:your.email@example.com", hoverColor: "hover:bg-red-500/20 hover:text-red-400" },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-zinc-800/50 mt-20 bg-zinc-950/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              Md Asif Istiaque Zaman
            </h3>
            <p className="text-zinc-500 text-sm">
              {t.hero.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-zinc-300">{t.sections.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#projects" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
                  {t.nav.projects}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-zinc-300">Connect</h4>
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
                    className={`p-2.5 rounded-lg bg-zinc-800/50 border border-zinc-700/30 text-zinc-400 transition-colors ${social.hoverColor}`}
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
        <div className="border-t border-zinc-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Md Asif Istiaque Zaman. {t.sections.footer.rights}
          </p>
          <p className="text-zinc-600 text-xs flex items-center gap-1">
            {t.sections.footer.builtWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
