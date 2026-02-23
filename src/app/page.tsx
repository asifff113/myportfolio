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
import GuestbookSection from "@/components/sections/GuestbookSection";
import ContactSection from "@/components/sections/ContactSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SectionDivider from "@/components/ui/SectionDivider";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      <SectionDivider />

      {/* About Section */}
      <AboutSection personalInfo={content.personalInfo} />
      <SectionDivider />

      {/* Skills Section */}
      <SkillsSection 
        skillCategories={content.skillCategories} 
        projects={content.projects}
      />
      <SectionDivider />

      {/* Education Section */}
      <EducationSection education={content.education} />
      <SectionDivider />

      {/* Experience Section */}
      <ExperienceSection experience={content.experience} />
      <SectionDivider />

      {/* Projects Section */}
      <ProjectsSection projects={content.projects} />
      <SectionDivider />

      {/* Achievements Section */}
      <AchievementsSection achievements={content.achievements} />
      <SectionDivider />

      {/* Certificates Section */}
      <CertificatesSection certificates={content.certificates} />
      <SectionDivider />

      {/* Gallery Section */}
      <GallerySection gallery={content.gallery} />
      <SectionDivider />

      {/* Hobbies Section */}
      <HobbiesSection hobbies={content.hobbies} />
      <SectionDivider />

      {/* Future Goals Section */}
      <GoalsSection goals={content.futureGoals} />
      <SectionDivider />

      {/* Blog Section */}
      <BlogSection blogPosts={content.blogPosts} />
      <SectionDivider />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={content.testimonials} />
      <SectionDivider />

      {/* Guestbook Section */}
      <GuestbookSection />
      <SectionDivider />

      {/* Contact Section */}
      {content.contactInfo && <ContactSection contactInfo={content.contactInfo} />}
    </div>
  );
}

