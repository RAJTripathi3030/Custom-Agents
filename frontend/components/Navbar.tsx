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
    <nav className="flex items-center justify-between px-4 md:px-6 py-3 border-b w-full">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm md:text-base">Agents</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-[200px] p-2">
              <NavigationMenuLink asChild>
                <Link href="/web-scraper-agent" className="block px-3 py-2 text-sm md:text-base rounded hover:bg-muted transition-colors">
                  Web-Scraper
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link href="/iso-agent" className="block px-3 py-2 text-sm md:text-base rounded hover:bg-muted transition-colors">
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
              className="text-sm md:text-base px-2 py-1"
            >
              GitHub
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />
        <Link href="/" className="text-base md:text-xl font-semibold">
          Hubble
        </Link>
      </div>
    </nav>
  );
}
