"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide navbar and footer on admin and auth pages
  const isAdminOrAuth = pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAdminOrAuth && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdminOrAuth && <Footer />}
    </div>
  );
}
