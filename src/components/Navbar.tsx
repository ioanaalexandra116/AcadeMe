"use client";

import * as React from "react";
import Logo from "../assets/title.svg";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import { AuthContext } from "@/context";

import { AvatarUI, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Avatar from "@/components/Avatar";
import { getAvatarProps } from "@/firebase/firestore";
import { AvatarProperties } from "@/interfaces/interfaces";
import { useState, useContext, useEffect } from "react";
import Loading from "@/components/Loading";
import { useLocation } from "react-router-dom";
import Girl from "../assets/main-logo.svg";
import { auth } from "@/firebase/config";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "People",
    href: "/search/people",
    description: "Search for other users on the platform",
  },
  {
    title: "Flashcard Sets",
    href: "/search/flashcards",
    description: "Search for flashcard sets created by other users",
  },
];

const profileMenuItems: { title: string; href: string }[] = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Log out",
    href: "/login",
  },
];

export default function Navbar() {
  const defaultCharacterProperties: AvatarProperties = {
    gender: "man",
    backgroundColor: "rgb(164,222,247)",
    mouthColor: "rgb(224,134,114)",
    eyeColor: "rgb(102,78,39)",
    eyelidsColor: "rgb(12,10,9)",
    hairColor: "rgb(89,70,64)",
    skinColor: "rgb(255,225,189)",
    noseColor: "rgb(230,183,150)",
    dimensions: "300px",
    bowColor: "transparent",
  };

  const { user, userLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [avatarHover, setAvatarHover] = useState(false);
  const location = useLocation();
  const [characterProperties, setCharacterProperties] =
    useState<AvatarProperties>(defaultCharacterProperties);
  const handleLogOut = async () => {
    try {
      await auth.signOut();
      await auth.updateCurrentUser(null);
    } catch (error) {
      alert(error);
    }
  };

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchAvatarProps = async () => {
      try {
        const avatarProps = await getAvatarProps(user.uid);
        if (avatarProps) {
          avatarProps.dimensions = "40px";
          setCharacterProperties(avatarProps);
        }
      } catch (error) {
        console.error("Error fetching avatar properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarProps();
  }, [user, location.pathname]);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationMenu className="backdrop-blur-lg fixed z-50 bg-transparent shadow-md">
      <NavigationMenuItem className="flex justify-start items-left absolute left-0">
        <a href="/">
          <img src={Logo} alt="logo" className="h-8 w-24 ml-12" />
        </a>
      </NavigationMenuItem>
      <NavigationMenuList className="mb-1.5 mt-1 flex justify-center items-center">
        <NavigationMenuItem>
          <NavigationMenuTrigger onMouseEnter={() => setAvatarHover(false)}>
            Discover
          </NavigationMenuTrigger>
          <NavigationMenuContent className="flex justify-center items-center">
            <ul className="grid gap-2 p-4 md:w-[200px] lg:w-[500px] lg:grid-cols-[.80fr_1fr] flex items-center justify-center">
              <li className="row-span-2 flex justify-center items-center">
                <NavigationMenuLink asChild>
                  <a className="flex items-center justify-center select-none flex-col justify-end rounded-xl bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md">
                    <img src={Girl} alt="girl" />
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/discover/friends" title="New Friends">
                Connect with other study enthusiasts sharing similar interests
              </ListItem>
              <ListItem
                href="/discover/flascards"
                title="New Flashcard Sets"
              >
                Find flashcard sets recommended for you based on your favorite
                ones
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger onMouseEnter={() => setAvatarHover(false)}>
            Search
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[280px]">
              {components.map((component) => (
                <ListItem
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
            <a href="/create">Create</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      {/* <AvatarUI className="flex items-right justify-end absolute right-4">
            <AvatarImage Avatar fallback={<AvatarFallback>SH</AvatarFallback>} />
            <AvatarFallback>CN</AvatarFallback>
          </AvatarUI> */}
      {/* <NavigationMenuItem className="flex justify-end items-end"> */}
      <NavigationMenuItem className="flex items-right justify-end absolute right-12">
        <NavigationMenuTrigger onMouseEnter={() => setAvatarHover(true)}>
          <Avatar {...characterProperties} />
        </NavigationMenuTrigger>
        <NavigationMenuContent className="flex justify-end items-right absolute right-0">
          <ul className="grid w-[100px] gap-3 p-4 md:w-[200px] md:grid-cols-1 lg:w-[175px]">
            <ListItem className="hover:bg-transparent">
              Signed in as alex
            </ListItem>
            {profileMenuItems.map((component) => (
              <ListItem
                key={component.title}
                title={component.title}
                href={component.href}
                onClick={component.href === "/login" ? handleLogOut : undefined}
              ></ListItem>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      {avatarHover ? (
        <NavigationMenuViewport
          className={cn(
            "flex justify-end items-right absolute right-3 top-full"
          )}
        />
      ) : (
        <NavigationMenuViewport
          className={cn("absolute top-full flex justify-center")}
        />
      )}
    </NavigationMenu>
  );
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
            "block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
  );
});
ListItem.displayName = "ListItem";
