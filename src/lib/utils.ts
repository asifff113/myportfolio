import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a readable format
 */
export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "N/A";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  // Check if date is valid
  if (!d || isNaN(d.getTime())) {
    return "N/A";
  }
  
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date range for display (e.g., "Jan 2020 - Present")
 */
export function formatDateRange(
  startDate: string | Date | undefined | null,
  endDate?: string | Date | null,
  isCurrent?: boolean
): string {
  if (!startDate) return "Present";
  
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  
  // Check if date is valid
  if (!start || isNaN(start.getTime())) {
    return "Present";
  }
  
  const startFormatted = start.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  if (isCurrent) {
    return `${startFormatted} - Present`;
  }

  if (!endDate) {
    return startFormatted;
  }

  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  
  // Check if end date is valid
  if (!end || isNaN(end.getTime())) {
    return startFormatted;
  }
  
  const endFormatted = end.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

