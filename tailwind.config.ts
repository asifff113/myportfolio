import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Multi-spectrum section colors
        spectrum: {
          hero: { primary: "#3B82F6", secondary: "#06B6D4" },
          about: { primary: "#F59E0B", secondary: "#EAB308" },
          skills: { primary: "#10B981", secondary: "#14B8A6" },
          education: { primary: "#6366F1", secondary: "#8B5CF6" },
          experience: { primary: "#3B82F6", secondary: "#64748B" },
          projects: { primary: "#F97316", secondary: "#FB7185" },
          achievements: { primary: "#EAB308", secondary: "#F59E0B" },
          certificates: { primary: "#06B6D4", secondary: "#0EA5E9" },
          gallery: { primary: "#F43F5E", secondary: "#EC4899" },
          hobbies: { primary: "#84CC16", secondary: "#22C55E" },
          goals: { primary: "#A855F7", secondary: "#D946EF" },
          blog: { primary: "#14B8A6", secondary: "#10B981" },
          testimonials: { primary: "#FB923C", secondary: "#FDBA74" },
          guestbook: { primary: "#38BDF8", secondary: "#A78BFA" },
          contact: { primary: "#EF4444", secondary: "#FB7185" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-orbitron)", "Orbitron", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-light": "linear-gradient(135deg, #f5f0ff 0%, #eef6ff 50%, #fef5f0 100%)",
        "gradient-mesh": "radial-gradient(at 40% 20%, hsla(270, 80%, 76%, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 80%, 56%, 0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 0.08) 0px, transparent 50%)",
      },
      animation: {
        "slide-up": "slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-down": "slideDown 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        "glow": "glow 3s ease-in-out infinite alternate",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(var(--section-rgb, 99, 102, 241), 0.15)" },
          "100%": { boxShadow: "0 0 25px rgba(var(--section-rgb, 99, 102, 241), 0.3)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
