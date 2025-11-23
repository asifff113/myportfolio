/**
 * Central TypeScript interfaces for all portfolio content
 * These types ensure strong typing across the public site and admin dashboard
 */

// ============================================================================
// PERSONAL INFORMATION
// ============================================================================

/**
 * Social media link
 */
export interface SocialLink {
  platform: string; // e.g., "GitHub", "LinkedIn", "Twitter", "Email"
  url: string;
  icon?: string; // Optional icon name or component reference
  username?: string; // Optional display username
}

/**
 * Main personal information (singleton - one document in Firestore)
 */
export interface PersonalInfo {
  id?: string; // Firestore document ID
  name: string;
  headline: string; // e.g., "Full Stack Developer & Creative Problem Solver"
  shortBio: string; // Brief intro for hero section (2-3 sentences)
  longBio: string; // Detailed bio for About section (multiple paragraphs)
  profileImageUrl: string; // URL to profile photo
  resumeUrl?: string; // URL to downloadable CV/resume (PDF)
  location: string; // e.g., "San Francisco, CA"
  email: string;
  phone?: string;
  currentStatus?: string; // e.g., "Open to opportunities", "Freelancing", "Employed"
  socialLinks: SocialLink[];
  updatedAt?: Date | string;
}

// ============================================================================
// SKILLS
// ============================================================================

/**
 * Individual skill
 */
export interface Skill {
  id?: string;
  name: string;
  level?: number; // 0-100 for progress bar visualization
  yearsOfExperience?: number;
  description?: string;
  icon?: string; // Icon name or URL (e.g., "react", "nextjs", or URL to logo)
  isPrimary?: boolean; // Flag for core/daily-use skills
  projectIds?: string[]; // IDs of projects that use this skill
}

/**
 * Category of skills (e.g., "Frontend", "Backend", "Tools", "Soft Skills")
 */
export interface SkillCategory {
  id?: string;
  name: string;
  description?: string;
  skills: Skill[];
  order?: number; // For sorting categories
  color?: string; // Optional accent color for this category
}

// ============================================================================
// EDUCATION
// ============================================================================

/**
 * Education item (degree, certification, course, etc.)
 */
export interface EducationItem {
  id?: string;
  institution: string; // School/university name
  degree: string; // e.g., "Bachelor of Science", "High School Diploma"
  field?: string; // e.g., "Computer Science", "Software Engineering"
  startDate?: Date | string;
  endDate?: Date | string | null; // Null if currently enrolled
  isCurrent?: boolean;
  description?: string; // Additional details, coursework, achievements
  grade?: string; // GPA, percentage, or grade (e.g., "3.8 GPA", "First Class")
  location?: string;
  logoUrl?: string; // Institution logo
  order?: number;
}

// ============================================================================
// EXPERIENCE
// ============================================================================

/**
 * Work experience item
 */
export interface ExperienceItem {
  id?: string;
  role: string; // Job title
  company: string;
  companyUrl?: string; // Link to company website
  location: string; // e.g., "Remote", "New York, NY"
  startDate: Date | string;
  endDate?: Date | string | null; // Null if current position
  isCurrent?: boolean;
  description: string; // Responsibilities and achievements (can be markdown)
  technologies: string[]; // Tech stack used in this role
  type?: string; // e.g., "Full-time", "Part-time", "Internship", "Freelance"
  logoUrl?: string; // Company logo
  order?: number;
}

// ============================================================================
// PROJECTS
// ============================================================================

/**
 * Project showcase item
 */
export interface Project {
  id?: string;
  title: string;
  slug: string; // URL-friendly identifier
  summary: string; // Short description (1-2 sentences)
  description: string; // Detailed description (can be markdown)
  imageUrl: string; // Project screenshot or banner
  techStack: string[]; // Technologies used
  githubUrl?: string; // Link to GitHub repo
  liveUrl?: string; // Link to live demo/deployment
  featured?: boolean; // Highlight on home page
  startDate?: Date | string;
  endDate?: Date | string;
  category?: string; // e.g., "Web App", "Mobile App", "Library"
  type?: string; // e.g., "Personal", "Professional", "Freelance"
  status?: string; // e.g., "Completed", "In Progress", "Maintained"
  order?: number;

