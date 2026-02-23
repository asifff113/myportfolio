"use client";

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Detects if the current viewport is mobile-sized.
 * Also checks for touch-primary devices via pointer: coarse.
 * Returns `null` during SSR / before hydration (unknown).
 */
export default function useIsMobile(): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Check both viewport width and pointer capability
    const mqlWidth = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const mqlTouch = window.matchMedia("(pointer: coarse)");

    const update = () => {
      setIsMobile(mqlWidth.matches || mqlTouch.matches);
    };

    update();

    mqlWidth.addEventListener("change", update);
    mqlTouch.addEventListener("change", update);

    return () => {
      mqlWidth.removeEventListener("change", update);
      mqlTouch.removeEventListener("change", update);
    };
  }, []);

  return isMobile;
}
