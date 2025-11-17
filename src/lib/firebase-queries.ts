/**
 * Firestore Query Helper Functions
 * Provides CRUD operations for all portfolio content
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  PersonalInfo,
  SkillCategory,
  EducationItem,
  ExperienceItem,
  Project,
  Achievement,
  Certificate,
  GalleryItem,
  Hobby,
  FutureGoal,
  Testimonial,
  BlogPost,
  ContactInfo,
  PortfolioContent,
} from "./content-types";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert Firestore Timestamps to ISO strings
 */
function convertTimestamps(data: DocumentData): DocumentData {
  const converted: DocumentData = { ...data };
  
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate().toISOString();
    }
    // Handle nested objects
    if (converted[key] && typeof converted[key] === "object" && !Array.isArray(converted[key])) {
      converted[key] = convertTimestamps(converted[key]);
    }
    // Handle arrays of objects
    if (Array.isArray(converted[key])) {
      converted[key] = converted[key].map((item: unknown) =>
        typeof item === "object" && item !== null ? convertTimestamps(item as DocumentData) : item
      );
    }
  });
  
  return converted;
}

/**
 * Generic function to get a single document
 */
async function getDocument<T>(collectionName: string, documentId: string): Promise<T | null> {
  if (!db) {
    console.warn("⚠️ Firestore not initialized");
    return null;
  }
  
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = convertTimestamps(docSnap.data());
      return { id: docSnap.id, ...data } as T;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching document from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Generic function to get all documents from a collection
 */
async function getCollection<T>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<T[]> {
  if (!db) {
    console.warn("⚠️ Firestore not initialized");
    return [];
  }
  
  try {
    const collectionRef = collection(db, collectionName);
    const q = queryConstraints.length > 0 ? query(collectionRef, ...queryConstraints) : collectionRef;
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = convertTimestamps(doc.data());
      return { id: doc.id, ...data } as T;
    });
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Generic function to create a document
 */
async function createDocument<T extends { id?: string }>(
  collectionName: string,
  data: Omit<T, "id">
): Promise<string> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }
  
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Generic function to update a document
 */
async function updateDocument<T>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Generic function to set a document (create or overwrite)
 */