  // Deep Dive Fields
  problem?: string;
  solution?: string;
  challenges?: string;
  stackDetails?: { name: string; usage: string }[];
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

/**
 * Achievement or award
 */
export interface Achievement {
  id?: string;
  title: string;
  organization: string; // Who gave the award/recognition
  date: Date | string; // When it was received
  description?: string; // Additional details
  category?: string; // e.g., "Competition", "Recognition", "Award"
  iconUrl?: string; // Badge or icon
  certificateUrl?: string; // Link to certificate if available
  fileUrl?: string; // URL to uploaded image or PDF file
  fileType?: 'image' | 'pdf'; // Type of the uploaded file
  order?: number;
}

// ============================================================================
// CERTIFICATES
// ============================================================================

/**
 * Professional certificate or credential
 */
export interface Certificate {
  id?: string;
  title: string;
  issuer: string; // Organization that issued the certificate
  issuedDate: Date | string;
  expiryDate?: Date | string | null; // Null if doesn't expire
  fileUrl: string; // URL to PDF or image file
  previewImageUrl?: string; // Thumbnail for display
  credentialId?: string; // Certificate ID or verification code
  credentialUrl?: string; // Link to verify credential online
  description?: string;
  skills?: string[]; // Skills covered by this certificate
  order?: number;
}

// ============================================================================
// GALLERY
// ============================================================================

/**
 * Gallery image item (photos, event pictures, etc.)
 */
export interface GalleryItem {
  id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string; // e.g., "Events", "Travel", "Work", "Personal"
  date?: Date | string;
  order?: number;
}

// ============================================================================
// HOBBIES & INTERESTS
// ============================================================================

/**
 * Hobby or personal interest
 */
export interface Hobby {
  id?: string;
  title: string;
  description: string;
  icon?: string; // Icon name or emoji
  imageUrl?: string; // Optional image
  order?: number;
}

// ============================================================================
// FUTURE GOALS
// ============================================================================

/**
 * Future goal or aspiration
 */
export interface FutureGoal {
  id?: string;
  title: string;
  description: string;
  targetDate?: string;
  category?: string;
  status?: string;
  order?: number;
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

/**
 * Testimonial or recommendation
 */
export interface Testimonial {
  id?: string;
  name: string; // Person giving testimonial
  role: string; // Their position/relationship (e.g., "Manager at XYZ Corp")
  company?: string;
  avatarUrl?: string;
  quote: string; // The testimonial text
  rating?: number; // Optional 1-5 star rating
  date?: Date | string;
  linkedInUrl?: string; // Link to their LinkedIn profile
  order?: number;
}

// ============================================================================
// BLOG POSTS
// ============================================================================

/**
 * Blog post (optional feature)
 */
export interface BlogPost {
  id?: string;
  title: string;
  slug: string; // URL-friendly identifier
  excerpt: string; // Short summary
  content: string; // Full post content (markdown or HTML)
  coverImageUrl?: string;
  author?: string; // Usually your name, but flexible
  publishedDate: Date | string;
  updatedDate?: Date | string;
  tags?: string[]; // Topics/categories
  readTime?: number; // Estimated reading time in minutes
  published?: boolean; // Draft vs published status
  views?: number; // Optional view counter
  order?: number;
}

// ============================================================================
// CONTACT INFO
// ============================================================================

/**
 * Contact information and form settings
 */
export interface ContactInfo {
  id?: string;
  email: string;
  phone?: string;
  location: string;
  availability?: string; // e.g., "Available for freelance", "Open to opportunities"
  preferredContactMethod?: string; // e.g., "Email", "LinkedIn"
  responseTime?: string; // e.g., "Within 24 hours"
  socialLinks: SocialLink[];
  // Form configuration
  enableContactForm?: boolean;
  formSubmitEndpoint?: string; // API endpoint for form submissions
  formSuccessMessage?: string;
  formErrorMessage?: string;
}

// ============================================================================
// GUESTBOOK
// ============================================================================

export interface GuestbookMessage {
  id: string;
  user_id?: string;
  user_name: string;
  user_avatar?: string;
  message: string;
  created_at: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Complete portfolio content structure
 * Used for fetching all data at once
 */
export interface PortfolioContent {
  personalInfo?: PersonalInfo;
  skillCategories: SkillCategory[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: Project[];
  achievements: Achievement[];
  certificates: Certificate[];
  gallery: GalleryItem[];
  hobbies: Hobby[];
  futureGoals: FutureGoal[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  contactInfo?: ContactInfo;
}

/**
 * Base document metadata
 */
export interface BaseMetadata {
  createdAt: Date | string;
  updatedAt: Date | string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Generic response type for API calls
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * File upload result
 */
export interface UploadResult {
  url: string;
  path: string;
  fileName: string;
  size: number;
  contentType: string;
}

/**
 * Contact form submission data
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: Date | string;
}

