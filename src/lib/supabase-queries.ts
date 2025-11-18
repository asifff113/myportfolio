/**
 * Supabase Query Helper Functions
 * Provides CRUD operations for all portfolio content
 */

import { supabase } from "./supabase";
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
} from "./content-types";

// ============================================================================
// PERSONAL INFO
// ============================================================================

export async function getPersonalInfo(): Promise<PersonalInfo | null> {
  try {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .single();
    
    if (error) throw error;
    return data as PersonalInfo;
  } catch (error) {
    console.error("Error fetching personal info:", error);
    return null;
  }
}

export async function updatePersonalInfo(data: Omit<PersonalInfo, "id">): Promise<void> {
  try {
    const { error } = await supabase
      .from('personal_info')
      .upsert({
        ...data,
        updated_at: new Date().toISOString(),
      });
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating personal info:", error);
    throw error;
  }
}

// ============================================================================
// SKILLS
// ============================================================================

export async function getSkillCategories(): Promise<SkillCategory[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as SkillCategory[];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function createSkillCategory(data: Omit<SkillCategory, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('skills')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating skill:", error);
    throw error;
  }
}

export async function updateSkillCategory(id: string, data: Partial<SkillCategory>): Promise<void> {
  try {
    const { error } = await supabase
      .from('skills')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating skill:", error);
    throw error;
  }
}

export async function deleteSkillCategory(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
}

// ============================================================================
// EDUCATION
// ============================================================================

export async function getEducation(): Promise<EducationItem[]> {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as EducationItem[];
  } catch (error) {
    console.error("Error fetching education:", error);
    return [];
  }
}

export async function createEducationItem(data: Omit<EducationItem, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('education')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating education:", error);
    throw error;
  }
}

export async function updateEducationItem(id: string, data: Partial<EducationItem>): Promise<void> {
  try {
    const { error } = await supabase
      .from('education')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating education:", error);
    throw error;
  }
}

export async function deleteEducationItem(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting education:", error);
    throw error;
  }
}

// ============================================================================
// EXPERIENCE
// ============================================================================

export async function getExperience(): Promise<ExperienceItem[]> {
  try {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as ExperienceItem[];
  } catch (error) {
    console.error("Error fetching experience:", error);
    return [];
  }
}

export async function createExperienceItem(data: Omit<ExperienceItem, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('experience')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating experience:", error);
    throw error;
  }
}

export async function updateExperienceItem(id: string, data: Partial<ExperienceItem>): Promise<void> {
  try {
    const { error } = await supabase
      .from('experience')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
}

export async function deleteExperienceItem(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
}

// ============================================================================
// PROJECTS
// ============================================================================

export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function createProject(data: Omit<Project, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('projects')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  try {
    const { error } = await supabase
      .from('projects')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Achievement[];
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
}

export async function createAchievement(data: Omit<Achievement, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('achievements')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating achievement:", error);
    throw error;
  }
}

export async function updateAchievement(id: string, data: Partial<Achievement>): Promise<void> {
  try {
    const { error } = await supabase
      .from('achievements')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating achievement:", error);
    throw error;
  }
}

export async function deleteAchievement(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting achievement:", error);
    throw error;
  }
}

// ============================================================================
// CERTIFICATES
// ============================================================================

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Certificate[];
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}

export async function createCertificate(data: Omit<Certificate, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('certificates')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating certificate:", error);
    throw error;
  }
}

export async function updateCertificate(id: string, data: Partial<Certificate>): Promise<void> {
  try {
    const { error } = await supabase
      .from('certificates')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating certificate:", error);
    throw error;
  }
}

export async function deleteCertificate(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting certificate:", error);
    throw error;
  }
}

// ============================================================================
// GALLERY
// ============================================================================

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as GalleryItem[];
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }
}

export async function createGalleryItem(data: Omit<GalleryItem, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('gallery')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating gallery item:", error);
    throw error;
  }
}

export async function updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<void> {
  try {
    const { error } = await supabase
      .from('gallery')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating gallery item:", error);
    throw error;
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    throw error;
  }
}

// ============================================================================
// HOBBIES
// ============================================================================

export async function getHobbies(): Promise<Hobby[]> {
  try {
    const { data, error } = await supabase
      .from('hobbies')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Hobby[];
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    return [];
  }
}

export async function createHobby(data: Omit<Hobby, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('hobbies')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating hobby:", error);
    throw error;
  }
}

export async function updateHobby(id: string, data: Partial<Hobby>): Promise<void> {
  try {
    const { error } = await supabase
      .from('hobbies')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating hobby:", error);
    throw error;
  }
}

export async function deleteHobby(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('hobbies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting hobby:", error);
    throw error;
  }
}

// ============================================================================
// FUTURE GOALS
// ============================================================================

export async function getFutureGoals(): Promise<FutureGoal[]> {
  try {
    const { data, error } = await supabase
      .from('future_goals')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as FutureGoal[];
  } catch (error) {
    console.error("Error fetching future goals:", error);
    return [];
  }
}

export async function createFutureGoal(data: Omit<FutureGoal, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('future_goals')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating future goal:", error);
    throw error;
  }
}

export async function updateFutureGoal(id: string, data: Partial<FutureGoal>): Promise<void> {
  try {
    const { error } = await supabase
      .from('future_goals')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating future goal:", error);
    throw error;
  }
}

export async function deleteFutureGoal(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('future_goals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting future goal:", error);
    throw error;
  }
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as Testimonial[];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function createTestimonial(data: Omit<Testimonial, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('testimonials')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw error;
  }
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<void> {
  try {
    const { error } = await supabase
      .from('testimonials')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
}

// ============================================================================
// BLOG POSTS
// ============================================================================

export async function getBlogPosts(publishedOnly: boolean = false): Promise<BlogPost[]> {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (publishedOnly) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data as BlogPost;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function createBlogPost(data: Omit<BlogPost, "id">): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('blog_posts')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<void> {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
}

// ============================================================================
// CONTACT INFO
// ============================================================================

export async function getContactInfo(): Promise<ContactInfo | null> {
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single();
    
    if (error) throw error;
    return data as ContactInfo;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return null;
  }
}

export async function updateContactInfo(data: Omit<ContactInfo, "id">): Promise<void> {
  try {
    const { error } = await supabase
      .from('contact_info')
      .upsert({
        ...data,
        updated_at: new Date().toISOString(),
      });
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating contact info:", error);
    throw error;
  }
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

export async function getAllPortfolioContent(): Promise<any> {
  try {
    const [
      personalInfo,
      skills,
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
      getGalleryItems(),
      getHobbies(),
      getFutureGoals(),
      getTestimonials(),
      getBlogPosts(true),
      getContactInfo(),
    ]);

    return {
      personalInfo,
      skills,
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
    };
  } catch (error) {
    console.error("Error fetching all portfolio content:", error);
    throw error;
  }
}
