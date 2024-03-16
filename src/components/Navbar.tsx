import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const search = [
  {
    title: "Find Flashcard Sets",
    href: "/serach/flashcard-sets",
    description: "Search for flashcard sets created by other users",
  },
  {
    title: "Find People",
    href: "/search/people",
    description: "Connect with other study enthusiasts",
  },
];

const Navbar = () => {
  const location = useLocation(); // Get the current location
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4 justify-center">
            <NavigationMenu className="flex items-center">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/">Dashboard</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/profile">Profile</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/create">Create</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    onClick={toggleMenu}
                    className="cursor-pointer text-#9B7960 hover:text-#9B7960 focus:outline-none focus:text-#9B7960"
                  >
                    Search
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {search.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                          isActive={location.pathname === component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { isActive?: boolean } // Add isActive prop
>(({ className, title, children, isActive, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            {
              "font-bold bg-white": isActive,
              "hover:bg-accent focus:bg-accent focus:text-#9B7960": !isActive,
            },
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-1 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
export default Navbar;
