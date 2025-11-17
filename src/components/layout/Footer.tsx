"use client";

import React from "react";
import { Github, Linkedin, Mail, Twitter, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

// TODO: Replace these with your actual social links
const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/yourusername" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/yourusername" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/yourusername" },
  { name: "Email", icon: Mail, href: "mailto:your.email@example.com" },
];

export default function Footer() {
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
              {/* TODO: Replace with your name */}
              YourName
            </h3>
            <p className="text-muted-foreground text-sm">
              Building beautiful and functional web experiences with modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Me
                </a>
              </li>
              <li>
                <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <a href="#blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Blog
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
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Your Name. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow neon-glow"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </motion.button>
    </footer>
  );
}

