/**
 * Supabase Query Helper Functions
 * Provides CRUD operations for all portfolio content
 */

import { supabase } from "./supabase";
import { deleteFile, getStoragePathFromUrl } from "./supabase-storage";
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
    
    if (error) {
      // If no data exists yet, return null without error
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    // Transform snake_case to camelCase
    return {
      id: data.id,
      name: data.name,
      headline: data.headline,
      shortBio: data.short_bio,
      longBio: data.long_bio,
      location: data.location,
      email: data.email,
      phone: data.phone,
      currentStatus: data.current_status,
      profileImageUrl: data.profile_image_url,
      resumeUrl: data.resume_url,
      socialLinks: data.social_links || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as PersonalInfo;
  } catch (error) {
    console.error("Error fetching personal info:", error);
    return null;
  }
}

export async function updatePersonalInfo(data: Omit<PersonalInfo, "id">): Promise<void> {
  try {
    // Check for file changes to delete old files
    const { data: existing } = await supabase
      .from('personal_info')
      .select('id, profile_image_url, resume_url')
      .single();

    if (existing) {
      if (data.profileImageUrl !== undefined && existing.profile_image_url && existing.profile_image_url !== data.profileImageUrl) {
        const oldPath = getStoragePathFromUrl(existing.profile_image_url);
        if (oldPath) await deleteFile(oldPath).catch(console.error);
      }
      if (data.resumeUrl !== undefined && existing.resume_url && existing.resume_url !== data.resumeUrl) {
        const oldPath = getStoragePathFromUrl(existing.resume_url);
        if (oldPath) await deleteFile(oldPath).catch(console.error);
      }
    }

    // Transform camelCase to snake_case
    const dbData:  any = {
      name: data.name,
      headline: data.headline,
      short_bio: data.shortBio,
      long_bio: data.longBio,
      location: data.location,
      email: data.email,
      phone: data.phone || null,
      current_status: data.currentStatus || null,
      profile_image_url: data.profileImageUrl || null,
      resume_url: data.resumeUrl || null,
      social_links: data.socialLinks || [],
      updated_at: new Date().toISOString(),
    };

    // Check if record exists
    const { data: existingRecord } = await supabase
      .from('personal_info')
      .select('id')
      .single();

    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from('personal_info')
        .update(dbData)
        .eq('id', existingRecord.id);
      
      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('personal_info')
        .insert(dbData);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error("Error updating personal info:", error);
    throw error;
  }
}

// ============================================================================
// SKILLS
// ============================================================================

// Get all skills (flat list from database)
export async function getAllSkills(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

// Get skills grouped by category for display
export async function getSkillCategories(): Promise<SkillCategory[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order', { ascending: true});
    
    if (error) throw error;
    
    // Group skills by category
    const grouped = (data || []).reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push({
        id: skill.id,
        name: skill.name,
        level: skill.level,
        icon: skill.icon,
        isPrimary: skill.is_primary,
        description: skill.description,
      });
      return acc;
    }, {});
    
    // Convert to SkillCategory array
    return Object.keys(grouped).map((category, index) => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      skills: grouped[category],
      order: index,
    }));
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

// Create individual skill
export async function createSkill(data: { category: string; name: string; level?: number; icon?: string }): Promise<string> {
  try {
    const { data: result, error } = await supabase
      .from('skills')
      .insert({
        category: data.category,
        name: data.name,
        level: data.level || 50,
        icon: data.icon || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating skill:", error);
    throw error;
  }
}

// Update individual skill
export async function updateSkill(id: string, data: Partial<{ category: string; name: string; level: number; icon: string }>): Promise<void> {
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

// Delete individual skill
export async function deleteSkill(id: string): Promise<void> {
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
    
    return (data || []).map((item: any) => ({
      id: item.id,
      institution: item.institution,
      degree: item.degree,
      field: item.field,
      startDate: item.start_date || undefined,
      endDate: item.end_date,
      isCurrent: !item.end_date,
      description: item.description,
      grade: item.grade,
      order: item.order,
    })) as EducationItem[];
  } catch (error) {
    console.error("Error fetching education:", error);
    return [];
  }
}

// Alias for admin pages
export const getAllEducation = getEducation;

export async function createEducationItem(data: Omit<EducationItem, "id">): Promise<string> {
  try {
    const dbData = {
      institution: data.institution,
      degree: data.degree,
      field: data.field,
      start_date: data.startDate,
      end_date: data.endDate,
      description: data.description,
      grade: data.grade,
    };

    const { data: result, error } = await supabase
      .from('education')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating education:", error);
    throw error;
  }
}

// Alias for admin pages
export const createEducation = createEducationItem;

export async function updateEducationItem(id: string, data: Partial<EducationItem>): Promise<void> {
  try {
    const dbData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.institution !== undefined) dbData.institution = data.institution;
    if (data.degree !== undefined) dbData.degree = data.degree;
    if (data.field !== undefined) dbData.field = data.field;
    if (data.startDate !== undefined) dbData.start_date = data.startDate;
    if (data.endDate !== undefined) dbData.end_date = data.endDate;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.grade !== undefined) dbData.grade = data.grade;

    const { error } = await supabase
      .from('education')
      .update(dbData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating education:", error);
    throw error;
  }
}

// Alias for admin pages
export const updateEducation = updateEducationItem;

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

// Alias for admin pages
export const deleteEducation = deleteEducationItem;

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
    
    return (data || []).map((item: any) => ({
      id: item.id,
      role: item.position,
      company: item.company,
      startDate: item.start_date || undefined,
      endDate: item.end_date,
      isCurrent: !item.end_date,
      description: item.description,
      technologies: item.technologies || [],
      order: item.order,
    })) as ExperienceItem[];
  } catch (error) {
    console.error("Error fetching experience:", error);
    return [];
  }
}

