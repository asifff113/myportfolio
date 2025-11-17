import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${orbitron.variable}`}>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange={false}
        >
          {/* Global Animated Background */}
          <AnimatedBackground variant="hero" />
          
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

