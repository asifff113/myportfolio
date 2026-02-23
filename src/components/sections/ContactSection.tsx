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
    <Section id="contact" sectionId="contact">
      <SectionTitle
        title={t.sections.contact.title}
        subtitle={t.sections.contact.subtitle}
        gradient="from-red-400 via-rose-400 to-red-300"
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
              <span className="bg-gradient-to-r from-red-400 via-rose-400 to-red-300 bg-clip-text text-transparent">Let&apos;s Connect</span>
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
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
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex items-center gap-5 p-5 bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-red-500/20 hover:border-red-400/40 rounded-xl transition-all group shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(244,63,94,0.3)]"
              >
                <div className="p-3 bg-blue-100 rounded-xl border border-blue-200/40">
                  <Mail size={28} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-0.5">Email</p>
                  <p className="font-bold text-slate-200 group-hover:text-blue-600 transition-colors">{contactInfo.email}</p>
                </div>
              </motion.a>
            )}

            {/* Phone */}
            {contactInfo.phone && (
              <motion.a
                href={`tel:${contactInfo.phone}`}
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex items-center gap-5 p-5 bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-red-500/20 hover:border-red-400/40 rounded-xl transition-all group shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(244,63,94,0.3)]"
              >
                <div className="p-3 bg-purple-100 rounded-xl border border-purple-200/40">
                  <Phone size={28} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-0.5">Phone</p>
                  <p className="font-bold text-slate-200 group-hover:text-purple-600 transition-colors">{contactInfo.phone}</p>
                </div>
              </motion.a>
            )}

            {/* Location */}
            {contactInfo.location && (
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex items-center gap-5 p-5 bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-red-500/20 hover:border-red-400/40 rounded-xl transition-all group shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(244,63,94,0.3)]"
              >
                <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-200/40">
                  <MapPin size={28} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-0.5">Location</p>
                  <p className="font-bold text-slate-200 group-hover:text-emerald-600 transition-colors">{contactInfo.location}</p>
                </div>
              </motion.div>
            )}

            {/* Response Time */}
            {contactInfo.responseTime && (
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex items-center gap-5 p-5 bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-red-500/20 hover:border-red-400/40 rounded-xl transition-all group shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(244,63,94,0.3)]"
              >
                <div className="p-3 bg-amber-100 rounded-xl border border-amber-200/40">
                  <Clock size={28} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium mb-0.5">Response Time</p>
                  <p className="font-bold text-slate-200 group-hover:text-amber-600 transition-colors">{contactInfo.responseTime}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Social Links */}
          {contactInfo.socialLinks && contactInfo.socialLinks.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Follow Me</h4>
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
                      whileHover={{ y: -6, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-red-500/20 hover:border-red-400/40 rounded-xl transition-all shadow-sm hover:shadow-[0_10px_20px_-5px_rgba(244,63,94,0.4)]"
                      aria-label={social.platform}
                    >
                      <Icon size={24} className="text-slate-300" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Contact Form */}
        <motion.div variants={itemVariants}>
          <form onSubmit={handleSubmit(onSubmit)} className="bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 space-y-6 shadow-sm">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 ml-1 text-slate-300">
                {t.sections.contact.form.name}
              </label>
              <div className="relative">
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className={`w-full bg-[rgba(15,15,40,0.70)] backdrop-blur-sm border ${
                    errors.name ? "border-red-500" : "border-white/10"
                  } focus:border-red-500 rounded-lg px-4 py-3 text-white outline-none focus:ring-1 focus:ring-red-500/50 transition-all`}
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
              <label htmlFor="email" className="block text-sm font-medium mb-2 ml-1 text-slate-300">
                {t.sections.contact.form.email}
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className={`w-full bg-[rgba(15,15,40,0.70)] backdrop-blur-sm border ${
                    errors.email ? "border-red-500" : "border-white/10"
                  } focus:border-red-500 rounded-lg px-4 py-3 text-white outline-none focus:ring-1 focus:ring-red-500/50 transition-all`}
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
              <label htmlFor="subject" className="block text-sm font-medium mb-2 ml-1 text-slate-300">
                {t.sections.contact.form.subject}
              </label>
              <div className="relative">
                <input
                  {...register("subject")}
                  type="text"
                  id="subject"
                  className={`w-full bg-[rgba(15,15,40,0.70)] backdrop-blur-sm border ${
                    errors.subject ? "border-red-500" : "border-white/10"
                  } focus:border-red-500 rounded-lg px-4 py-3 text-white outline-none focus:ring-1 focus:ring-red-500/50 transition-all`}
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
              <label htmlFor="message" className="block text-sm font-medium mb-2 ml-1 text-slate-300">
                {t.sections.contact.form.message}
              </label>
              <div className="relative">
                <textarea
                  {...register("message")}
                  id="message"
                  rows={5}
                  className={`w-full bg-[rgba(15,15,40,0.70)] backdrop-blur-sm border ${
                    errors.message ? "border-red-500" : "border-white/10"
                  } focus:border-red-500 rounded-lg px-4 py-3 text-white outline-none focus:ring-1 focus:ring-red-500/50 transition-all resize-none`}
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
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px -10px rgba(244,63,94,0.5)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
            className="mt-6 p-6 bg-[rgba(15,15,40,0.65)] backdrop-blur-xl border border-red-500/20 rounded-2xl"
          >
            <h4 className="text-lg font-semibold mb-4 text-white">Prefer to schedule a call?</h4>
            <p className="text-sm text-slate-400 mb-4">
              Book a time that works for you, and let&apos;s chat!
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Replace with your actual scheduling links */}
              <motion.a
                href="https://calendly.com/yourname" // TODO: Replace with your Calendly link
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-[rgba(15,15,40,0.70)] border border-red-500/20 hover:border-red-400/40 rounded-lg transition-all text-sm font-medium text-slate-300"
              >
                <Clock size={16} />
                <span>Schedule on Calendly</span>
              </motion.a>
              <motion.a
                href={`mailto:${contactInfo.email}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-[rgba(15,15,40,0.70)] border border-red-500/20 hover:border-red-400/40 rounded-lg transition-all text-sm font-medium text-slate-300"
              >
                <Mail size={16} />
                <span>Email Directly</span>
              </motion.a>
            </div>
            {contactInfo.availability && (
              <p className="mt-4 text-xs text-slate-400">
                <strong>Office Hours:</strong> {contactInfo.availability}
              </p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
