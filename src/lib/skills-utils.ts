/**
 * Skills Utility Functions
 * Helper functions for skills display and categorization
 */

import { Skill, SkillCategory, Project } from "./content-types";

/**
 * Proficiency bands based on skill level
 */
export type ProficiencyBand = "Expert" | "Advanced" | "Intermediate" | "Beginner";

export interface ProficiencyBandInfo {
  label: ProficiencyBand;
  min: number;
  max: number;
  color: string;
  description: string;
}

export const PROFICIENCY_BANDS: ProficiencyBandInfo[] = [
  {
    label: "Expert",
    min: 85,
    max: 100,
    color: "text-emerald-500",
    description: "Deep expertise, can teach others",
  },
  {
    label: "Advanced",
    min: 70,
    max: 84,
    color: "text-blue-500",
    description: "Highly proficient, production-ready",
  },
  {
    label: "Intermediate",
    min: 50,
    max: 69,
    color: "text-amber-500",
    description: "Comfortable working independently",
  },
  {
    label: "Beginner",
    min: 0,
    max: 49,
    color: "text-gray-500",
    description: "Learning and building foundational knowledge",
  },
];

/**
 * Get proficiency band for a skill level
 */
export function getProficiencyBand(level: number): ProficiencyBandInfo {
  return (
    PROFICIENCY_BANDS.find((band) => level >= band.min && level <= band.max) ||
    PROFICIENCY_BANDS[PROFICIENCY_BANDS.length - 1]
  );
}

/**
 * Get all primary/core skills across categories
 */
export function getPrimarySkills(categories: SkillCategory[]): Skill[] {
  // Safety check for undefined or null categories
  if (!categories || !Array.isArray(categories)) {
    return [];
  }
  
  const allSkills = categories.flatMap((cat) => cat.skills || []);
  return allSkills.filter((skill) => skill && skill.isPrimary);
}

/**
 * Get projects that use a specific skill
 */
export function getProjectsForSkill(skillName: string, projects: Project[]): Project[] {
  return projects.filter((project) =>
    project.techStack?.some(
      (tech) => tech.toLowerCase() === skillName.toLowerCase()
    )
  );
}

/**
 * Calculate total years of experience across all skills
 */
export function getTotalExperience(categories: SkillCategory[]): number {
  if (!categories || !Array.isArray(categories)) return 0;
  const allSkills = categories.flatMap((cat) => cat.skills || []);
  const experiences = allSkills
    .map((skill) => skill.yearsOfExperience || 0)
    .filter((years) => years > 0);
  
  return experiences.length > 0 ? Math.max(...experiences) : 0;
}

/**
 * Get total skill count
 */
export function getTotalSkillCount(categories: SkillCategory[]): number {
  if (!categories || !Array.isArray(categories)) return 0;
  return categories.reduce((sum, cat) => sum + (cat.skills?.length || 0), 0);
}

/**
 * Group skills by proficiency band
 */
export function groupSkillsByProficiency(
  categories: SkillCategory[]
): Record<ProficiencyBand, Skill[]> {
  const grouped: Record<string, Skill[]> = {
    Expert: [],
    Advanced: [],
    Intermediate: [],
    Beginner: [],
  };

  if (!categories || !Array.isArray(categories)) return grouped as Record<ProficiencyBand, Skill[]>;

  const allSkills = categories.flatMap((cat) => cat.skills || []);

  allSkills.forEach((skill) => {
    if (skill && skill.level !== undefined) {
      const band = getProficiencyBand(skill.level);
      grouped[band.label].push(skill);
    }
  });

  return grouped as Record<ProficiencyBand, Skill[]>;
}

/**
 * Filter skills by search query
 */
export function filterSkills(
  categories: SkillCategory[],
  searchQuery: string
): SkillCategory[] {
  if (!categories || !Array.isArray(categories)) return [];
  if (!searchQuery.trim()) return categories;

  const query = searchQuery.toLowerCase();

  return categories
    .map((category) => ({
      ...category,
      skills: (category.skills || []).filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.description?.toLowerCase().includes(query)
      ),
    }))
    .filter((category) => category.skills.length > 0);
}

