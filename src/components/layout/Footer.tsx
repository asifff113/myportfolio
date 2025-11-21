"use client";

import React from "react";
import { Github, Linkedin, Mail, Twitter, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// TODO: Replace these with your actual social links
const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/yourusername" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/yourusername" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/yourusername" },
  { name: "Email", icon: Mail, href: "mailto:your.email@example.com" },
];

export default function Footer() {
  const { t } = useLanguage();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative glass border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-display font-bold text-gradient mb-4">
              {/* Your full name */}
              Md Asif Istiaque Zaman
            </h3>
            <p className="text-muted-foreground text-sm">
              {t.hero.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.sections.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t.nav.projects}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 glass rounded-lg hover:bg-primary/20 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {new Date().getFullYear()} Md Asif Istiaque Zaman. {t.sections.footer.rights}
          </p>
          <p className="text-muted-foreground text-xs flex items-center gap-1">
            {t.sections.footer.builtWith}
          </p>
        </div>
      </div>
    </footer>
  );
}