// Alias for admin pages
export const getAllExperience = getExperience;

export async function createExperienceItem(data: Omit<ExperienceItem, "id">): Promise<string> {
  try {
    const dbData = {
      position: data.role,
      company: data.company,
      // convert empty/falsey startDate to null so DB can accept missing dates
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      description: data.description,
      technologies: data.technologies,
    };

    const { data: result, error } = await supabase
      .from('experience')
      .insert(dbData)
      .select()
      .single();
    
    if (error) throw error;
    return result.id;
  } catch (error) {
    console.error("Error creating experience:", error);
    throw error;
  }
}

// Alias for admin pages
export const createExperience = createExperienceItem;

export async function updateExperienceItem(id: string, data: Partial<ExperienceItem>): Promise<void> {
  try {
    const dbData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.role !== undefined) dbData.position = data.role;
    if (data.company !== undefined) dbData.company = data.company;
    if (data.startDate !== undefined) dbData.start_date = data.startDate || null;
    if (data.endDate !== undefined) dbData.end_date = data.endDate || null;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.technologies !== undefined) dbData.technologies = data.technologies;

    const { error } = await supabase
      .from('experience')
      .update(dbData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
}

// Alias for admin pages
export const updateExperience = updateExperienceItem;

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

// Alias for admin pages
export const deleteExperience = deleteExperienceItem;

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
    
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug || '',
      summary: item.description,
      description: item.long_description || '',
      imageUrl: item.image_url,
      techStack: item.technologies || [],
      githubUrl: item.github_url,
      liveUrl: item.demo_url,
      type: item.category,
      featured: item.featured,
      order: item.order,
      createdAt: item.created_at
    })) as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Alias for admin pages
export const getAllProjects = getProjects;

export async function createProject(data: Omit<Project, "id">): Promise<string> {
  try {
    const dbData = {
      title: data.title,
      description: data.summary,
      long_description: data.description,
      image_url: data.imageUrl,
      technologies: data.techStack,
      github_url: data.githubUrl,
      demo_url: data.liveUrl,
      category: data.type,
      featured: data.featured,
      slug: data.slug || data.title.toLowerCase().replace(/ /g, '-'),
    };

    const { data: result, error } = await supabase
      .from('projects')
      .insert(dbData)
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
    // Check for file changes to delete old files
    if (data.imageUrl !== undefined) {
      const { data: existing } = await supabase
        .from('projects')
        .select('image_url')
        .eq('id', id)
        .single();
      
      if (existing && existing.image_url && existing.image_url !== data.imageUrl) {
        const oldPath = getStoragePathFromUrl(existing.image_url);
        if (oldPath) await deleteFile(oldPath).catch(console.error);
      }
    }

    const dbData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.title !== undefined) dbData.title = data.title;
    if (data.summary !== undefined) dbData.description = data.summary;
    if (data.description !== undefined) dbData.long_description = data.description;
    if (data.imageUrl !== undefined) dbData.image_url = data.imageUrl;
    if (data.techStack !== undefined) dbData.technologies = data.techStack;
    if (data.githubUrl !== undefined) dbData.github_url = data.githubUrl;
    if (data.liveUrl !== undefined) dbData.demo_url = data.liveUrl;
    if (data.type !== undefined) dbData.category = data.type;
    if (data.featured !== undefined) dbData.featured = data.featured;
    if (data.slug !== undefined) dbData.slug = data.slug;

    const { error } = await supabase
      .from('projects')
      .update(dbData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    // Get project details first to delete image
    const { data: project } = await supabase
      .from('projects')
      .select('image_url')
      .eq('id', id)
      .single();

    if (project) {
      const imagePath = getStoragePathFromUrl(project.image_url);
      if (imagePath) await deleteFile(imagePath).catch(console.error);
    }

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
    
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      organization: "", // Default as DB missing it
      date: item.date,
      description: item.description,
      category: item.category,
      iconUrl: item.icon,
      order: item.order,
    })) as Achievement[];
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
}

