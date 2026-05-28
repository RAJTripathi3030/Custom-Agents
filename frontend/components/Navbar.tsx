"use client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="navbar-glass sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 w-full">
      {/* ── Brand (left) ── */}
      <Link href="/" className="text-base md:text-xl font-semibold shrink-0">
        Hubble
      </Link>

      {/* ── Nav links (center) ── */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm md:text-base">
              Agents
            </NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[200px] p-2">
              <NavigationMenuLink asChild>
                <Link
                  href="/web-scraper-agent"
                  className="flex items-center gap-2 px-3 py-2 text-sm md:text-base rounded hover:bg-muted transition-colors"
                >
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Active
                  </span>
                  Web Scraper
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/iso-agent"
                  className="flex items-center gap-2 px-3 py-2 text-sm md:text-base rounded hover:bg-muted transition-colors"
                >
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Active
                  </span>
                  ISO Agent
                </Link>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              href="https://github.com/RAJTripathi3030/Custom-Agents"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* ── Actions (right) ── */}
      <ThemeToggle />
    </nav>
  );
}
