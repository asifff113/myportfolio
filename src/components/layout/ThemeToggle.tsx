"use client";

import React, { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  // Avoid hydration mismatch and force dark mode
  useEffect(() => {
    setMounted(true);
    setTheme("dark");
  }, [setTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-2 rounded-lg bg-primary/10">
      <Moon size={20} className="text-primary" />
    </div>
  );
}