export async function createAchievement(data: Omit<Achievement, "id">): Promise<string> {
  try {
    const dbData = {
      title: data.title,
      description: data.description,
      date: data.date,
      icon: data.iconUrl,
      category: data.category,
    };

    const { data: result, error } = await supabase
      .from('achievements')
      .insert(dbData)
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
    const dbData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.date !== undefined) dbData.date = data.date;
    if (data.iconUrl !== undefined) dbData.icon = data.iconUrl;
    if (data.category !== undefined) dbData.category = data.category;

    const { error } = await supabase
      .from('achievements')
      .update(dbData)
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
    
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      issuedDate: item.date,
      fileUrl: item.file_url || item.credential_url || '',
      previewImageUrl: item.image_url,
      credentialUrl: item.credential_url,
      description: item.description,
      order: item.order,
    })) as Certificate[];
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}

export async function createCertificate(data: Omit<Certificate, "id">): Promise<string> {
  try {
    const dbData = {
      title: data.title,
      issuer: data.issuer,
      date: data.issuedDate,
      credential_url: data.credentialUrl,
      file_url: data.fileUrl,
      image_url: data.previewImageUrl,
      description: data.description,
    };

    const { data: result, error } = await supabase
      .from('certificates')
      .insert(dbData)
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
    // Check for file changes to delete old files
    if (data.fileUrl !== undefined || data.previewImageUrl !== undefined) {
      const { data: existing } = await supabase
        .from('certificates')
        .select('file_url, image_url')
        .eq('id', id)
        .single();
      
      if (existing) {
        if (data.fileUrl !== undefined && existing.file_url && existing.file_url !== data.fileUrl) {
          const oldPath = getStoragePathFromUrl(existing.file_url);
          if (oldPath) await deleteFile(oldPath).catch(console.error);
        }
        if (data.previewImageUrl !== undefined && existing.image_url && existing.image_url !== data.previewImageUrl) {
          const oldPath = getStoragePathFromUrl(existing.image_url);
          if (oldPath) await deleteFile(oldPath).catch(console.error);
        }
      }
    }

    const dbData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.title !== undefined) dbData.title = data.title;
    if (data.issuer !== undefined) dbData.issuer = data.issuer;
    if (data.issuedDate !== undefined) dbData.date = data.issuedDate;
    if (data.credentialUrl !== undefined) dbData.credential_url = data.credentialUrl;
    if (data.fileUrl !== undefined) dbData.file_url = data.fileUrl;
    if (data.previewImageUrl !== undefined) dbData.image_url = data.previewImageUrl;
    if (data.description !== undefined) dbData.description = data.description;

    const { error } = await supabase
      .from('certificates')
      .update(dbData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating certificate:", error);
    throw error;
  }
}

export async function deleteCertificate(id: string): Promise<void> {
  try {
    // Get certificate details first to delete files
    const { data: certificate } = await supabase
      .from('certificates')
      .select('file_url, image_url')
      .eq('id', id)
      .single();

    if (certificate) {
      // Delete file if exists
      const filePath = getStoragePathFromUrl(certificate.file_url);
      if (filePath) await deleteFile(filePath).catch(console.error);

      // Delete preview image if exists
      const imagePath = getStoragePathFromUrl(certificate.image_url);
      if (imagePath) await deleteFile(imagePath).catch(console.error);
    }

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
    
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      category: item.category,
      order: item.order,
    })) as GalleryItem[];
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }
}

