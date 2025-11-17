/**
 * Central Content Access Layer
 * Provides a unified interface for fetching portfolio content
 * Falls back to mock data when Firebase is not configured
 */

import { isFirebaseConfigured } from "./firebase";
import { getAllPortfolioContent as getFirebaseContent } from "./firebase-queries";
import { mockPortfolioContent } from "./mock-data";
import { PortfolioContent } from "./content-types";

/**
 * Get all portfolio content
 * Uses Firebase if configured, otherwise falls back to mock data
 */
export async function getAllPublicContent(): Promise<PortfolioContent> {
  try {
    // Check if Firebase is properly configured
    if (!isFirebaseConfigured) {
      console.warn("⚠️ Firebase not configured, using mock data");
      return mockPortfolioContent;
    }

    // Fetch from Firebase
    const content = await getFirebaseContent();
    return content;
  } catch (error) {
    console.error("Error fetching portfolio content:", error);
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
 */
export function isUsingMockData(): boolean {
  return !isFirebaseConfigured;
}

