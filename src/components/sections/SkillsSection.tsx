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
      <Section id="skills" sectionId="skills">
        <SectionTitle
          title="Skills & Expertise"
          subtitle="Technologies and tools I work with"
          gradient="from-emerald-400 via-teal-400 to-emerald-300"
        />
        <div className="text-center py-12">
          <p className="text-zinc-500">No skills to display yet.</p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="skills" sectionId="skills" className="relative overflow-hidden">
      <SectionTitle
        title={t.sections.skills.title}
        subtitle={t.sections.skills.subtitle}
        gradient="from-emerald-400 via-teal-400 to-emerald-300"
      />

      {/* Skills Summary Stats */}
      {showSummary && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {/* Total Skills */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-white/55 border border-emerald-200/40 hover:border-emerald-300/60 p-6 rounded-2xl text-center transition-all backdrop-blur-xl shadow-[0_8px_28px_-16px_rgba(16,185,129,0.08)]"
          >
            <div className="text-5xl md:text-6xl font-black tabular-nums bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              {allSkills.length}
            </div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Skills</div>
          </motion.div>

          {/* Categories */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-white/55 border border-emerald-200/40 hover:border-emerald-300/60 p-6 rounded-2xl text-center transition-all backdrop-blur-xl shadow-[0_8px_28px_-16px_rgba(16,185,129,0.08)]"
          >
            <div className="text-5xl md:text-6xl font-black tabular-nums bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              {filteredCategories.length}
            </div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Categories</div>
          </motion.div>

          {/* Advanced+ */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-white/55 border border-emerald-200/40 hover:border-emerald-300/60 p-6 rounded-2xl text-center transition-all backdrop-blur-xl shadow-[0_8px_28px_-16px_rgba(16,185,129,0.08)]"
          >
            <div className="text-5xl md:text-6xl font-black tabular-nums bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              {allSkills.filter(s => s.level && s.level >= 75).length}
            </div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Advanced+</div>
          </motion.div>

          {/* Core Stack */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-white/55 border border-emerald-200/40 hover:border-emerald-300/60 p-6 rounded-2xl text-center transition-all backdrop-blur-xl shadow-[0_8px_28px_-16px_rgba(16,185,129,0.08)]"
          >
            <div className="text-5xl md:text-6xl font-black tabular-nums bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              {allSkills.filter(s => s.isPrimary).length}
            </div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Core Stack</div>
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

      {/* Category Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3 mb-12"
      >
        {filteredCategories.map((category, idx) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, type: "spring", stiffness: 200 }}
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/55 border border-emerald-200/30 rounded-full hover:border-emerald-300/60 transition-all backdrop-blur-xl shadow-sm"
          >
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(category.name)}`} />
            <span className="text-sm font-medium text-slate-600">{category.name}</span>
            <span className="text-sm text-slate-400">({category.skills.length})</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Individual Skill Cards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12"
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
          <p className="text-zinc-500 text-lg mb-2">
            No skills found matching your filters
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter(null);
              setProficiencyFilter(null);
            }}
            className="text-emerald-400 hover:underline"
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
  "from-blue-500/90 via-cyan-500/90 to-teal-500/90",
  "from-purple-500/90 via-pink-500/90 to-rose-500/90",
  "from-green-500/90 via-emerald-500/90 to-lime-500/90",
  "from-orange-500/90 via-amber-500/90 to-yellow-500/90",
  "from-red-500/90 via-pink-500/90 to-purple-500/90",
  "from-indigo-500/90 via-blue-500/90 to-cyan-500/90",
  "from-fuchsia-500/90 via-purple-500/90 to-pink-500/90",
  "from-sky-500/90 via-blue-500/90 to-indigo-500/90",
  "from-violet-500/90 via-purple-500/90 to-fuchsia-500/90",
  "from-lime-500/90 via-green-500/90 to-emerald-500/90",
  "from-cyan-500/90 via-blue-500/90 to-purple-500/90",
  "from-pink-500/90 via-rose-500/90 to-red-500/90",
  "from-teal-500/90 via-cyan-500/90 to-sky-500/90",
  "from-rose-500/90 via-pink-500/90 to-fuchsia-500/90",
  "from-amber-500/90 via-orange-500/90 to-red-500/90",
  "from-emerald-500/90 via-teal-500/90 to-cyan-500/90",
  "from-purple-500/90 via-violet-500/90 to-indigo-500/90",
  "from-yellow-500/90 via-amber-500/90 to-orange-500/90",
  "from-blue-500/90 via-indigo-500/90 to-purple-500/90",
  "from-green-500/90 via-teal-500/90 to-cyan-500/90",
  "from-pink-500/90 via-fuchsia-500/90 to-purple-500/90",
  "from-red-500/90 via-rose-500/90 to-pink-500/90",
  "from-cyan-500/90 via-sky-500/90 to-blue-500/90",
  "from-lime-500/90 via-emerald-500/90 to-green-500/90",
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

  // Get unique color for this specific card based on its index
  const uniqueColor = uniqueCardColors[index % uniqueCardColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
      }}
      whileHover={{ y: -8, scale: 1.03 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Card Container - vibrant glass with gradient accent */}
      <div className="bg-white/55 border border-white/70 hover:border-[rgba(var(--section-rgb),0.2)] p-6 rounded-2xl relative overflow-hidden transition-all backdrop-blur-xl shadow-[0_6px_24px_-12px_rgba(var(--section-rgb),0.06)] hover:shadow-[0_16px_40px_-16px_rgba(var(--section-rgb),0.14)] group-hover:bg-white/70">
        {/* Gradient Top Border - thicker and more vibrant */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${uniqueColor} opacity-90`} />

        {/* Holographic shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/40 via-transparent to-white/20 pointer-events-none" />

        {/* Content */}
        <div className="relative flex flex-col items-center text-center">
          {/* Icon */}
          {skill.icon && (
            <div className="text-5xl mb-4 drop-shadow-sm">
              {skill.icon.startsWith('http') ? (
                <img src={skill.icon} alt={skill.name} className="w-14 h-14 object-contain" />
              ) : (
                <span>{skill.icon}</span>
              )}
            </div>
          )}

          {/* Skill Name */}
          <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">
            {skill.name}
          </h3>

          {/* Level Label with icon */}
          <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
            {getLevelLabel(level)} level
            {level >= 90 && <span className="text-amber-500">&#x1F3C6;</span>}
            {level >= 75 && level < 90 && <span className="text-amber-400">&#x2B50;</span>}
          </p>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: index * 0.04 + 0.3, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${uniqueColor} relative rounded-full`}
              >
                {/* Glow dot at end */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(var(--section-rgb),0.5)] progress-glow" />
              </motion.div>
            </div>
            <div className="text-xs text-slate-500 mt-2 font-semibold tabular-nums">{level}%</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