export async function createGalleryItem(data: Omit<GalleryItem, "id">): Promise<string> {
  try {
    const dbData = {
      title: data.title,
      description: data.description,
      image_url: data.imageUrl,
      category: data.category,
      // order?
    };

    const { data: result, error } = await supabase
      .from('gallery')
      .insert(dbData)
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
    // Check for file changes to delete old files
    if (data.imageUrl !== undefined) {
      const { data: existing } = await supabase
        .from('gallery')
        .select('image_url')
        .eq('id', id)
        .single();
      
      if (existing && existing.image_url && existing.image_url !== data.imageUrl) {
        const oldPath = getStoragePathFromUrl(existing.image_url);
        if (oldPath) await deleteFile(oldPath).catch(console.error);
      }
    }

    const dbData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.imageUrl !== undefined) dbData.image_url = data.imageUrl;
    if (data.category !== undefined) dbData.category = data.category;

    const { error } = await supabase
      .from('gallery')
      .update(dbData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating gallery item:", error);
    throw error;
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    // Get gallery item details first to delete image
    const { data: item } = await supabase
      .from('gallery')
      .select('image_url')
      .eq('id', id)
      .single();

    if (item) {
      const imagePath = getStoragePathFromUrl(item.image_url);
      if (imagePath) await deleteFile(imagePath).catch(console.error);
    }

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
    
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.name,
      description: item.description,
      icon: item.icon,
      imageUrl: item.image_url,
      order: item.order,
    })) as Hobby[];
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    return [];
  }
}

export async function createHobby(data: Omit<Hobby, "id">): Promise<string> {
  try {
    const dbData = {
      name: data.title,
      description: data.description,
      icon: data.icon,
      image_url: data.imageUrl,
    };

    const { data: result, error } = await supabase
      .from('hobbies')
      .insert(dbData)
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
    // Check for file changes to delete old files
    if (data.imageUrl !== undefined) {
      const { data: existing } = await supabase
        .from('hobbies')
        .select('image_url')
        .eq('id', id)
        .single();
      
      if (existing && existing.image_url && existing.image_url !== data.imageUrl) {
        const oldPath = getStoragePathFromUrl(existing.image_url);
        if (oldPath) await deleteFile(oldPath).catch(console.error);
      }
    }

    const dbData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.title !== undefined) dbData.name = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.icon !== undefined) dbData.icon = data.icon;
    if (data.imageUrl !== undefined) dbData.image_url = data.imageUrl;

    const { error } = await supabase
      .from('hobbies')
      .update(dbData)
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
    
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      targetDate: item.target_date,
      status: item.status,
      category: item.category,
      order: item.order,
    })) as FutureGoal[];
  } catch (error) {
    console.error("Error fetching future goals:", error);
    return [];
  }
}