/**
 * Filter categories by category name
 */
export function filterByCategory(
  categories: SkillCategory[],
  categoryFilter: string | null
): SkillCategory[] {
  if (!categories || !Array.isArray(categories)) return [];
  if (!categoryFilter || categoryFilter === "All") return categories;
  
  if (categoryFilter === "Core") {
    return categories
      .map((category) => ({
        ...category,
        skills: (category.skills || []).filter((skill) => skill.isPrimary),
      }))
      .filter((category) => category.skills.length > 0);
  }

  return categories.filter(
    (category) => category.name.toLowerCase() === categoryFilter.toLowerCase()
  );
}

/**
 * Separate hard and soft skills
 */
export function separateHardAndSoftSkills(categories: SkillCategory[]): {
  hard: SkillCategory[];
  soft: SkillCategory[];
} {
  if (!categories || !Array.isArray(categories)) return { hard: [], soft: [] };
  const softSkillCategories = ["soft skills", "professional skills", "interpersonal"];
  
  const hard = categories.filter(
    (cat) => !softSkillCategories.some((soft) => cat.name.toLowerCase().includes(soft))
  );
  
  const soft = categories.filter((cat) =>
    softSkillCategories.some((softCat) => cat.name.toLowerCase().includes(softCat))
  );

  return { hard, soft };
}

/**
 * Get skill statistics for summary
 */
export function getSkillStats(categories: SkillCategory[]): {
  total: number;
  primary: number;
  categories: number;
  maxExperience: number;
  expertCount: number;
  advancedCount: number;
} {
  if (!categories || !Array.isArray(categories)) {
    return {
      total: 0,
      primary: 0,
      categories: 0,
      maxExperience: 0,
      expertCount: 0,
      advancedCount: 0,
    };
  }

  const allSkills = categories.flatMap((cat) => cat.skills || []);
  const grouped = groupSkillsByProficiency(categories);

  return {
    total: allSkills.length,
    primary: allSkills.filter((s) => s.isPrimary).length,
    categories: categories.length,
    maxExperience: getTotalExperience(categories),
    expertCount: grouped.Expert.length,
    advancedCount: grouped.Advanced.length,
  };
}

/**
 * Get category color with fallback
 */
export function getCategoryColor(color?: string, index?: number): string {
  if (color) return color;
  
  // Default color palette for categories
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-yellow-500 to-amber-500",
    "from-indigo-500 to-purple-500",
  ];
  
  return colors[index !== undefined ? index % colors.length : 0];
}

/**
 * Format years of experience for display
 */
export function formatExperience(years: number): string {
  if (years === 0) return "Less than 1 year";
  if (years === 1) return "1 year";
  return `${years}+ years`;
}

/**
 * Get proficiency label from level (legacy support)
 */
export function getProficiencyLabel(level: number): string {
  const band = getProficiencyBand(level);
  return band.label;
}

/**
 * Get proficiency color gradient based on level
 */
export function getProficiencyColor(level: number): string {
  const band = getProficiencyBand(level);
  
  // Return gradient classes based on proficiency band
  const colorMap: Record<ProficiencyBand, string> = {
    Expert: "from-emerald-500 to-green-500",
    Advanced: "from-blue-500 to-cyan-500",
    Intermediate: "from-amber-500 to-yellow-500",
    Beginner: "from-gray-500 to-slate-500",
  };
  
  return colorMap[band.label];
}

/**
 * Get tag size class based on skill level (for tag cloud)
 */
export function getTagSize(level: number): string {
  if (level >= 90) return "text-2xl md:text-3xl"; // Expert - largest
  if (level >= 80) return "text-xl md:text-2xl";  // Very proficient
  if (level >= 70) return "text-lg md:text-xl";   // Advanced
  if (level >= 60) return "text-base md:text-lg"; // Intermediate+
  if (level >= 50) return "text-sm md:text-base"; // Intermediate
  return "text-xs md:text-sm";                     // Beginner
}
