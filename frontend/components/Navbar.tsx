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
    <nav
      className="flex items-center justify-between px-6 py-3 border-b w-full"
    >
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Agents</NavigationMenuTrigger>
            <NavigationMenuContent>
              {/*{ISO AGENT LINK}
                {WEB SCRAPER AGENT LINK}*/}
              <NavigationMenuLink asChild>
                <Link href="/docs" className="text-2xl">Agent-1</Link>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/" className="text-xl">GitHub</Link> 
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
