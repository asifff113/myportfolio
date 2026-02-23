"use client";

import { useEffect } from "react";

/**
 * HydrationSafety — adds a class to <html> once React hydrates on the client.
 *
 * Combined with a CSS rule in globals.css, this ensures:
 *  • Before JS hydrates: `html:not(.hydrated)` overrides framer-motion's
 *    inline `opacity:0` so content is always visible.
 *  • After JS hydrates: `.hydrated` class is added, the override is removed,
 *    and framer-motion controls animations normally.
 */
export default function HydrationSafety() {
  useEffect(() => {
    document.documentElement.classList.add("hydrated");
  }, []);

  return null;
}
