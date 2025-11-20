"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Terminal, Briefcase, Sunset } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Moods</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => {
          document.documentElement.setAttribute('data-theme', 'hacker');
          setTheme("dark");
        }}>
          <Terminal className="mr-2 h-4 w-4 text-green-500" /> Hacker
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => {
          document.documentElement.setAttribute('data-theme', 'corporate');
          setTheme("light");
        }}>
          <Briefcase className="mr-2 h-4 w-4 text-blue-500" /> Corporate
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => {
          document.documentElement.setAttribute('data-theme', 'sunset');
          setTheme("dark");
        }}>
          <Sunset className="mr-2 h-4 w-4 text-orange-500" /> Sunset
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => {
          document.documentElement.removeAttribute('data-theme');
          setTheme("dark");
        }}>
          <span className="mr-2 h-4 w-4 flex items-center justify-center text-purple-500">✨</span> Default
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

