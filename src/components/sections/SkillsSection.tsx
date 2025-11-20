"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { SkillCategory, Skill, Project } from "@/lib/content-types";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import DisplayModeToggle, { DisplayMode } from "@/components/skills/DisplayModeToggle";
import GridView from "@/components/skills/GridView";
import TagCloudView from "@/components/skills/TagCloudView";
import CompactListView from "@/components/skills/CompactListView";
import SkillDetailModal from "@/components/skills/SkillDetailModal";
import CoreStackRow from "@/components/skills/CoreStackRow";
import SkillsSummary from "@/components/skills/SkillsSummary";
import SkillsSearchFilter from "@/components/skills/SkillsSearchFilter";
import {
  getPrimarySkills,
  getProjectsForSkill,
  getSkillStats,
  filterSkills,
  filterByCategory,
  separateHardAndSoftSkills,
  getProficiencyBand,
  groupSkillsByProficiency,
  getCategoryColor,
} from "@/lib/skills-utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTranslatedSkills, useTranslatedProjects } from "@/lib/i18n/useTranslatedContent";

interface SkillsSectionProps {
  skillCategories: SkillCategory[];
  projects?: Project[];
  defaultDisplayMode?: DisplayMode;
  showModeToggle?: boolean;
  enableInteractions?: boolean;
  showCoreStack?: boolean;
  showSummary?: boolean;
  showSearchFilter?: boolean;
}

