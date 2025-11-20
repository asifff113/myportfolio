"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CommandMenu } from "@/components/ui/CommandMenu";
import CustomCursor from "@/components/ui/CustomCursor";
import ChatWidget from "@/components/ui/ChatWidget";

import { PortfolioContent } from "@/lib/content-types";

export default function LayoutContent({ children, portfolioContent }: { children: React.ReactNode, portfolioContent: PortfolioContent }) {
  const pathname = usePathname();
  
  // Hide navbar and footer on admin and auth pages
  const isAdminOrAuth = pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  return (
    <div className="relative flex min-h-screen flex-col">
      <CustomCursor />
      <CommandMenu />
      {!isAdminOrAuth && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdminOrAuth && <Footer />}
      {!isAdminOrAuth && <ChatWidget content={portfolioContent} />}
    </div>
  );
}
