/**
 * Firebase Storage Helper Functions
 * Handles file uploads and management
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
  StorageReference,
} from "firebase/storage";
import { storage } from "./firebase";
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
 * Upload a file to Firebase Storage
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
  if (!storage) {
    throw new Error("Firebase Storage is not configured. Please set up Firebase to use file uploads.");
  }
  
  return new Promise((resolve, reject) => {
    try {
      // Generate unique file name
      const fileName = generateFileName(file);
      const fullPath = `${path}/${fileName}`;

      // Create storage reference
      const storageRef: StorageReference = ref(storage, fullPath);

      // Start upload
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor upload progress
      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error("Upload error:", error);
          reject(new Error(`Upload failed: ${error.message}`));
        },
        async () => {
          try {
            // Upload complete, get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const result: UploadResult = {
              url: downloadURL,
              path: fullPath,
              fileName,
              size: file.size,
              contentType: file.type,
            };

            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
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
 * Upload certificate
 */
export async function uploadCertificate(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  // Accept both images and PDFs for certificates
  const isValidType = validateFileType(file, ALLOWED_FILE_TYPES.all);
  if (!isValidType) {
    throw new Error("Invalid file type. Only images and PDF documents are allowed.");
  }

  const maxSize = file.type === "application/pdf" ? MAX_FILE_SIZES.document : MAX_FILE_SIZES.image;
  if (!validateFileSize(file, maxSize)) {
    throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB.`);
  }

  return uploadFile(file, STORAGE_PATHS.certificates, onProgress);
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
 * Upload resume/CV
 */
export async function uploadResume(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  return uploadDocument(file, STORAGE_PATHS.resumes, onProgress);
}

/**
 * Upload blog cover image
 */
export async function uploadBlogImage(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  return uploadImage(file, STORAGE_PATHS.blog, onProgress);
}

/**
 * Delete a file from Firebase Storage
 * 
 * @param filePath - Full storage path to the file
 */
export async function deleteFile(filePath: string): Promise<void> {
  if (!storage) {
    throw new Error("Firebase Storage is not configured.");
  }
  
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file from storage");
  }
}

/**
 * Delete file by URL
 * Extracts the path from Firebase Storage URL and deletes it
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  try {
    // Extract path from Firebase Storage URL
    // Format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?...
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)$/);
    
    if (!pathMatch) {
      throw new Error("Invalid Firebase Storage URL");
    }

    const path = decodeURIComponent(pathMatch[1]);
    await deleteFile(path);
  } catch (error) {
    console.error("Error deleting file by URL:", error);
    throw new Error("Failed to delete file");
  }
}

/**
 * Get file extension from File object
 */
export function getFileExtension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() || "";
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return ALLOWED_FILE_TYPES.images.includes(file.type);
}

/**
 * Check if file is a PDF
 */
export function isPDFFile(file: File): boolean {
  return file.type === "application/pdf";
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

