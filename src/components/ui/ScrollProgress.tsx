"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Futuristic scroll progress bar at the very top of the viewport.
 * Animated gradient that fills as user scrolls down.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-500"
    />
  );
}
