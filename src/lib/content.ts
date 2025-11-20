/**
 * Central Content Access Layer
 * Provides a unified interface for fetching portfolio content
 * Fetches from Supabase, falls back to mock data on error
 */

import { getAllPortfolioContent as getSupabaseContent } from "./supabase-queries";
import { mockPortfolioContent } from "./mock-data";
import { PortfolioContent } from "./content-types";

/**
 * Get all portfolio content
 * Fetches from Supabase, falls back to mock data on error
 */
export async function getAllPublicContent(): Promise<PortfolioContent> {
  try {
    // Fetch from Supabase
    const content = await getSupabaseContent();
    
    // Helper to sanitize image URLs
    const sanitizeUrl = (url: string | undefined) => {
      if (!url) return url;
      
      // Map of known missing local files to placeholders
      const urlMap: Record<string, string> = {
        '/images/projects/ecommerce.jpg': 'https://placehold.co/600x400/png?text=E-Commerce',
        '/images/projects/taskmanager.jpg': 'https://placehold.co/600x400/png?text=Task+Manager',
        '/images/projects/weather.jpg': 'https://placehold.co/600x400/png?text=Weather+App',
        '/images/gallery/conference.jpg': 'https://placehold.co/600x400/png?text=Conference',
        '/images/gallery/hackathon.jpg': 'https://placehold.co/600x400/png?text=Hackathon',
        '/images/gallery/workspace.jpg': 'https://placehold.co/600x400/png?text=Workspace',
        '/images/blog/react-scalable.jpg': 'https://placehold.co/800x400/png?text=React+Scalable',
        '/images/blog/typescript-tips.jpg': 'https://placehold.co/800x400/png?text=TypeScript+Tips',
        '/certificates/aws-cert.pdf': '#', // Replace PDF links with hash or valid URL
        '/certificates/meta-cert.pdf': '#',
      };

      if (urlMap[url]) return urlMap[url];
      
      // If it's a local image path that likely doesn't exist, use a generic placeholder
      if (url.startsWith('/images/') && !url.startsWith('/images/placeholder')) {
         // return `https://placehold.co/600x400/png?text=${url.split('/').pop()}`;
      }
      
      return url;
    };

    // Transform to match expected format and sanitize URLs
    return {
      personalInfo: {
        ...content.personalInfo,
        profileImageUrl: sanitizeUrl(content.personalInfo.profileImageUrl) || content.personalInfo.profileImageUrl,
      },
      skillCategories: content.skillCategories,
      education: content.education,
      experience: content.experience,
      projects: content.projects.map((p: any) => ({
        ...p,
        imageUrl: sanitizeUrl(p.imageUrl) || p.imageUrl,
      })),
      achievements: content.achievements,
      certificates: content.certificates.map((c: any) => ({
        ...c,
        imageUrl: sanitizeUrl(c.imageUrl) || c.imageUrl,
      })),
      gallery: content.gallery.map((g: any) => ({
        ...g,
        imageUrl: sanitizeUrl(g.imageUrl) || g.imageUrl,
      })),
      hobbies: content.hobbies,
      futureGoals: content.futureGoals,
      testimonials: content.testimonials.map((t: any) => ({
        ...t,
        imageUrl: sanitizeUrl(t.imageUrl) || t.imageUrl,
      })),
      blogPosts: content.blogPosts.map((b: any) => ({
        ...b,
        coverImage: sanitizeUrl(b.coverImage) || b.coverImage,
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

