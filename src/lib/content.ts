/**
 * Central Content Access Layer
 * Provides a unified interface for fetching portfolio content
 * Fetches from Supabase, falls back to mock data on error
 */

import { getAllPortfolioContent as getSupabaseContent } from "./supabase-queries";
import { mockPortfolioContent } from "./mock-data";
import { PortfolioContent } from "./content-types";

// Helper to sanitize image URLs
const sanitizeUrl = (url: string | undefined) => {
  if (!url) return url;
  
  const cleanUrl = url.trim();
  
  // console.log(`Sanitizing URL: ${cleanUrl}`); // Debug log

  // Map of known missing local files to placeholders
  const urlMap: Record<string, string> = {
    '/images/projects/ecommerce.jpg': 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '/images/projects/taskmanager.jpg': 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '/images/projects/weather.jpg': 'https://images.unsplash.com/photo-1592210454132-7a6cd71dfa8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '/images/gallery/conference.jpg': 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '/images/gallery/hackathon.jpg': 'https://images.unsplash.com/photo-1504384308090-c54be3855833?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '/images/gallery/workspace.jpg': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '/images/blog/react-scalable.jpg': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '/images/blog/typescript-tips.jpg': 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    '/images/profile.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    '/certificates/aws-cert.pdf': '', // Empty string to trigger placeholder UI
    '/certificates/meta-cert.pdf': '',
    '/resume.pdf': '', // Hide resume button if file missing
  };

  if (cleanUrl in urlMap) {
    // console.log(`Mapped ${cleanUrl} to ${urlMap[cleanUrl]}`);
    return urlMap[cleanUrl];
  }
  
  // If it's a local image path that likely doesn't exist, use a generic placeholder
  if (cleanUrl.startsWith('/images/') && !cleanUrl.startsWith('/images/placeholder')) {
      // Return a random tech-related image from Unsplash based on the filename hash or just a generic one
      return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  }
  
  return cleanUrl;
};

/**
 * Get all portfolio content
 * Fetches from Supabase, falls back to mock data on error
 */
export async function getAllPublicContent(): Promise<PortfolioContent> {
  try {
    // Fetch from Supabase
    const content = await getSupabaseContent();
    
    // Transform to match expected format and sanitize URLs
    return {
      personalInfo: {
        ...content.personalInfo,
        profileImageUrl: sanitizeUrl(content.personalInfo.profileImageUrl),
      },
      skillCategories: content.skillCategories,
      education: content.education,
      experience: content.experience,
      projects: content.projects.map((p: any) => ({
        ...p,
        imageUrl: sanitizeUrl(p.imageUrl),
      })),
      achievements: content.achievements,
      certificates: content.certificates.map((c: any) => ({
        ...c,
        previewImageUrl: sanitizeUrl(c.previewImageUrl),
        fileUrl: sanitizeUrl(c.fileUrl),
        credentialUrl: sanitizeUrl(c.credentialUrl),
      })),
      gallery: content.gallery.map((g: any) => ({
        ...g,
        imageUrl: sanitizeUrl(g.imageUrl),
      })),
      hobbies: content.hobbies,
      futureGoals: content.futureGoals,
      testimonials: content.testimonials.map((t: any) => ({
        ...t,
        avatarUrl: sanitizeUrl(t.avatarUrl),
      })),
      blogPosts: content.blogPosts.map((b: any) => ({
        ...b,
        coverImageUrl: sanitizeUrl(b.coverImageUrl),
      })),
      contactInfo: content.contactInfo,
    };
  } catch (error) {
    console.error("Error fetching portfolio content from Supabase:", error);
    console.warn("⚠️ Falling back to mock data due to error");
    // Fall back to mock data on error
    return mockPortfolioContent;
  }
}

/**
 * Get content with caching for better performance
 * Useful for static site generation
 */
let cachedContent: PortfolioContent | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedContent(forceRefresh = false): Promise<PortfolioContent> {
  const now = Date.now();
  
  if (!forceRefresh && cachedContent && now - cacheTimestamp < CACHE_DURATION) {
    return cachedContent;
  }

  cachedContent = await getAllPublicContent();
  cacheTimestamp = now;
  
  return cachedContent;
}

/**
 * Clear content cache
 */
export function clearContentCache(): void {
  cachedContent = null;
  cacheTimestamp = 0;
}

/**
 * Check if using mock data
 * Always returns false since we're using Supabase
 */
export function isUsingMockData(): boolean {
  return false;
}

