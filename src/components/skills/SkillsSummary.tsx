"use client";

import { motion } from "framer-motion";
import { Code2, Star, Layers, TrendingUp } from "lucide-react";

interface SkillsSummaryProps {
  stats: {
    total: number;
    primary: number;
    categories: number;
    maxExperience: number;
    expertCount: number;
    advancedCount: number;
  };
}

export default function SkillsSummary({ stats }: SkillsSummaryProps) {
  const summaryItems = [
    {
      icon: Code2,
      label: "Total Skills",
      value: stats.total,
      color: "text-blue-500",
    },
    {
      icon: Star,
      label: "Expert Level",
      value: stats.expertCount,
      color: "text-emerald-500",
    },
    {
      icon: Layers,
      label: "Categories",
      value: stats.categories,
      color: "text-purple-500",
    },
    {
      icon: TrendingUp,
      label: "Years Experience",
      value: `${stats.maxExperience}+`,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {summaryItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-4 rounded-xl text-center hover:scale-105 transition-transform"
          >
            <div className={`inline-flex p-3 rounded-lg bg-background/50 mb-2 ${item.color}`}>
              <Icon size={24} />
            </div>
            <div className="text-2xl font-bold mb-1">{item.value}</div>
            <div className="text-xs text-muted-foreground">{item.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

