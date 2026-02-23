"use client";

import { useRef, useState, MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: "low" | "medium" | "high";
  enableTilt?: boolean;
  enableGlow?: boolean;
  onClick?: () => void;
}

export default function Card3D({
  children,
  className,
  glowColor = "primary",
  intensity = "medium",
  enableTilt = true,
  enableGlow = true,
  onClick,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  const intensityMap = {
    low: 5,
    medium: 10,
    high: 15,
  };

  const maxRotation = intensityMap[intensity];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation
    const rotateXValue = ((y - centerY) / centerY) * -maxRotation;
    const rotateYValue = ((x - centerX) / centerX) * maxRotation;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);

    // Calculate glow position
    const glowXPercent = (x / rect.width) * 100;
    const glowYPercent = (y / rect.height) * 100;
    setGlowX(glowXPercent);
    setGlowY(glowYPercent);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlowX(50);
    setGlowY(50);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: enableTilt
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
          : undefined,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-2xl transition-all duration-400 ease-out will-change-transform",
        "glass-ultra holographic",
        enableGlow && "hover:shadow-[0_30px_60px_-20px_rgba(var(--section-rgb),0.30)]",
        onClick && "cursor-pointer",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect */}
      {enableGlow && (
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(var(--${glowColor}-rgb), 0.22) 0%, rgba(var(--${glowColor}-rgb), 0.08) 28%, transparent 62%)`,
          }}
        />
      )}

      {/* Content */}
      <div
        className="relative z-10"
        style={{
          transform: "translateZ(20px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>

      {/* Shine effect on hover */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none overflow-hidden"
        style={{
          background: `linear-gradient(135deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.06) ${glowX - 20}%, 
            rgba(255, 255, 255, 0.12) ${glowX}%, 
            rgba(255, 255, 255, 0.05) ${glowX + 20}%, 
            transparent 100%)`,
        }}
      />
    </motion.div>
  );
}

