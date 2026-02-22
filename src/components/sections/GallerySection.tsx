"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { GalleryItem } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");

  if (!gallery || gallery.length === 0) {
    return null;
  }

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(gallery.map((item) => item.category).filter((c): c is string => !!c)))];

  // Filter gallery items
  const filteredGallery = filter === "All"
    ? gallery
    : gallery.filter((item) => item.category === filter);

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredGallery.length) % filteredGallery.length);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredGallery.length);
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <Section id="gallery" sectionId="gallery">
      <SectionTitle
        title="Gallery"
        subtitle="Moments and memories captured along the way"
        gradient="from-rose-400 via-pink-400 to-rose-300"
      />

      {/* Category Filters */}
      {categories.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                filter === category
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/20"
                  : "bg-zinc-800/50 border border-zinc-700/30 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredGallery.map((item, index) => (
            <GalleryCard
              key={item.id || index}
              item={item}
              index={index}
              onClick={() => openLightbox(index)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <Lightbox
            items={filteredGallery}
            currentIndex={selectedImage}
            onClose={closeLightbox}
            onPrevious={goToPrevious}
            onNext={goToNext}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}

// Gallery Card Component
interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}

function GalleryCard({ item, onClick }: GalleryCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="relative aspect-square bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      {!imageError ? (
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-800">
          <span className="text-zinc-500">Image not found</span>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-zinc-400 line-clamp-2">
            {item.description}
          </p>
        )}
        {item.category && (
          <span className="inline-block mt-2 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-xs font-medium w-fit">
            {item.category}
          </span>
        )}
      </div>

      {/* Expand Icon */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-2 bg-zinc-900/80 border border-zinc-700 rounded-full">
          <Maximize2 size={16} className="text-zinc-300" />
        </div>
      </div>
    </motion.div>
  );
}

// Lightbox Component
interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

function Lightbox({ items, currentIndex, onClose, onPrevious, onNext }: LightboxProps) {
  const currentItem = items[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-zinc-950/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 p-3 bg-zinc-900 border border-zinc-800 rounded-full hover:border-zinc-600 transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X size={24} className="text-zinc-300" />
      </motion.button>

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-4 p-3 bg-zinc-900 border border-zinc-800 rounded-full hover:border-zinc-600 transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} className="text-zinc-300" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 p-3 bg-zinc-900 border border-zinc-800 rounded-full hover:border-zinc-600 transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight size={24} className="text-zinc-300" />
          </motion.button>
        </>
      )}

      {/* Image Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl max-h-[90vh] w-full"
      >
        {/* Main Image */}
        <div className="relative aspect-video md:aspect-auto md:h-[70vh] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800">
          <Image
            src={currentItem.imageUrl}
            alt={currentItem.title}
            fill
            className="object-contain"
            sizes="(max-width: 1536px) 100vw, 1536px"
            priority
          />
        </div>

        {/* Image Info */}
        <div className="mt-4 bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{currentItem.title}</h2>
              {currentItem.description && (
                <p className="text-zinc-400">{currentItem.description}</p>
              )}
            </div>
            {currentItem.category && (
              <span className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-sm font-medium flex-shrink-0">
                {currentItem.category}
              </span>
            )}
          </div>

          {/* Counter */}
          <div className="mt-4 text-sm text-zinc-500 text-center">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
