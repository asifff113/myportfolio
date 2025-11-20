"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { ContactInfo } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ContactSectionProps {
  contactInfo: ContactInfo;
}

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

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

// Social icon mapping
const socialIconMap: Record<string, React.ElementType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  Twitter: FaTwitter,
};

export default function ContactSection({ contactInfo }: ContactSectionProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setSubmitStatus("success");
      reset();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" className="relative overflow-hidden">
      <SectionTitle
        title={t.sections.contact.title}
        subtitle={t.sections.contact.subtitle}
      />

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-2xl font-display font-bold mb-6">
              <span className="text-gradient">Let's Connect</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {contactInfo.availability ||
                "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision."}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            {/* Email */}
            {contactInfo.email && (
              <motion.a
                href={`mailto:${contactInfo.email}`}
                whileHover={{ scale: 1.04, x: 8 }}
                className="flex items-center gap-5 p-6 glass-ultra rounded-2xl hover:bg-primary/10 transition-colors group card-3d neon-glow-hover relative overflow-hidden border-2 border-white/10 hover:border-white/20 shadow-lg"
              >
                {/* Wave Background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="p-4 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-2xl group-hover:from-blue-500/50 group-hover:to-cyan-500/50 transition-colors shimmer border-2 border-cyan-400/30 shadow-xl relative z-10"
                >
                  <Mail size={32} className="text-cyan-300" />
                </motion.div>
                <div className="relative z-10">
                  <p className="text-sm text-gray-400 font-medium mb-1">Email</p>
                  <p className="font-bold text-lg text-gray-200 group-hover:text-cyan-300 transition-colors">{contactInfo.email}</p>
                </div>
              </motion.a>
            )}

            {/* Phone */}
            {contactInfo.phone && (
              <motion.a
                href={`tel:${contactInfo.phone}`}
                whileHover={{ scale: 1.04, x: 8 }}
                className="flex items-center gap-5 p-6 glass-ultra rounded-2xl hover:bg-primary/10 transition-colors group card-3d neon-glow-hover relative overflow-hidden border-2 border-white/10 hover:border-white/20 shadow-lg"
              >
                {/* Wave Background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="p-4 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl group-hover:from-purple-500/50 group-hover:to-pink-500/50 transition-colors shimmer border-2 border-pink-400/30 shadow-xl relative z-10"
                >
                  <Phone size={32} className="text-pink-300" />
                </motion.div>
                <div className="relative z-10">
                  <p className="text-sm text-gray-400 font-medium mb-1">Phone</p>
                  <p className="font-bold text-lg text-gray-200 group-hover:text-pink-300 transition-colors">{contactInfo.phone}</p>
                </div>
              </motion.a>
            )}

            {/* Location */}
            {contactInfo.location && (
              <motion.div
                whileHover={{ scale: 1.04, x: 8 }}
                className="flex items-center gap-5 p-6 glass-ultra rounded-2xl group card-3d relative overflow-hidden border-2 border-white/10 hover:border-white/20 shadow-lg"
              >
                {/* Wave Background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="p-4 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl group-hover:from-green-500/50 group-hover:to-emerald-500/50 transition-colors border-2 border-emerald-400/30 shadow-xl relative z-10"
                >
                  <MapPin size={32} className="text-emerald-300" />
                </motion.div>
                <div className="relative z-10">
                  <p className="text-sm text-gray-400 font-medium mb-1">Location</p>
                  <p className="font-bold text-lg text-gray-200 group-hover:text-emerald-300 transition-colors">{contactInfo.location}</p>
                </div>
              </motion.div>
            )}

            {/* Response Time */}
            {contactInfo.responseTime && (
              <motion.div
                whileHover={{ scale: 1.04, x: 8 }}
                className="flex items-center gap-5 p-6 glass-ultra rounded-2xl group card-3d relative overflow-hidden border-2 border-white/10 hover:border-white/20 shadow-lg"
              >
                {/* Wave Background */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="p-4 bg-gradient-to-br from-orange-500/30 to-amber-500/30 rounded-2xl group-hover:from-orange-500/50 group-hover:to-amber-500/50 transition-colors border-2 border-amber-400/30 shadow-xl relative z-10"
                >
                  <Clock size={32} className="text-amber-300" />
                </motion.div>
                <div className="relative z-10">
                  <p className="text-sm text-gray-400 font-medium mb-1">Response Time</p>
                  <p className="font-bold text-lg text-gray-200 group-hover:text-amber-300 transition-colors">{contactInfo.responseTime}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Social Links */}
          {contactInfo.socialLinks && contactInfo.socialLinks.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Me</h4>
              <div className="flex gap-4">
                {contactInfo.socialLinks.map((social) => {
                  const Icon = socialIconMap[social.platform];
                  if (!Icon) return null;

                  return (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 glass-ultra rounded-xl hover:bg-primary/20 transition-colors magnetic neon-glow-hover relative group"
                    aria-label={social.platform}
                  >
                    <Icon size={26} className="relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit(onSubmit)} className="glass-ultra p-8 rounded-2xl space-y-6 relative overflow-hidden group">
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 ml-1">
                {t.sections.contact.form.name}
              </label>
              <div className="relative group">
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className={`w-full bg-background/50 border ${
                    errors.name ? "border-red-500" : "border-border"
                  } rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all group-hover:bg-background/80`}
                  placeholder={t.sections.contact.form.name}
                />
                {errors.name && (
                  <span className="absolute right-3 top-3 text-red-500">
                    <AlertCircle size={18} />
                  </span>
                )}
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 ml-1">
                {t.sections.contact.form.email}
              </label>
              <div className="relative group">
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className={`w-full bg-background/50 border ${
                    errors.email ? "border-red-500" : "border-border"
                  } rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all group-hover:bg-background/80`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <span className="absolute right-3 top-3 text-red-500">
                    <AlertCircle size={18} />
                  </span>
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2 ml-1">
                {t.sections.contact.form.subject}
              </label>
              <div className="relative group">
                <input
                  {...register("subject")}
                  type="text"
                  id="subject"
                  className={`w-full bg-background/50 border ${
                    errors.subject ? "border-red-500" : "border-border"
                  } rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all group-hover:bg-background/80`}
                  placeholder={t.sections.contact.form.subject}
                />
                {errors.subject && (
                  <span className="absolute right-3 top-3 text-red-500">
                    <AlertCircle size={18} />
                  </span>
                )}
              </div>
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.subject.message}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 ml-1">
                {t.sections.contact.form.message}
              </label>
              <div className="relative group">
                <textarea
                  {...register("message")}
                  id="message"
                  rows={5}
                  className={`w-full bg-background/50 border ${
                    errors.message ? "border-red-500" : "border-border"
                  } rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none group-hover:bg-background/80`}
                  placeholder={t.sections.contact.form.message}
                />
                {errors.message && (
                  <span className="absolute right-3 top-3 text-red-500">
                    <AlertCircle size={18} />
                  </span>
                )}
              </div>
              {errors.message && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
              {isSubmitting ? (
                <>
                  <Clock className="animate-spin" size={20} />
                  {t.sections.contact.form.sending}
                </>
              ) : (
                <>
                  <Send size={20} />
                  {t.sections.contact.form.send}
                </>
              )}
            </motion.button>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-500"
              >
                <CheckCircle size={20} />
                <p className="font-medium">{t.sections.contact.form.success}</p>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500"
              >
                <AlertCircle size={20} />
                <p className="font-medium">{errorMessage || t.sections.contact.form.error}</p>
              </motion.div>
            )}
          </form>

          {/* Scheduling & Alternative Contact Options */}
            <motion.div
              variants={itemVariants}
              className="mt-6 p-6 glass-ultra rounded-xl card-3d group relative overflow-hidden"
            >
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <h4 className="text-lg font-semibold mb-4 relative z-10">Prefer to schedule a call?</h4>
              <p className="text-sm text-muted-foreground mb-4 relative z-10">
                Book a time that works for you, and let's chat!
              </p>
              <div className="flex flex-wrap gap-3 relative z-10">
                {/* Replace with your actual scheduling links */}
                <motion.a
                  href="https://calendly.com/yourname" // TODO: Replace with your Calendly link
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 glass-ultra hover:bg-primary/20 rounded-lg transition-colors text-sm font-medium neon-glow-hover"
                >
                  <Clock size={16} />
                  <span>Schedule on Calendly</span>
                </motion.a>
                <motion.a
                  href={`mailto:${contactInfo.email}`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 glass-ultra hover:bg-primary/20 rounded-lg transition-colors text-sm font-medium neon-glow-hover"
                >
                  <Mail size={16} />
                  <span>Email Directly</span>
                </motion.a>
              </div>
              {contactInfo.availability && (
                <p className="mt-4 text-xs text-muted-foreground relative z-10">
                  <strong>Office Hours:</strong> {contactInfo.availability}
                </p>
              )}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}

