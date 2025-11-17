"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Filter } from "lucide-react";
import { SkillCategory } from "@/lib/content-types";

interface SkillsSearchFilterProps {
  categories: SkillCategory[];
  onSearchChange: (query: string) => void;
  onCategoryFilter: (category: string | null) => void;
  onProficiencyFilter: (proficiency: string | null) => void;
}

export default function SkillsSearchFilter({
  categories,
  onSearchChange,
  onCategoryFilter,
  onProficiencyFilter,
}: SkillsSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>("All");
  const [activeProficiency, setActiveProficiency] = useState<string | null>("All");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleCategoryClick = (category: string) => {
    const newCategory = category === activeCategory ? "All" : category;
    setActiveCategory(newCategory);
    onCategoryFilter(newCategory === "All" ? null : newCategory);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchChange("");
  };

  const filterOptions = [
    "All",
    "Core",
    ...categories.map((cat) => cat.name),
  ];

  const proficiencyOptions = ["All", "Expert", "Advanced", "Intermediate"];

  return (
    <div className="mb-12 space-y-6">
      {/* Search Bar - ENHANCED BEAUTIFUL STYLE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="glass-ultra p-2 rounded-2xl border-2 border-white/10 group-focus-within:border-white/30 transition-all shadow-xl relative overflow-hidden">
          {/* Wave background on focus */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30"
          >
            <Search
              size={24}
              className="text-blue-300"
            />
          </motion.div>
          <input
            type="text"
            placeholder="Search skills by name or description..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-20 pr-16 py-4 bg-transparent text-lg font-medium text-white placeholder:text-gray-400 focus:outline-none relative z-10"
          />
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={clearSearch}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-400/30 transition-all"
            >
              <X size={20} className="text-red-300" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Filter Toggle Button (Mobile) */}
      <div className="md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-primary/10 transition-colors"
        >
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Chips */}
      <AnimatePresence>
        {(showFilters || window.innerWidth >= 768) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Category Filters - ENHANCED */}
            <div>
              <div className="text-base text-gray-400 mb-4 font-bold uppercase tracking-wide">
                Category
              </div>
              <div className="flex flex-wrap gap-3">
                {filterOptions.map((option, idx) => {
                  const isActive = activeCategory === option;
                  const filterGradients = [
                    "from-blue-500 to-cyan-500",
                    "from-purple-500 to-pink-500",
                    "from-green-500 to-emerald-500",
                    "from-orange-500 to-red-500",
                    "from-indigo-500 to-purple-500",
                    "from-pink-500 to-rose-500",
                    "from-teal-500 to-cyan-500",
                    "from-amber-500 to-yellow-500",
                  ];
                  const gradient = filterGradients[idx % filterGradients.length];
                  
                  return (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryClick(option)}
                      className={`px-5 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden shadow-lg ${
                        isActive
                          ? `bg-gradient-to-r ${gradient} text-white border-2 border-white/30`
                          : "glass-ultra border-2 border-white/10 hover:border-white/20 text-gray-300"
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-1">
                        {option}
                        {option === "Core" && <span className="text-base">⚡</span>}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeCategory"
                          className="absolute inset-0 bg-white/20 animate-pulse"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Proficiency Filters - ENHANCED WITH ACTIVE STATE */}
            <div>
              <div className="text-base text-gray-400 mb-4 font-bold uppercase tracking-wide">
                Proficiency Level
              </div>
              <div className="flex flex-wrap gap-3">
                {proficiencyOptions.map((option, idx) => {
                  const isActive = activeProficiency === option;
                  const levelGradients = [
                    { gradient: "from-gray-500 to-slate-500", icon: "📊" },
                    { gradient: "from-yellow-500 to-amber-500", icon: "⭐" },
                    { gradient: "from-blue-500 to-indigo-500", icon: "🚀" },
                    { gradient: "from-green-500 to-emerald-500", icon: "🌟" },
                  ];
                  const config = levelGradients[idx % levelGradients.length];
                  
                  return (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const newProf = option === activeProficiency ? "All" : option;
                        setActiveProficiency(newProf);
                        onProficiencyFilter(option === "All" ? null : option);
                      }}
                      className={`px-5 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden shadow-lg ${
                        isActive
                          ? `bg-gradient-to-r ${config.gradient} text-white border-2 border-white/30`
                          : "glass-ultra border-2 border-white/10 hover:border-white/20 text-gray-300"
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span className="text-base">{config.icon}</span>
                        {option}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeProficiency"
                          className="absolute inset-0 bg-white/20 animate-pulse"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {(searchQuery || activeCategory !== "All") && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {searchQuery && (
            <span className="px-2 py-1 bg-primary/10 rounded">
              Search: "{searchQuery}"
            </span>
          )}
          {activeCategory && activeCategory !== "All" && (
            <span className="px-2 py-1 bg-primary/10 rounded">
              Category: {activeCategory}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

