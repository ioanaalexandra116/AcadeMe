"use client"

import * as React from "react"
import Logo from "../assets/title.svg"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import Avatar from "./Avatar"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Find People",
    href: "/search/people",
    description:
      "Connect with other study enthusiasts",
  },
  {
    title: "Find Flashcard Sets",
    href: "/search/flashcards",
    description:
      "Discover flashcard sets created by other users",
  },
]

export default function Navbar() {
  return (
    <NavigationMenu className="backdrop-blur-lg fixed z-50 bg-transparent shadow-md">
      <NavigationMenuItem className="flex justify-start items-left absolute left-0">
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <img src={Logo} alt="logo" className="h-8 w-24" />
          </NavigationMenuLink>
        </NavigationMenuItem>
      <NavigationMenuList className="mb-2 mt-2 flex justify-center items-center">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent className="flex justify-center items-center">
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Search</NavigationMenuTrigger>
          <NavigationMenuContent className="flex justify-center items-center">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] flex items-center justify-center">
              {components.map((component) => (
                <ListItem className="flex items-center justify-center"
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuItem className="flex items-right justify-end absolute right-0">
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <img src={Logo} alt="logo" className="h-8 w-24" />
          </NavigationMenuLink>
        </NavigationMenuItem>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(

            "flex items-center justify-center block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
