import type { Metadata } from "next";
import { Inter, Orbitron, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import HydrationSafety from "@/components/ui/HydrationSafety";
import LayoutContent from "@/components/layout/LayoutContent";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import dynamic from "next/dynamic";

const GoogleTranslateWidget = dynamic(
  () => import("@/components/ui/GoogleTranslateWidget"),
  { ssr: false }
);

const AnimatedBackground = dynamic(
  () => import("@/components/ui/AnimatedBackground"),
  { ssr: false }
);

const ParticleField = dynamic(
  () => import("@/components/ui/ParticleField"),
  { ssr: false }
);

import GoogleTranslateFix from "@/components/ui/GoogleTranslateFix";
import { getAllPublicContent } from "@/lib/content";

// Font configurations
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// TODO: Replace with your actual information
export const metadata: Metadata = {
  title: "Your Name - Full Stack Developer Portfolio",
  description: "Personal portfolio showcasing projects, skills, experience, and achievements in software development.",
  keywords: ["portfolio", "web developer", "full stack", "software engineer", "your name"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com",
    title: "Your Name - Full Stack Developer Portfolio",
    description: "Personal portfolio showcasing projects, skills, experience, and achievements.",
    siteName: "Your Name Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Name - Full Stack Developer Portfolio",
    description: "Personal portfolio showcasing projects, skills, experience, and achievements.",
    creator: "@yourusername",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const portfolioContent = await getAllPublicContent();

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${orbitron.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen">
        <HydrationSafety />
        <AnimatedBackground />
        <ParticleField />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange={true}
        >
          <LanguageProvider>
            <GoogleTranslateFix />
            
            <LayoutContent portfolioContent={portfolioContent}>{children}</LayoutContent>
            <GoogleTranslateWidget />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

