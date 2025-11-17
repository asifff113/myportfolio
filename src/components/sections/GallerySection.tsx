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
  const categories = ["All", ...Array.from(new Set(gallery.map((item) => item.category).filter(Boolean)))];

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
    <Section id="gallery" className="bg-muted/20">
      <SectionTitle
        title="Gallery"
        subtitle="Moments and memories captured along the way"
      />

      {/* Category Filters */}
      {categories.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, idx) => {
            const catColors = [
              "from-blue-500 to-cyan-500",
              "from-purple-500 to-pink-500",
              "from-green-500 to-emerald-500",
              "from-orange-500 to-amber-500",
              "from-red-500 to-pink-500",
            ];
            const catColor = catColors[idx % catColors.length];
            
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 rounded-full font-bold transition-all ripple relative overflow-hidden ${
                  filter === category
                    ? `bg-gradient-to-r ${catColor} text-white shadow-lg border-2 border-white/30`
                    : "glass-ultra hover:bg-primary/20 border-2 border-transparent hover:border-white/20"
                }`}
              >
                <span className="relative z-10">{category}</span>
                {filter === category && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
              </motion.button>
            );
          })}
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
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className="relative aspect-square glass-ultra rounded-2xl overflow-hidden cursor-pointer group card-3d"
    >
      {/* Image */}
      {!imageError ? (
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-animated">
          <span className="text-muted-foreground">Image not found</span>
        </div>
      )}
      
      {/* Animated overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-secondary/0 group-hover:from-primary/20 group-hover:via-accent/10 group-hover:to-secondary/20 transition-all duration-500" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-lg font-bold mb-1">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
        {item.category && (
          <span className="inline-block mt-2 px-3 py-1 glass rounded-full text-xs font-medium w-fit">
            {item.category}
          </span>
        )}
      </div>

      {/* Expand Icon */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <motion.div 
          whileHover={{ scale: 1.2, rotate: 10 }}
          className="p-2 glass-ultra rounded-full neon-glow-hover"
        >
          <Maximize2 size={18} />
        </motion.div>
      </motion.div>
      
      {/* Enhanced hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl">
        <div className="absolute inset-0 neon-glow" />
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
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 p-3 glass rounded-full hover:bg-primary/20 transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X size={24} />
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
            className="absolute left-4 p-3 glass rounded-full hover:bg-primary/20 transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 p-3 glass rounded-full hover:bg-primary/20 transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
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
        <div className="relative aspect-video md:aspect-auto md:h-[70vh] rounded-xl overflow-hidden glass">
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
        <div className="mt-4 glass p-6 rounded-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentItem.title}</h2>
              {currentItem.description && (
                <p className="text-muted-foreground">{currentItem.description}</p>
              )}
            </div>
            {currentItem.category && (
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium flex-shrink-0">
                {currentItem.category}
              </span>
            )}
          </div>

          {/* Counter */}
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