async function setDocument<T>(
  collectionName: string,
  documentId: string,
  data: Omit<T, "id">
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Generic function to delete a document
 */
async function deleteDocument(collectionName: string, documentId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

// ============================================================================
// PERSONAL INFO
// ============================================================================

export async function getPersonalInfo(): Promise<PersonalInfo | null> {
  return getDocument<PersonalInfo>("personalInfo", "main");
}

export async function updatePersonalInfo(data: Omit<PersonalInfo, "id">): Promise<void> {
  return setDocument<PersonalInfo>("personalInfo", "main", data);
}

// ============================================================================
// SKILLS
// ============================================================================

export async function getSkillCategories(): Promise<SkillCategory[]> {
  return getCollection<SkillCategory>("skillCategories", orderBy("order", "asc"));
}

export async function createSkillCategory(data: Omit<SkillCategory, "id">): Promise<string> {
  return createDocument<SkillCategory>("skillCategories", data);
}

export async function updateSkillCategory(id: string, data: Partial<SkillCategory>): Promise<void> {
  return updateDocument<SkillCategory>("skillCategories", id, data);
}

export async function deleteSkillCategory(id: string): Promise<void> {
  return deleteDocument("skillCategories", id);
}

// ============================================================================
// EDUCATION
// ============================================================================

export async function getEducation(): Promise<EducationItem[]> {
  return getCollection<EducationItem>("education", orderBy("order", "asc"));
}

export async function createEducationItem(data: Omit<EducationItem, "id">): Promise<string> {
  return createDocument<EducationItem>("education", data);
}

export async function updateEducationItem(id: string, data: Partial<EducationItem>): Promise<void> {
  return updateDocument<EducationItem>("education", id, data);
}

export async function deleteEducationItem(id: string): Promise<void> {
  return deleteDocument("education", id);
}

// ============================================================================
// EXPERIENCE
// ============================================================================

export async function getExperience(): Promise<ExperienceItem[]> {
  return getCollection<ExperienceItem>("experience", orderBy("order", "asc"));
}

export async function createExperienceItem(data: Omit<ExperienceItem, "id">): Promise<string> {
  return createDocument<ExperienceItem>("experience", data);
}

export async function updateExperienceItem(id: string, data: Partial<ExperienceItem>): Promise<void> {
  return updateDocument<ExperienceItem>("experience", id, data);
}

export async function deleteExperienceItem(id: string): Promise<void> {
  return deleteDocument("experience", id);
}

// ============================================================================
// PROJECTS
// ============================================================================

export async function getProjects(): Promise<Project[]> {
  return getCollection<Project>("projects", orderBy("order", "asc"));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return getCollection<Project>("projects", where("featured", "==", true), orderBy("order", "asc"));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getCollection<Project>("projects", where("slug", "==", slug));
  return projects.length > 0 ? projects[0] : null;
}

export async function createProject(data: Omit<Project, "id">): Promise<string> {
  return createDocument<Project>("projects", data);
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  return updateDocument<Project>("projects", id, data);
}

export async function deleteProject(id: string): Promise<void> {
  return deleteDocument("projects", id);
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export async function getAchievements(): Promise<Achievement[]> {
  return getCollection<Achievement>("achievements", orderBy("order", "asc"));
}

export async function createAchievement(data: Omit<Achievement, "id">): Promise<string> {
  return createDocument<Achievement>("achievements", data);
}

export async function updateAchievement(id: string, data: Partial<Achievement>): Promise<void> {
  return updateDocument<Achievement>("achievements", id, data);
}

export async function deleteAchievement(id: string): Promise<void> {
  return deleteDocument("achievements", id);
}

// ============================================================================
// CERTIFICATES
// ============================================================================

export async function getCertificates(): Promise<Certificate[]> {
  return getCollection<Certificate>("certificates", orderBy("order", "asc"));
}

export async function createCertificate(data: Omit<Certificate, "id">): Promise<string> {
  return createDocument<Certificate>("certificates", data);
}

export async function updateCertificate(id: string, data: Partial<Certificate>): Promise<void> {
  return updateDocument<Certificate>("certificates", id, data);
}

export async function deleteCertificate(id: string): Promise<void> {
  return deleteDocument("certificates", id);
}

// ============================================================================
// GALLERY
// ============================================================================

export async function getGallery(): Promise<GalleryItem[]> {
  return getCollection<GalleryItem>("gallery", orderBy("order", "asc"));
}

export async function createGalleryItem(data: Omit<GalleryItem, "id">): Promise<string> {
  return createDocument<GalleryItem>("gallery", data);
}

export async function updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<void> {
  return updateDocument<GalleryItem>("gallery", id, data);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  return deleteDocument("gallery", id);
}

// ============================================================================
// HOBBIES
// ============================================================================

export async function getHobbies(): Promise<Hobby[]> {
  return getCollection<Hobby>("hobbies", orderBy("order", "asc"));
}

export async function createHobby(data: Omit<Hobby, "id">): Promise<string> {
  return createDocument<Hobby>("hobbies", data);
}

export async function updateHobby(id: string, data: Partial<Hobby>): Promise<void> {
  return updateDocument<Hobby>("hobbies", id, data);
}

export async function deleteHobby(id: string): Promise<void> {
  return deleteDocument("hobbies", id);
}

// ============================================================================
// FUTURE GOALS
// ============================================================================

export async function getFutureGoals(): Promise<FutureGoal[]> {
  return getCollection<FutureGoal>("futureGoals", orderBy("order", "asc"));
}

export async function createFutureGoal(data: Omit<FutureGoal, "id">): Promise<string> {
  return createDocument<FutureGoal>("futureGoals", data);
}

export async function updateFutureGoal(id: string, data: Partial<FutureGoal>): Promise<void> {
  return updateDocument<FutureGoal>("futureGoals", id, data);
}

export async function deleteFutureGoal(id: string): Promise<void> {
  return deleteDocument("futureGoals", id);
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

export async function getTestimonials(): Promise<Testimonial[]> {
  return getCollection<Testimonial>("testimonials", orderBy("order", "asc"));
}

export async function createTestimonial(data: Omit<Testimonial, "id">): Promise<string> {
  return createDocument<Testimonial>("testimonials", data);
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<void> {
  return updateDocument<Testimonial>("testimonials", id, data);
}

export async function deleteTestimonial(id: string): Promise<void> {
  return deleteDocument("testimonials", id);
}

// ============================================================================
// BLOG POSTS
// ============================================================================

export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  if (publishedOnly) {
    return getCollection<BlogPost>(
      "blogPosts",
      where("published", "==", true),
      orderBy("publishedDate", "desc")
    );
  }
  return getCollection<BlogPost>("blogPosts", orderBy("publishedDate", "desc"));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getCollection<BlogPost>("blogPosts", where("slug", "==", slug));
  return posts.length > 0 ? posts[0] : null;
}

export async function createBlogPost(data: Omit<BlogPost, "id">): Promise<string> {
  return createDocument<BlogPost>("blogPosts", data);
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<void> {
  return updateDocument<BlogPost>("blogPosts", id, data);
}

export async function deleteBlogPost(id: string): Promise<void> {
  return deleteDocument("blogPosts", id);
}

// ============================================================================
// CONTACT INFO
// ============================================================================

export async function getContactInfo(): Promise<ContactInfo | null> {
  return getDocument<ContactInfo>("contactInfo", "main");
}

export async function updateContactInfo(data: Omit<ContactInfo, "id">): Promise<void> {
  return setDocument<ContactInfo>("contactInfo", "main", data);
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Fetch all portfolio content at once
 * Useful for SSR/SSG pages
 */
export async function getAllPortfolioContent(): Promise<PortfolioContent> {
  try {
    const [
      personalInfo,
      skillCategories,
      education,
      experience,
      projects,
      achievements,
      certificates,
      gallery,
      hobbies,
      futureGoals,
      testimonials,
      blogPosts,
      contactInfo,
    ] = await Promise.all([
      getPersonalInfo(),
      getSkillCategories(),
      getEducation(),
      getExperience(),
      getProjects(),
      getAchievements(),
      getCertificates(),
      getGallery(),
      getHobbies(),
      getFutureGoals(),
      getTestimonials(),
      getBlogPosts(),
      getContactInfo(),
    ]);

    return {
      personalInfo: personalInfo || undefined,
      skillCategories,
      education,
      experience,
      projects,
      achievements,
      certificates,
      gallery,
      hobbies,
      futureGoals,
      testimonials,
      blogPosts,
      contactInfo: contactInfo || undefined,
    };
  } catch (error) {
    console.error("Error fetching all portfolio content:", error);
    throw error;
  }
}

