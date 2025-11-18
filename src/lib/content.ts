/**
 * Central Content Access Layer
 * Provides a unified interface for fetching portfolio content
 * Fetches from Supabase, falls back to mock data on error
 */

import { getAllPortfolioContent as getSupabaseContent } from "./firebase-queries";
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
    
    // Transform to match expected format
    return {
      personalInfo: content.personalInfo,
      skillCategories: content.skills,
      education: content.education,
      experience: content.experience,
      projects: content.projects,
      achievements: content.achievements,
      certificates: content.certificates,
      gallery: content.gallery,
      hobbies: content.hobbies,
      futureGoals: content.futureGoals,
      testimonials: content.testimonials,
      blogPosts: content.blogPosts,
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

