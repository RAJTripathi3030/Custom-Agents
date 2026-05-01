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

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b w-full">
      <NavigationMenu className="w-full">
        <NavigationMenuList className="w-full">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Agents</NavigationMenuTrigger>
            <NavigationMenuContent className="min-w-47.5">
              {/*{ISO AGENT LINK}
                {WEB SCRAPER AGENT LINK}*/}
              <NavigationMenuLink asChild>
                <Link href="/web-scraper-agent" className="text-2xl">
                  Web-Scraper
                </Link>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              href="https://github.com/RAJTripathi3030/Custom-Agents"
              className="text-xl"
            >
              GitHub
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Link href="/" className="text-xl">
        Hubble
      </Link>
    </nav>
  );
}