export default function SkillsSection({
  skillCategories: initialSkillCategories = [],
  projects: initialProjects = [],
  defaultDisplayMode = "grid",
  showModeToggle = true,
  enableInteractions = true,
  showCoreStack = true,
  showSummary = true,
  showSearchFilter = true,
}: SkillsSectionProps) {
  const { t, locale } = useLanguage();
  
  // Use translated content if not English
  const skillCategories = useTranslatedSkills(initialSkillCategories);
  const projects = useTranslatedProjects(initialProjects);

  const [displayMode, setDisplayMode] = useState<DisplayMode>(defaultDisplayMode);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [proficiencyFilter, setProficiencyFilter] = useState<string | null>(null);

  // Memoize empty state check
  const hasSkills = useMemo(
    () => skillCategories && skillCategories.length > 0,
    [skillCategories]
  );

  // Memoize filtered categories
  const filteredCategories = useMemo(() => {
    let result = skillCategories;

    // Apply search filter
    if (searchQuery) {
      result = filterSkills(result, searchQuery);
    }

    // Apply category filter
    if (categoryFilter) {
      result = filterByCategory(result, categoryFilter);
    }

    // Apply proficiency filter
    if (proficiencyFilter && proficiencyFilter !== "All") {
      const grouped = groupSkillsByProficiency(result);
      const filteredSkills = grouped[proficiencyFilter as keyof typeof grouped] || [];
      
      result = result.map(cat => ({
        ...cat,
        skills: cat.skills.filter(skill => 
          filteredSkills.some(fs => fs.name === skill.name)
        ),
      })).filter(cat => cat.skills.length > 0);
    }

    return result;
  }, [skillCategories, searchQuery, categoryFilter, proficiencyFilter]);

  // Memoize core skills
  const coreSkills = useMemo(
    () => getPrimarySkills(skillCategories),
    [skillCategories]
  );

  // Memoize skill stats
  const skillStats = useMemo(
    () => getSkillStats(skillCategories),
    [skillCategories]
  );

  // Get related projects for selected skill
  const relatedProjects = useMemo(() => {
    if (!selectedSkill) return [];
    return getProjectsForSkill(selectedSkill.name, projects);
  }, [selectedSkill, projects]);

  // Handle skill click with useCallback
  const handleSkillClick = useCallback(
    (skillName: string, skillData: Skill) => {
      if (enableInteractions) {
        setSelectedSkill(skillData);
        setIsModalOpen(true);
      }
    },
    [enableInteractions]
  );

  // Handle modal close with useCallback
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    // Delay clearing selected skill to allow exit animation
    setTimeout(() => setSelectedSkill(null), 300);
  }, []);

  // Flatten all skills with their category info
  const allSkills = useMemo(() => {
    return filteredCategories.flatMap(category =>
      category.skills.map(skill => ({
        ...skill,
        categoryName: category.name,
        categoryColor: getCategoryColor(category.name),
      }))
    );
  }, [filteredCategories]);

  // Handle empty state
  if (!hasSkills) {
    return (
      <Section id="skills" className="bg-muted/20">
        <SectionTitle
          title="Skills & Expertise"
          subtitle="Technologies and tools I work with"
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">No skills to display yet.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="skills" className="relative overflow-hidden">
      <SectionTitle
        title={t.sections.skills.title}
        subtitle={t.sections.skills.subtitle}
      />

      {/* Skills Summary Stats */}
      {showSummary && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {/* Total Skills */}
          <motion.div
            whileHover={{ scale: 1.08, y: -8 }}
            className="glass-ultra p-8 rounded-3xl text-center group relative overflow-hidden card-3d border-2 border-white/10 hover:border-white/20 shadow-xl"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-purple-500/15 via-pink-500/15 to-rose-500/15 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl md:text-7xl font-display font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent mb-3 relative z-10 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]"
            >
              {allSkills.length}
            </motion.div>
            <div className="text-base font-bold text-gray-400 uppercase tracking-wide relative z-10">Total Skills</div>
          </motion.div>

          {/* Categories */}
          <motion.div
            whileHover={{ scale: 1.08, y: -8 }}
            className="glass-ultra p-8 rounded-3xl text-center group relative overflow-hidden card-3d border-2 border-white/10 hover:border-white/20 shadow-xl"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-fuchsia-500/15 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              className="text-6xl md:text-7xl font-display font-black bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-3 relative z-10 drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]"
            >
              {filteredCategories.length}
            </motion.div>
            <div className="text-base font-bold text-gray-400 uppercase tracking-wide relative z-10">Categories</div>
          </motion.div>

          {/* Advanced+ */}
          <motion.div
            whileHover={{ scale: 1.08, y: -8 }}
            className="glass-ultra p-8 rounded-3xl text-center group relative overflow-hidden card-3d border-2 border-white/10 hover:border-white/20 shadow-xl"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-lime-500/15 via-green-500/15 to-emerald-500/15 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              className="text-6xl md:text-7xl font-display font-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 relative z-10 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]"
            >
              {allSkills.filter(s => s.level && s.level >= 75).length}
            </motion.div>
            <div className="text-base font-bold text-gray-400 uppercase tracking-wide relative z-10">Advanced+</div>
          </motion.div>

          {/* Core Stack */}
          <motion.div
            whileHover={{ scale: 1.08, y: -8 }}
            className="glass-ultra p-8 rounded-3xl text-center group relative overflow-hidden card-3d border-2 border-white/10 hover:border-white/20 shadow-xl"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-red-500/15 via-orange-500/15 to-amber-500/15 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              className="text-6xl md:text-7xl font-display font-black bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent mb-3 relative z-10 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]"
            >
              {allSkills.filter(s => s.isPrimary).length}
            </motion.div>
            <div className="text-base font-bold text-gray-400 uppercase tracking-wide relative z-10">Core Stack</div>
          </motion.div>
        </motion.div>
      )}

      {/* Search & Filter */}
      {showSearchFilter && (
        <SkillsSearchFilter
          categories={skillCategories}
          onSearchChange={setSearchQuery}
          onCategoryFilter={setCategoryFilter}
          onProficiencyFilter={setProficiencyFilter}
        />
      )}

      {/* Category Legend - ENHANCED */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {filteredCategories.map((category, idx) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.05, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1, y: -4 }}
            className="flex items-center gap-3 px-5 py-3 glass-ultra rounded-full border-2 border-white/10 hover:border-white/20 shadow-lg group relative overflow-hidden"
          >
            {/* Wave background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(category.name)} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
            
            {/* Animated dot */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 10px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-4 h-4 rounded-full bg-gradient-to-r ${getCategoryColor(category.name)} shadow-lg relative z-10`} 
            />
            <span className="text-sm font-bold text-white relative z-10">{category.name}</span>
            <span className="text-sm font-bold text-gray-400 relative z-10">({category.skills.length})</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Individual Skill Cards Grid - BEAUTIFUL LAYOUT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12"
      >
        {allSkills.map((skill, index) => (
          <IndividualSkillCard
            key={`${skill.categoryName}-${skill.name}-${index}`}
            skill={skill}
            categoryColor={skill.categoryColor}
            index={index}
            onClick={() => handleSkillClick(skill.name, skill)}
          />
        ))}
      </motion.div>

      {/* No Results Message */}
      {allSkills.length === 0 && (searchQuery || categoryFilter || proficiencyFilter) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-2">
            No skills found matching your filters
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter(null);
              setProficiencyFilter(null);
            }}
            className="text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Skill Detail Modal */}
      {enableInteractions && (
        <SkillDetailModal
          skill={selectedSkill}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          relatedProjects={relatedProjects}
        />
      )}
    </Section>
  );
}



// Array of unique vibrant color combinations for each card
const uniqueCardColors = [
  "from-blue-500/90 via-cyan-500/90 to-teal-500/90",           // Blue-Cyan-Teal
  "from-purple-500/90 via-pink-500/90 to-rose-500/90",         // Purple-Pink-Rose
  "from-green-500/90 via-emerald-500/90 to-lime-500/90",       // Green-Emerald-Lime
  "from-orange-500/90 via-amber-500/90 to-yellow-500/90",      // Orange-Amber-Yellow
  "from-red-500/90 via-pink-500/90 to-purple-500/90",          // Red-Pink-Purple
  "from-indigo-500/90 via-blue-500/90 to-cyan-500/90",         // Indigo-Blue-Cyan
  "from-fuchsia-500/90 via-purple-500/90 to-pink-500/90",      // Fuchsia-Purple-Pink
  "from-sky-500/90 via-blue-500/90 to-indigo-500/90",          // Sky-Blue-Indigo
  "from-violet-500/90 via-purple-500/90 to-fuchsia-500/90",    // Violet-Purple-Fuchsia
  "from-lime-500/90 via-green-500/90 to-emerald-500/90",       // Lime-Green-Emerald
  "from-cyan-500/90 via-blue-500/90 to-purple-500/90",         // Cyan-Blue-Purple
  "from-pink-500/90 via-rose-500/90 to-red-500/90",            // Pink-Rose-Red
  "from-teal-500/90 via-cyan-500/90 to-sky-500/90",            // Teal-Cyan-Sky
  "from-rose-500/90 via-pink-500/90 to-fuchsia-500/90",        // Rose-Pink-Fuchsia
  "from-amber-500/90 via-orange-500/90 to-red-500/90",         // Amber-Orange-Red
  "from-emerald-500/90 via-teal-500/90 to-cyan-500/90",        // Emerald-Teal-Cyan
  "from-purple-500/90 via-violet-500/90 to-indigo-500/90",     // Purple-Violet-Indigo
  "from-yellow-500/90 via-amber-500/90 to-orange-500/90",      // Yellow-Amber-Orange
  "from-blue-500/90 via-indigo-500/90 to-purple-500/90",       // Blue-Indigo-Purple
  "from-green-500/90 via-teal-500/90 to-cyan-500/90",          // Green-Teal-Cyan
  "from-pink-500/90 via-fuchsia-500/90 to-purple-500/90",      // Pink-Fuchsia-Purple
  "from-red-500/90 via-rose-500/90 to-pink-500/90",            // Red-Rose-Pink
  "from-cyan-500/90 via-sky-500/90 to-blue-500/90",            // Cyan-Sky-Blue
  "from-lime-500/90 via-emerald-500/90 to-green-500/90",       // Lime-Emerald-Green
];

// Individual Skill Card Component
interface IndividualSkillCardProps {
  skill: Skill & { categoryName: string; categoryColor: string };
  categoryColor: string;
  index: number;
  onClick: () => void;
}

function IndividualSkillCard({ skill, categoryColor, index, onClick }: IndividualSkillCardProps) {
  const level = skill.level || 70;
  const getLevelLabel = (level: number) => {
    if (level >= 90) return "Expert";
    if (level >= 75) return "Advanced";
    if (level >= 50) return "Intermediate";
    return "Beginner";
  };

  const getLevelIcon = (level: number) => {
    if (level >= 90) return "🏆";
    if (level >= 75) return "⭐";
    if (level >= 50) return "💫";
    return "🌟";
  };

  // Get unique color for this specific card based on its index
  const uniqueColor = uniqueCardColors[index % uniqueCardColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{
        scale: 1.05,
        y: -10,
      }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Card Container - BEAUTIFUL UNIQUE COLORFUL STYLE */}
      <div className="glass-ultra p-8 rounded-3xl relative overflow-hidden group border-2 border-white/10 hover:border-white/20 shadow-2xl transition-all duration-500">
        {/* Full Card Gradient Overlay - UNIQUE VIBRANT COLOR */}
        <div className={`absolute inset-0 bg-gradient-to-br ${uniqueColor} opacity-25 group-hover:opacity-35 transition-opacity duration-500`} />
        
        {/* HUGE Decorative Wave Background - TOP RIGHT */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${uniqueColor} opacity-40 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700`} />
        
        {/* HUGE Decorative Wave Background - BOTTOM LEFT */}
        <div className={`absolute -bottom-20 -left-20 w-56 h-56 bg-gradient-to-tr ${uniqueColor} opacity-30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700`} />
        
        {/* Gradient Top Border - THICKER */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${uniqueColor} shadow-lg`} />
        
        {/* Content - BEAUTIFUL CENTERED LAYOUT */}
        <div className="relative flex flex-col items-center text-center z-10">
          {/* Large Icon - PROMINENT */}
          {skill.icon && (
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-7xl mb-5 floating filter drop-shadow-2xl"
            >
              {skill.icon.startsWith('http') ? (
                <img src={skill.icon} alt={skill.name} className="w-20 h-20 object-contain" />
              ) : (
                <span>{skill.icon}</span>
              )}
            </motion.div>
          )}
          
          {/* Skill Name - LARGE & BOLD */}
          <h3 className="text-xl md:text-2xl font-black text-white mb-3 relative z-10 group-hover:text-gray-50 transition-colors leading-tight">
            {skill.name}
          </h3>
          
          {/* Description/Level Info */}
          <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors leading-relaxed mb-4">
            {getLevelLabel(level)} level proficiency
            {level >= 90 && " 🏆"}
            {level >= 75 && level < 90 && " ⭐"}
          </p>
          
          {/* Progress Bar - SIMPLE & CLEAN WITH UNIQUE COLOR */}
          <div className="w-full relative">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: index * 0.08 + 0.3, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${uniqueColor} relative`}
              >
                <div className="absolute inset-0 bg-white/40 animate-pulse" />
              </motion.div>
            </div>
            <div className="text-xs text-gray-300 mt-2 font-bold">{level}%</div>
          </div>
        </div>
        
        {/* Corner Accents - UNIQUE COLORFUL */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${uniqueColor} opacity-30 group-hover:opacity-50 rounded-bl-full transition-opacity duration-500`} />
        <div className={`absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr ${uniqueColor} opacity-20 group-hover:opacity-40 rounded-tr-full transition-opacity duration-500`} />
      </div>
    </motion.div>
  );
}

