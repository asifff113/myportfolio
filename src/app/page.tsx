import React from "react";
import { getAllPublicContent } from "@/lib/content";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import EducationSection from "@/components/sections/EducationSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import CertificatesSection from "@/components/sections/CertificatesSection";
import GallerySection from "@/components/sections/GallerySection";
import HobbiesSection from "@/components/sections/HobbiesSection";
import GoalsSection from "@/components/sections/GoalsSection";
import BlogSection from "@/components/sections/BlogSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Main Portfolio Home Page
 * Fetches all content and renders sections
 */
export default async function HomePage() {
  // Fetch all portfolio content (uses Firebase or falls back to mock data)
  const content = await getAllPublicContent();

  // If no personal info, show a loading state or placeholder
  if (!content.personalInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading portfolio..." />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection personalInfo={content.personalInfo} />

      {/* About Section */}
      <AboutSection personalInfo={content.personalInfo} />

      {/* Skills Section */}
      <SkillsSection 
        skillCategories={content.skillCategories} 
        projects={content.projects}
      />

      {/* Education Section */}
      <EducationSection education={content.education} />

      {/* Experience Section */}
      <ExperienceSection experience={content.experience} />

      {/* Projects Section */}
      <ProjectsSection projects={content.projects} />

      {/* Achievements Section */}
      <AchievementsSection achievements={content.achievements} />

      {/* Certificates Section */}
      <CertificatesSection certificates={content.certificates} />

      {/* Gallery Section */}
      <GallerySection gallery={content.gallery} />

      {/* Hobbies Section */}
      <HobbiesSection hobbies={content.hobbies} />

      {/* Future Goals Section */}
      <GoalsSection goals={content.futureGoals} />

      {/* Blog Section */}
      <BlogSection blogPosts={content.blogPosts} />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={content.testimonials} />

      {/* Contact Section */}
      {content.contactInfo && <ContactSection contactInfo={content.contactInfo} />}
    </div>
  );
}

