"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, ExternalLink, Award, Calendar, CheckCircle, Eye, Globe, X } from "lucide-react";
import { Certificate } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import { formatDate } from "@/lib/utils";

interface CertificatesSectionProps {
  certificates: Certificate[];
}

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

export default function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  if (!certificates || certificates.length === 0) {
    return null;
  }

  // Helper to check if URL is likely an image
  const isImage = (url?: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    if (lower.endsWith('.pdf')) return false;
    
    return lower.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) != null || 
           url.includes('images.unsplash.com') || 
           ((url.includes('supabase.co') || url.includes('firebasestorage')) && !lower.includes('.pdf'));
  };

  // Helper to check if URL is a file (PDF or Image) from storage
  const isFile = (url?: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.includes('supabase.co') || 
           lower.includes('firebasestorage') || 
           lower.endsWith('.pdf') || 
           lower.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) != null;
  };

  return (
    <Section id="certificates">
      <SectionTitle
        title="Certificates & Credentials"
        subtitle="Professional certifications and completed courses"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {certificates.map((certificate, index) => (
          <CertificateCard 
            key={certificate.id || index} 
            certificate={certificate} 
            onView={(cert) => setSelectedCertificate(cert)}
          />
        ))}
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 w-full relative bg-black/50 flex items-center justify-center p-4 overflow-hidden">
                {selectedCertificate.previewImageUrl || (isFile(selectedCertificate.fileUrl) && isImage(selectedCertificate.fileUrl)) ? (
                  <div className="relative w-full h-full min-h-[50vh]">
                    <Image
                      src={selectedCertificate.previewImageUrl || selectedCertificate.fileUrl}
                      alt={selectedCertificate.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-white gap-4">
                    <FileText size={64} className="text-primary" />
                    <p className="text-lg font-medium">Document Preview Not Available</p>
                    <p className="text-sm text-gray-400">
                      {isFile(selectedCertificate.fileUrl) 
                        ? 'Click "View Certificate" to open the file' 
                        : 'No certificate file uploaded'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-gray-900 border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedCertificate.title}</h3>
                    <p className="text-gray-400">{selectedCertificate.issuer} • {formatDate(selectedCertificate.issuedDate)}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {isFile(selectedCertificate.fileUrl) ? (
                    <a
                      href={selectedCertificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-bold text-lg"
                    >
                      <Eye size={20} />
                      View Certificate
                    </a>
                  ) : (
                    <div className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-gray-400 rounded-lg border border-gray-700 font-medium text-lg cursor-not-allowed">
                      <FileText size={20} />
                      No certificate pdf at the moment
                    </div>
                  )}

                  {selectedCertificate.credentialUrl && (
                    <a
                      href={selectedCertificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-bold text-lg border border-white/10"
                    >
                      <Globe size={20} />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

// Certificate Card Component
interface CertificateCardProps {
  certificate: Certificate;
  onView: (certificate: Certificate) => void;
}

function CertificateCard({ certificate, onView }: CertificateCardProps) {
  const [imageError, setImageError] = useState(false);
  const isPDF = certificate.fileUrl?.toLowerCase().endsWith('.pdf');
  
  // Helper to check if URL is likely an image
  const isImage = (url?: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    if (lower.endsWith('.pdf')) return false;
    
    return lower.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) != null || 
           url.includes('images.unsplash.com') || 
           ((url.includes('supabase.co') || url.includes('firebasestorage')) && !lower.includes('.pdf'));
  };

  const shouldShowImage = !imageError && (certificate.previewImageUrl || (certificate.fileUrl && !isPDF && isImage(certificate.fileUrl)));

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    onView(certificate);
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass-ultra rounded-2xl overflow-hidden group relative card-3d border border-white/5 hover:border-primary/30 transition-colors duration-500 flex flex-col h-full"
    >
      {/* Ribbon Corner Effect */}
      <div className="absolute -top-[10px] -left-[10px] w-24 h-24 overflow-hidden z-20 pointer-events-none">
        <div className="absolute top-[20px] left-[-32px] w-[120px] h-8 bg-gradient-to-r from-primary via-accent to-primary text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center transform -rotate-45 shadow-lg z-20 animate-shimmer">
          Certified
        </div>
      </div>

      {/* Preview Image or PDF Icon */}
      <div className="relative h-48 bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 overflow-hidden cursor-pointer" onClick={handleView}>
        {shouldShowImage ? (
          <Image
            src={certificate.previewImageUrl || certificate.fileUrl}
            alt={certificate.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-animated">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <FileText size={64} className="text-primary/50" />
              {isPDF && (
                <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-lg shadow-lg shimmer">
                  PDF
                </div>
              )}
            </motion.div>
          </div>
        )}
        
        {/* Animated overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-secondary/0 group-hover:from-primary/20 group-hover:via-accent/10 group-hover:to-secondary/20 transition-all duration-500" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 gap-4">
          {/* View Button */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); handleView(e); }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.9 }}
            transition={{ delay: 0.1 }}
            className="p-4 glass-ultra rounded-full shadow-2xl hover:bg-primary hover:text-primary-foreground transition-colors neon-glow-hover magnetic"
            aria-label="View Certificate"
          >
            <Eye size={22} />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Icon & Title */}
        <div className="flex items-start gap-3 mb-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0 neon-glow-hover"
          >
            <Award className="text-primary" size={22} />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1 group-hover:text-gradient transition-all duration-300 line-clamp-2 neon-text-hover">
              {certificate.title}
            </h3>
            <p className="text-sm text-primary font-semibold">
              {certificate.issuer}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar size={14} />
          <span>Issued: {formatDate(certificate.issuedDate)}</span>
        </div>

        {/* Expiry Date */}
        {certificate.expiryDate && (
          <div className="text-xs text-muted-foreground mb-3">
            Expires: {formatDate(certificate.expiryDate)}
          </div>
        )}

        {/* Description */}
        {certificate.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
            {certificate.description}
          </p>
        )}

        {/* Skills */}
        {certificate.skills && certificate.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {certificate.skills.slice(0, 3).map((skill, index) => {
                // Colorful gradients for skills
                const skillColors = [
                  "from-blue-500 to-cyan-500",
                  "from-purple-500 to-pink-500",
                  "from-green-500 to-emerald-500",
                  "from-orange-500 to-yellow-500",
                ];
                const skillColor = skillColors[index % skillColors.length];
                
                return (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`px-3 py-1.5 bg-gradient-to-r ${skillColor} bg-opacity-20 text-white rounded-lg text-xs font-bold border border-white/30 hover:border-white/60 hover:shadow-lg transition-all cursor-default relative overflow-hidden group/skill`}
                  >
                    <span className="relative z-10">{skill}</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/skill:opacity-100 transition-opacity" />
                  </motion.span>
                );
              })}
              {certificate.skills.length > 3 && (
                <span className="px-2 py-1 text-muted-foreground text-xs">
                  +{certificate.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Credential Info */}
        {certificate.credentialId && (
          <div className="mb-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Credential ID</p>
            <p className="text-xs font-mono font-semibold break-all">
              {certificate.credentialId}
            </p>
          </div>
        )}

        {/* Action Links */}
        <div className="mt-auto">
          <button
            onClick={handleView}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors font-bold"
          >
            <Eye size={16} />
            View
          </button>
        </div>
      </div>

      {/* Enhanced Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-neon-cyan/10 to-neon-purple/10 animate-pulse" />
        <div className="absolute inset-0 neon-glow" />
      </div>
      
      {/* Floating particles on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <motion.div
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-neon-cyan rounded-full neon-glow"
        />
      </div>
    </motion.div>
  );
}