export async function createFutureGoal(data: Omit<FutureGoal, "id">): Promise<string> {
  try {
    const dbData = {
      title: data.title,
      description: data.description,
      target_date: data.targetDate,
      status: data.status,
      category: data.category,
    };

    const { data: result, error } = await supabase
      .from('future_goals')
      .insert(dbData)
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
    const dbData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.title !== undefined) dbData.title = data.title;
    if (data.description !== undefined) dbData.description = data.description;
    if (data.targetDate !== undefined) dbData.target_date = data.targetDate;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.category !== undefined) dbData.category = data.category;

    const { error } = await supabase
      .from('future_goals')
      .update(dbData)
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
    
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      role: item.position,
      company: item.company,
      avatarUrl: item.avatar_url,
      quote: item.content,
      rating: item.rating,
      order: item.order,
    })) as Testimonial[];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function createTestimonial(data: Omit<Testimonial, "id">): Promise<string> {
  try {
    const dbData = {
      name: data.name,
      position: data.role,
      company: data.company,
      content: data.quote,
      avatar_url: data.avatarUrl,
      rating: data.rating,
    };

    const { data: result, error } = await supabase
      .from('testimonials')
      .insert(dbData)
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
    const dbData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.name !== undefined) dbData.name = data.name;
    if (data.role !== undefined) dbData.position = data.role;
    if (data.company !== undefined) dbData.company = data.company;
    if (data.quote !== undefined) dbData.content = data.quote;
    if (data.avatarUrl !== undefined) dbData.avatar_url = data.avatarUrl;
    if (data.rating !== undefined) dbData.rating = data.rating;

    const { error } = await supabase
      .from('testimonials')
      .update(dbData)
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
    
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      coverImageUrl: item.cover_image_url,
      author: item.author,
      publishedDate: item.published_at,
      updatedDate: item.updated_at,
      tags: item.tags || [],
      readTime: item.reading_time,
      published: item.published,
      views: 0,
      order: 0,
    })) as BlogPost[];
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
    
    const item = data;
    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      coverImageUrl: item.cover_image_url,
      author: item.author,
      publishedDate: item.published_at,
      updatedDate: item.updated_at,
      tags: item.tags || [],
      readTime: item.reading_time,
      published: item.published,
      views: 0,
      order: 0,
    } as BlogPost;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function createBlogPost(data: Omit<BlogPost, "id">): Promise<string> {
  try {
    const dbData = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      cover_image_url: data.coverImageUrl,
      author: data.author || "Admin",
      published: data.published,
      published_at: data.publishedDate,
      tags: data.tags,
      reading_time: data.readTime,
    };

    const { data: result, error } = await supabase
      .from('blog_posts')
      .insert(dbData)
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
    // Check for file changes to delete old files
    if (data.coverImageUrl !== undefined) {
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('cover_image_url')
        .eq('id', id)
        .single();
      
      if (existing && existing.cover_image_url && existing.cover_image_url !== data.coverImageUrl) {
        const oldPath = getStoragePathFromUrl(existing.cover_image_url);
        if (oldPath) await deleteFile(oldPath).catch(console.error);
      }
    }

    const dbData: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (data.title !== undefined) dbData.title = data.title;
    if (data.slug !== undefined) dbData.slug = data.slug;
    if (data.excerpt !== undefined) dbData.excerpt = data.excerpt;
    if (data.content !== undefined) dbData.content = data.content;
    if (data.coverImageUrl !== undefined) dbData.cover_image_url = data.coverImageUrl;
    if (data.author !== undefined) dbData.author = data.author;
    if (data.published !== undefined) dbData.published = data.published;
    if (data.publishedDate !== undefined) dbData.published_at = data.publishedDate;
    if (data.tags !== undefined) dbData.tags = data.tags;
    if (data.readTime !== undefined) dbData.reading_time = data.readTime;

    const { error } = await supabase
      .from('blog_posts')
      .update(dbData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  try {
    // Get blog post details first to delete cover image
    const { data: post } = await supabase
      .from('blog_posts')
      .select('cover_image_url')
      .eq('id', id)
      .single();

    if (post) {
      const imagePath = getStoragePathFromUrl(post.cover_image_url);
      if (imagePath) await deleteFile(imagePath).catch(console.error);
    }

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
    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      phone: data.phone,
      location: data.address, // Map address -> location
      availability: data.availability,
      socialLinks: data.social_links || [],
      // Map other fields if they exist in DB, otherwise defaults
      preferredContactMethod: data.preferred_contact_method,
      responseTime: data.response_time,
      enableContactForm: data.enable_contact_form,
      formSubmitEndpoint: data.form_submit_endpoint,
      formSuccessMessage: data.form_success_message,
      formErrorMessage: data.form_error_message,
    } as ContactInfo;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return null;
  }
}

export async function updateContactInfo(data: Partial<ContactInfo>): Promise<void> {
  try {
    const dbData: any = { ...data };
    
    // Map camelCase -> snake_case
    if (data.location) dbData.address = data.location;
    if (data.socialLinks) dbData.social_links = data.socialLinks;
    if (data.preferredContactMethod) dbData.preferred_contact_method = data.preferredContactMethod;
    if (data.responseTime) dbData.response_time = data.responseTime;
    if (data.enableContactForm !== undefined) dbData.enable_contact_form = data.enableContactForm;
    if (data.formSubmitEndpoint) dbData.form_submit_endpoint = data.formSubmitEndpoint;
    if (data.formSuccessMessage) dbData.form_success_message = data.formSuccessMessage;
    if (data.formErrorMessage) dbData.form_error_message = data.formErrorMessage;

    // Remove camelCase keys
    delete dbData.location;
    delete dbData.socialLinks;
    delete dbData.preferredContactMethod;
    delete dbData.responseTime;
    delete dbData.enableContactForm;
    delete dbData.formSubmitEndpoint;
    delete dbData.formSuccessMessage;
    delete dbData.formErrorMessage;

    const { error } = await supabase
      .from('contact_info')
      .upsert({
        ...dbData,
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
      skillCategories: skills,
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

// ============================================================================
// REORDER ITEMS
// ============================================================================

export async function reorderItems(table: string, items: { id: string; order: number }[]): Promise<void> {
  try {
    // We use Promise.all to update all items in parallel
    // In a production app with many items, an RPC function would be better
    const updates = items.map((item) => 
      supabase
        .from(table)
        .update({ order: item.order, updated_at: new Date().toISOString() })
        .eq('id', item.id)
    );
    
    await Promise.all(updates);
  } catch (error) {
    console.error(`Error reordering ${table}:`, error);
    throw error;
  }
}
