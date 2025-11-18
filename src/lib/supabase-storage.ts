/**
 * Supabase Storage Helper Functions
 * Handles file uploads and management
 */

import { supabase } from "./supabase";
import { UploadResult } from "./content-types";

/**
 * Upload progress callback type
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * Allowed file types for different upload categories
 */
export const ALLOWED_FILE_TYPES = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
  documents: ["application/pdf"],
  all: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "application/pdf"],
};

/**
 * Maximum file sizes (in bytes)
 */
export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
};

/**
 * Storage paths for different content types
 */
export const STORAGE_PATHS = {
  profile: "profile",
  projects: "projects",
  certificates: "certificates",
  gallery: "gallery",
  blog: "blog",
  resumes: "resumes",
  achievements: "achievements",
  testimonials: "testimonials",
};

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * Generate a unique file name
 */
export function generateFileName(file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split(".").pop();
  const baseName = file.name.split(".").slice(0, -1).join(".");
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
  return `${sanitizedBaseName}_${timestamp}_${randomString}.${extension}`;
}

/**
 * Upload a file to Supabase Storage
 * 
 * @param file - File to upload
 * @param path - Storage path (e.g., 'projects', 'certificates')
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Promise with download URL and file metadata
 */
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  try {
    // Generate unique file name
    const fileName = generateFileName(file);
    const fullPath = `${path}/${fileName}`;

    // Simulate progress for small files (Supabase doesn't have built-in progress)
    if (onProgress) {
      onProgress(10);
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('portfolio')
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    if (onProgress) {
      onProgress(90);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(fullPath);

    if (onProgress) {
      onProgress(100);
    }

    const result: UploadResult = {
      url: publicUrl,
      path: fullPath,
      fileName,
      size: file.size,
      contentType: file.type,
    };

    return result;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

/**
 * Upload an image file
 */
export async function uploadImage(
  file: File,
  path: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  // Validate file type
  if (!validateFileType(file, ALLOWED_FILE_TYPES.images)) {
    throw new Error("Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP).");
  }

  // Validate file size
  if (!validateFileSize(file, MAX_FILE_SIZES.image)) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZES.image / (1024 * 1024)}MB.`);
  }

  return uploadFile(file, path, onProgress);
}

/**
 * Upload a PDF document
 */
export async function uploadDocument(
  file: File,
  path: string,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  // Validate file type
  if (!validateFileType(file, ALLOWED_FILE_TYPES.documents)) {
    throw new Error("Invalid file type. Only PDF documents are allowed.");
  }

  // Validate file size
  if (!validateFileSize(file, MAX_FILE_SIZES.document)) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZES.document / (1024 * 1024)}MB.`);
  }

  return uploadFile(file, path, onProgress);
}

/**
 * Upload profile image
 */
export async function uploadProfileImage(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  return uploadImage(file, STORAGE_PATHS.profile, onProgress);
}

/**
 * Upload project image
 */
export async function uploadProjectImage(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  return uploadImage(file, STORAGE_PATHS.projects, onProgress);
}

/**
 * Upload certificate image
 */
export async function uploadCertificateImage(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  return uploadImage(file, STORAGE_PATHS.certificates, onProgress);
}

/**
 * Upload gallery image
 */
export async function uploadGalleryImage(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  return uploadImage(file, STORAGE_PATHS.gallery, onProgress);
}

/**
 * Upload blog image
 */
export async function uploadBlogImage(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  return uploadImage(file, STORAGE_PATHS.blog, onProgress);
}

/**
 * Upload resume/CV
 */
export async function uploadResume(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  return uploadDocument(file, STORAGE_PATHS.resumes, onProgress);
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('portfolio')
      .remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from('portfolio')
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * List files in a directory
 */
export async function listFiles(path: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.storage
      .from('portfolio')
      .list(path);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("List files error:", error);
    return [];
  }
}
