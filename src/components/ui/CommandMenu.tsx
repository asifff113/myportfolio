"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { 
  Calculator, 
  Calendar, 
  CreditCard, 
  Settings, 
  Smile, 
  User,
  Home,
  Briefcase,
  Code,
  Mail,
  FileText,
  Github,
  Linkedin,
  Twitter,
  Moon,
  Sun,
  Laptop
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  // Toggle with Ctrl+K or Cmd+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          
          {/* Command Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
          >
            <Command className="w-full">
              <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                <Calculator className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input 
                  placeholder="Type a command or search..." 
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
                
                <Command.Group heading="Navigation">
                  <Command.Item 
                    onSelect={() => runCommand(() => router.push("/#hero"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => router.push("/#about"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>About Me</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => router.push("/#projects"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Projects</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => router.push("/#skills"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Code className="mr-2 h-4 w-4" />
                    <span>Skills</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => router.push("/blog"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Blog</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => router.push("/#contact"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Contact</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Theme">
                  <Command.Item 
                    onSelect={() => runCommand(() => setTheme("light"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light Mode</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => setTheme("dark"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark Mode</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => setTheme("system"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Laptop className="mr-2 h-4 w-4" />
                    <span>System</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Social">
                  <Command.Item 
                    onSelect={() => runCommand(() => window.open("https://github.com", "_blank"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    <span>GitHub</span>
                  </Command.Item>
                  <Command.Item 
                    onSelect={() => runCommand(() => window.open("https://linkedin.com", "_blank"))}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    <span>LinkedIn</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
              
              <div className="border-t p-2 text-xs text-muted-foreground flex justify-between px-4">
                <span>Pro tip: Use arrows to navigate</span>
                <span>ESC to close</span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
