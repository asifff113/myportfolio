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
            className="bg-[rgba(15,15,40,0.65)] border border-emerald-500/25 hover:border-emerald-400/40 p-6 rounded-2xl text-center transition-all backdrop-blur-xl shadow-[0_8px_28px_-16px_rgba(16,185,129,0.20)]"
          >
            <div className="text-5xl md:text-6xl font-black tabular-nums bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              {allSkills.length}
            </div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Total Skills</div>
          </motion.div>

          {/* Categories */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-[rgba(15,15,40,0.65)] border border-emerald-500/25 hover:border-emerald-400/40 p-6 rounded-2xl text-center transition-all backdrop-blur-xl shadow-[0_8px_28px_-16px_rgba(16,185,129,0.20)]"
          >
            <div className="text-5xl md:text-6xl font-black tabular-nums bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              {filteredCategories.length}
            </div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Categories</div>
          </motion.div>

          {/* Advanced+ */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-[rgba(15,15,40,0.65)] border border-emerald-500/25 hover:border-emerald-400/40 p-6 rounded-2xl text-center transition-all backdrop-blur-xl shadow-[0_8px_28px_-16px_rgba(16,185,129,0.20)]"
          >
            <div className="text-5xl md:text-6xl font-black tabular-nums bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              {allSkills.filter(s => s.level && s.level >= 75).length}
            </div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Advanced+</div>
          </motion.div>

          {/* Core Stack */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-[rgba(15,15,40,0.65)] border border-emerald-500/25 hover:border-emerald-400/40 p-6 rounded-2xl text-center transition-all backdrop-blur-xl shadow-[0_8px_28px_-16px_rgba(16,185,129,0.20)]"
          >
            <div className="text-5xl md:text-6xl font-black tabular-nums bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              {allSkills.filter(s => s.isPrimary).length}
            </div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Core Stack</div>
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
            className="flex items-center gap-2 px-4 py-2 bg-[rgba(15,15,40,0.65)] border border-emerald-500/20 rounded-full hover:border-emerald-400/40 transition-all backdrop-blur-xl shadow-sm"
          >
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getCategoryColor(category.name)}`} />
            <span className="text-sm font-medium text-slate-300">{category.name}</span>
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



// Array of unique vibrant color palettes for each card
const uniqueCardColors = [
  { gradient: "from-[#662D8C] to-[#ED1E79]", glow: "237,30,121" }, // Purple to Pink
  { gradient: "from-[#2E3192] to-[#1BFFFF]", glow: "27,255,255" }, // Deep Blue to Cyan
  { gradient: "from-[#3A1C71] via-[#D76D77] to-[#FFAF7B]", glow: "215,109,119" }, // Purple to Orange
  { gradient: "from-[#11998E] to-[#38EF7D]", glow: "56,239,125" }, // Green
  { gradient: "from-[#4E65FF] to-[#92EFFD]", glow: "78,101,255" }, // Blue
  { gradient: "from-[#8E2DE2] to-[#4A00E0]", glow: "142,45,226" }, // Deep Purple
  { gradient: "from-[#FF416C] to-[#FF4B2B]", glow: "255,65,108" }, // Red/Orange
  { gradient: "from-[#00B4DB] to-[#0083B0]", glow: "0,153,255" }, // Ocean Blue
  { gradient: "from-[#1D976C] to-[#93F9B9]", glow: "29,151,108" }, // Emerald 
  { gradient: "from-[#B24592] to-[#F15F79]", glow: "241,95,121" }, // Pink
  { gradient: "from-[#4CB8C4] to-[#3CD3AD]", glow: "60,211,173" }, // Teal
  { gradient: "from-[#FF512F] to-[#DD2476]", glow: "221,36,118" }, // Orange to Pink
  { gradient: "from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]", glow: "31,162,255" }, // Sky Blue
  { gradient: "from-[#F09819] to-[#EDDE5D]", glow: "240,152,25" }, // Yellow
  { gradient: "from-[#DA22FF] to-[#9733EE]", glow: "218,34,255" }, // Magenta to Purple
  { gradient: "from-[#34e89e] to-[#0f3443]", glow: "52,232,158" }, // Green to Dark Navy
];

// Individual Skill Card Component
interface IndividualSkillCardProps {
  skill: Skill & { categoryName: string; categoryColor: string };
  categoryColor: string;
  index: number;
  onClick: () => void;
}

function IndividualSkillCard({ skill, index, onClick }: IndividualSkillCardProps) {
  const level = skill.level || 70;
  const getLevelLabel = (level: number) => {
    if (level >= 90) return "Expert level proficiency";
    if (level >= 75) return "Advanced level proficiency";
    if (level >= 50) return "Intermediate level proficiency";
    return "Beginner level proficiency";
  };

  const getLevelEmoji = (level: number) => {
    if (level >= 90) return "\u{1F3C6}"; // Trophy
    if (level >= 75) return "\u2B50"; // Star
    return "";
  };

  // Get unique color palette for this specific card
  const palette = uniqueCardColors[index % uniqueCardColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: (index % 10) * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Outer glow on hover */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: `rgba(${palette.glow}, 0.5)` }}
      />

      {/* Card Container with solid vivid gradient */}
      <div className={`relative w-full h-full rounded-2xl p-5 sm:p-6 overflow-hidden transition-all duration-300 bg-gradient-to-br ${palette.gradient} shadow-lg group-hover:shadow-[0_15px_30px_-10px_rgba(${palette.glow},0.6)]`}>
        
        {/* Curvy overlapping blob shapes using mix-blend-overlay to pick up background colors dynamically */}
        {/* Top-left blob */}
        <div className="absolute top-[-30%] left-[-10%] w-[80%] h-[80%] bg-white/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] mix-blend-overlay group-hover:rotate-12 transition-transform duration-700 pointer-events-none" />
        {/* Bottom-right blob */}
        <div className="absolute bottom-[-40%] right-[-20%] w-[100%] h-[100%] bg-black/10 rounded-[60%_40%_30%_70%/50%_60%_40%_50%] mix-blend-overlay group-hover:-rotate-12 transition-transform duration-700 pointer-events-none" />
        {/* Additional accent curve */}
        <div className="absolute top-[20%] right-[-20%] w-[70%] h-[70%] bg-white/10 rounded-[50%_50%_20%_80%/25%_25%_75%_75%] mix-blend-overlay -rotate-45 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

        {/* Content */}
        <div className="relative flex flex-col items-center text-center z-10 h-full justify-center">
          
          {/* Skill Name */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 leading-tight tracking-tight drop-shadow-md">
            {skill.name}
          </h3>

          {/* Level Label with icon */}
          <p className="text-[11px] sm:text-xs text-white/90 mb-5 flex items-center justify-center gap-1 font-medium drop-shadow-sm">
            {getLevelLabel(level)}
            {getLevelEmoji(level) && <span className="text-[14px] leading-none">{getLevelEmoji(level)}</span>}
          </p>

          {/* Progress Bar */}
          <div className="w-full relative mt-auto">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: (index % 10) * 0.05 + 0.2, ease: "easeOut" }}
                className="h-full bg-white relative rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
            </div>
            {/* Percentage Text below progress bar */}
            <div className="text-[10px] text-white/90 mt-2 font-bold tabular-nums tracking-wide text-center drop-shadow-sm">
              {level}%
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
