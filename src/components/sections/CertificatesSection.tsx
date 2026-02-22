"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Award, Calendar, Eye, Globe, X } from "lucide-react";
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
    <Section id="certificates" sectionId="certificates">
      <SectionTitle
        title="Certificates & Credentials"
        subtitle="Professional certifications and completed courses"
        gradient="from-cyan-400 via-sky-400 to-cyan-300"
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
              className="relative max-w-5xl w-full max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
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
                    <FileText size={64} className="text-cyan-400" />
                    <p className="text-lg font-medium">Document Preview Not Available</p>
                    <p className="text-sm text-zinc-500">
                      {isFile(selectedCertificate.fileUrl)
                        ? 'Click "View Certificate" to open the file'
                        : 'No certificate file uploaded'}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-zinc-950 border-t border-zinc-800">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedCertificate.title}</h3>
                    <p className="text-zinc-400">{selectedCertificate.issuer} &bull; {formatDate(selectedCertificate.issuedDate)}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {isFile(selectedCertificate.fileUrl) ? (
                    <a
                      href={selectedCertificate.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-bold text-lg"
                    >
                      <Eye size={20} />
                      View Certificate
                    </a>
                  ) : (
                    <div className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 text-zinc-500 rounded-lg border border-zinc-700 font-medium text-lg cursor-not-allowed">
                      <FileText size={20} />
                      No certificate pdf at the moment
                    </div>
                  )}

                  {selectedCertificate.credentialUrl && (
                    <a
                      href={selectedCertificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-bold text-lg border border-zinc-700"
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
      whileHover={{ y: -6 }}
      className="bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/30 rounded-2xl overflow-hidden group relative transition-colors duration-300 flex flex-col h-full"
    >
      {/* Certified Pill Badge */}
      <div className="absolute top-3 left-3 z-20">
        <span className="bg-cyan-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          Certified
        </span>
      </div>

      {/* Preview Image or PDF Icon */}
      <div className="relative h-48 bg-zinc-800 overflow-hidden cursor-pointer" onClick={handleView}>
        {shouldShowImage ? (
          <Image
            src={certificate.previewImageUrl || certificate.fileUrl}
            alt={certificate.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <div className="relative">
              <FileText size={64} className="text-zinc-600" />
              {isPDF && (
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                  PDF
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-zinc-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleView(e); }}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded-full shadow-lg hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-colors"
            aria-label="View Certificate"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Icon & Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex-shrink-0">
            <Award className="text-cyan-400" size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1 text-zinc-100 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
              {certificate.title}
            </h3>
            <p className="text-sm text-cyan-400/80 font-semibold">
              {certificate.issuer}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
          <Calendar size={14} />
          <span>Issued: {formatDate(certificate.issuedDate)}</span>
        </div>

        {/* Expiry Date */}
        {certificate.expiryDate && (
          <div className="text-xs text-zinc-500 mb-3">
            Expires: {formatDate(certificate.expiryDate)}
          </div>
        )}

        {/* Description */}
        {certificate.description && (
          <p className="text-sm text-zinc-400 mb-4 line-clamp-2 flex-1">
            {certificate.description}
          </p>
        )}

        {/* Skills */}
        {certificate.skills && certificate.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {certificate.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1"
                >
                  {skill}
                </span>
              ))}
              {certificate.skills.length > 3 && (
                <span className="text-zinc-500 text-xs px-2 py-1">
                  +{certificate.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Credential Info */}
        {certificate.credentialId && (
          <div className="mb-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
            <p className="text-xs text-zinc-500 mb-1">Credential ID</p>
            <p className="text-xs font-mono font-semibold text-zinc-300 break-all">
              {certificate.credentialId}
            </p>
          </div>
        )}

        {/* Action Links */}
        <div className="mt-auto">
          <button
            onClick={handleView}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-lg transition-colors font-bold"
          >
            <Eye size={16} />
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
}
