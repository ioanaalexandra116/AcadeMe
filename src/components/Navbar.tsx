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
import { getAvatarProps, getUsername } from "@/firebase/firestore";
import { AvatarProperties } from "@/interfaces/interfaces";
import { useState, useContext, useEffect } from "react";
import Loading from "@/components/Loading";
import { useLocation } from "react-router-dom";
import Girl from "../assets/cover.svg";
import SimpleGirl from "../assets/girl.svg";
import User from "../assets/user.svg";
import Logout from "../assets/logout.svg";
import Create from "../assets/create.svg";
import Discover from "../assets/discover.svg";
import Search from "../assets/search.svg";
import { auth } from "@/firebase/config";
import {Link} from "react-router-dom";

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

const profileMenuItems: { title: string; href: string; img: string }[] = [
  {
    title: "Profile",
    href: "/profile",
    img: User,
  },
  {
    title: "Log out",
    href: "/login",
    img: Logout,
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
  const [username, setUsername] = useState("");
  const smallScreen = window.innerWidth < 700;

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

    const fetchUsername = async () => {
      try {
        const username = await getUsername(user.uid);
        setUsername(username);
      } catch (error) {
        console.error("Error fetching username:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarProps();
    fetchUsername();
  }, [user, location.pathname]);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationMenu className="backdrop-blur-lg fixed z-50 bg-transparent shadow-md">
      <NavigationMenuItem className="flex justify-start items-left absolute left-0">
        <Link to="/">
          {!smallScreen ? (
          <img src={Logo} alt="logo" className="h-8 w-24"
          style={{marginLeft: "1.5rem"}} />)
          :
          <img src={SimpleGirl} alt="logo" className="h-10 w-10"
          style={{marginLeft: "1.5rem"}} />
          }
          
        </Link>
      </NavigationMenuItem>
      <NavigationMenuList className="mb-1.5 mt-1 flex justify-center items-center">
        <NavigationMenuItem>
          <NavigationMenuTrigger onMouseEnter={() => setAvatarHover(false)}>
            <div className="flex items-center">
              <img src={Discover} alt="discover" className="h-5 w-6" />
              {smallScreen ? "" : "Discover"}
            </div>
          </NavigationMenuTrigger >
          <NavigationMenuContent className="flex justify-center items-center">
            <ul className="grid gap-2 p-4 md:w-[200px] lg:w-[500px] lg:grid-cols-[.80fr_1fr] flex items-center justify-center">
              <li className="row-span-2 flex justify-center items-center">
                <NavigationMenuLink asChild className="bg-blue-400">
                  <div className="flex items-center justify-center select-none flex-col justify-end rounded-xl bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md">
                    <img src={Girl} alt="girl" sizes="400vw" className="h-48 w-80" />
                  </div>
                </NavigationMenuLink>
              </li>
              <ListItem href="/discover/friends" title="New Friends">
                Connect with other study enthusiasts sharing similar interests
              </ListItem>
              <ListItem href="/discover/flascards" title="New Flashcard Sets">
                Find flashcard sets recommended for you based on your favorite
                ones
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger onMouseEnter={() => setAvatarHover(false)}>
            <div className="flex items-center">
              <img src={Search} alt="create" className="h-5 w-5" />
              {smallScreen ? "" : "Search"}
            </div>
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
            <Link to="/create">
              <div className="flex items-center">
                <img src={Create} alt="create" className="h-5 w-5 rotate-90" />
                {smallScreen ? "" : "Create"}
              </div>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      {/* <AvatarUI className="flex items-right justify-end absolute right-4">
            <AvatarImage Avatar fallback={<AvatarFallback>SH</AvatarFallback>} />
            <AvatarFallback>CN</AvatarFallback>
          </AvatarUI> */}
      {/* <NavigationMenuItem className="flex justify-end items-end"> */}
      <NavigationMenuItem className="flex items-right justify-end absolute"
      style={{right: "1rem"}}
      >
        <NavigationMenuTrigger onMouseEnter={() => setAvatarHover(true)}>
          <Avatar {...characterProperties} />
        </NavigationMenuTrigger>
        <NavigationMenuContent className="flex justify-end items-right absolute right-0">
          <ul className="grid w-[500px] gap-3 p-4 md:w-[200px] md:grid-cols-1 lg:w-[160px]">
            <ListItem className="hover:bg-transparent">
              Signed in as {username}
            </ListItem>
            {profileMenuItems.map((component) => (
              <ListItem
                img={component.img}
                key={component.title}
                title={component.title}
                href={component.href}
                onClick={component.href === "/login" ? handleLogOut : undefined}
              ></ListItem>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      {avatarHover && !smallScreen ? (
        <NavigationMenuViewport
          className={cn(
            "flex justify-end items-right absolute right-7 top-full"
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
  React.ElementRef<"a"> & { img?: string }, // Add the img field to the props
  React.ComponentPropsWithoutRef<"a"> & { img?: string } // Also include img in the type definition
>(({ className, title, children, img, ...props }, ref) => {
  // Destructure img from props
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
          {img ? (
            <div>
              <div className="flex items-center justify-center">
                <img src={img} alt={title} className="h-5 w-5" />
                &nbsp;
                <div className="text-sm font-medium leading-none">{title}</div>
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});

// Change the displayName
ListItem.displayName = "CustomListItem";
