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
import Avatar from "@/components/Avatar";
import {
  getAvatarProps,
  getUsername,
  getExp,
  getCategories,
  getSecondCategories,
} from "@/firebase/firestore";
import { AvatarProperties } from "@/interfaces/interfaces";
import { useState, useContext, useEffect } from "react";
import Loading from "@/components/Loading";
import { useLocation } from "react-router-dom";
import Girl from "../assets/cover.svg";
import SimpleGirl from "../assets/girl.svg";
import User from "../assets/user.svg";
import Logout from "../assets/logout.svg";
import Create from "../assets/create.svg";
import Categs from "../assets/hierarchy.svg";
import Search from "../assets/search.svg";
import { auth } from "@/firebase/config";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import Crown from "../assets/crown.svg";

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
    dimensions: "40px",
    bowColor: "transparent",
  };

  const { user, userLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [avatarHover, setAvatarHover] = useState(false);
  const location = useLocation();
  const [characterProperties, setCharacterProperties] =
    useState<AvatarProperties>(defaultCharacterProperties);
  const [username, setUsername] = useState("");
  const [exp, setExp] = useState(0);
  const smallScreen = window.innerWidth < 700;
  const [lower, setLower] = useState(0);
  const [levelHovered, setLevelHovered] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[][]>([]) || [];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [secondSelectedCategory, setSecondSelectedCategory] = useState<
    string | null
  >(null);
  const [components, setComponents] = useState<
    { title: string; href: string; subcategories: string[][] }[] | []
  >([]);
  const [currentComponent, setCurrentComponent] = useState<{
    title: string;
    href: string;
    subcategories: string[][];
  } | null>(null);
  const [showSubcategs, setShowSubcategs] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
        console.log(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        await Promise.all(
          categories.map(async (category) => {
            const secondCategories = await getSecondCategories(category);

            // Update state for subcategories
            setSubcategories(secondCategories || []);
            console.log(secondCategories);

            // Find or create the component
            const existingComponent = components.find(
              (component) => component.title === category
            );

            if (existingComponent) {
              // Update the existing component
              existingComponent.subcategories = secondCategories || [];
            }

            if (!existingComponent) {
              // Create a new component
              const newComponent = {
                title: category,
                href: `/search/${category}`,
                subcategories: secondCategories || [],
              };

              // Update state with the new component
              setComponents((prev) => [...prev, newComponent]);
            }
          })
        );
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [categories]);

  useEffect(() => {
    const printBiology = () => {
      console.log(components);
    };

    printBiology();
  }, [components]);

  // const components: { title: string; href: string, subcategories?: string[] }[] = [
  //   categories.map((category) => {
  //     return { title: category, href: `/search/${category}`, subcategories: subcategories[0] };
  //   }),
  // ].flat();

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

  const profileMenuItems: { title: string; href: string; img: string }[] = [
    {
      title: "Profile",
      href: `/profile?userId=${user.uid}`,
      img: User,
    },
    {
      title: "Log out",
      href: "/login",
      img: Logout,
    },
  ];

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

    const fetchExp = async () => {
      try {
        const exp = await getExp(user.uid);
        setExp(exp);
        setLower(Math.floor(exp / 1000) * 1000);
      } catch (error) {
        console.error("Error fetching exp:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarProps();
    fetchUsername();
    fetchExp();
  }, [user, location.pathname]);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationMenu className="backdrop-blur-lg fixed z-50 bg-transparent shadow-md">
      <NavigationMenuItem className="flex justify-start items-left absolute left-0">
        <Link to="/">
          {!smallScreen ? (
            <img
              src={Logo}
              alt="logo"
              className="h-8 w-24"
              style={{ marginLeft: "1.5rem" }}
            />
          ) : (
            <img
              src={SimpleGirl}
              alt="logo"
              className="h-10 w-10"
              style={{ marginLeft: "1.5rem" }}
            />
          )}
        </Link>
      </NavigationMenuItem>
      <NavigationMenuList className="mb-1.5 mt-1 flex justify-center items-center">
        <NavigationMenuItem>
          <NavigationMenuTrigger onMouseEnter={() => setAvatarHover(false)}>
            <div className="flex items-center">
              <img src={Search} alt="search" className="h-5 w-5" />
              {smallScreen ? "" : "Search"}
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="flex justify-center items-center">
            <ul className="grid gap-2 p-4 md:w-[200px] lg:w-[500px] lg:grid-cols-[.80fr_1fr] flex items-center justify-center">
              <li className="row-span-2 flex justify-center items-center">
                <NavigationMenuLink asChild className="bg-blue-400">
                  <div className="flex items-center justify-center select-none flex-col justify-end rounded-xl bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md">
                    <img
                      src={Girl}
                      alt="girl"
                      sizes="400vw"
                      className="h-44 w-80"
                    />
                  </div>
                </NavigationMenuLink>
              </li>
              <ListItem href="/search/users" title="People">
                Connect with other study enthusiasts on the platform
              </ListItem>
              <ListItem href="/search/flascards" title="Flashcard sets">
                Search for flashcard sets created by other users
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger onMouseEnter={() => setAvatarHover(false)}>
            <div className="flex items-center">
              <img src={Categs} alt="categories" className="h-5 w-7" />
              {smallScreen ? "" : "Categories"}
            </div>
          </NavigationMenuTrigger>
          <div className="flex justify-space-between items-center">
          <NavigationMenuContent className="flex justify-center items-center">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[280px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  onMouseEnter={() => {
                    setSelectedCategory(component.title);
                    setCurrentComponent(component);
                    setShowSubcategs(true);
                  }}
                ></ListItem>
              ))}
            </ul>
            {currentComponent && (
              <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[280px] top-0">
                {Object.entries(currentComponent.subcategories).map(
                  ([key, value]) => (
                    <ListItem
                      key={key}
                      title={key}
                      href={`/search/${currentComponent.title}/${key}`}
                      onMouseEnter={() => setSecondSelectedCategory(key)}
                    >
                      {secondSelectedCategory === key && (
                        <ul className="grid gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[280px]">
                          {value.map((subcat) => (
                            <ListItem
                              key={subcat}
                              title={subcat}
                              href={`/search/${currentComponent.title}/${key}/${subcat}`}
                            ></ListItem>
                          ))}
                        </ul>
                      )}
                    </ListItem>
                  )
                )}
              </ul>
            )}
          </NavigationMenuContent>
          </div>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Link to="/create">
              <div className="flex items-center">
                <img src={Create} alt="create" className="h-5 w-6 rotate-90" />
                {smallScreen ? "" : "Create"}
              </div>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuItem
        className="flex items-right justify-end absolute"
        style={{ right: "1rem" }}
      >
        <div className="flex flex-col z-10">
          {" "}
          {/* Ensure a higher stacking context for the crown */}
          {window.innerWidth > 700 && (
            <div className="flex flex-row justify-center items-center z-10">
              {" "}
              {/* Ensure a higher stacking context for the crown */}
              <div className="relative top-1 left-3 z-20">
                {" "}
                {/* Higher z-index for the crown */}
                <img src={Crown} className="h-5 w-5 z-20" />{" "}
                {/* Higher z-index for the crown */}
              </div>
              <div className="flex flex-col">
                <Card
                  onMouseEnter={() => setLevelHovered(true)}
                  onMouseLeave={() => setLevelHovered(false)}
                  style={{
                    width: "150px",
                    height: "10px",
                    backgroundColor: "#fff",
                    zIndex: 10,
                    borderRight: "1px solid black",
                    borderTop: "1px solid black",
                    borderBottom: "1px solid black",
                    cursor: "pointer",
                  }}
                  className="flex items-center justify-start mt-4 z-10"
                >
                  {exp && (
                    <Card
                      style={{
                        width: (exp / 1000) * 150 + "px",
                        height: "10px",
                        backgroundColor: "#D09FDE",
                        zIndex: 10,
                      }}
                      className="flex justify-center items-center border border-black z-10"
                    ></Card>
                  )}
                </Card>
              </div>
            </div>
          )}
          {levelHovered && (
            <p
              style={{
                zIndex: 10,
                height: "1px",
              }}
              className="text-xs flex relative justify-center items-center mt-2 mb-1 ml-3"
            >
              <div className="flex justify-center items-center">
                <p className="text-xs text-center">
                  {1000 - exp} EXP to Level 2
                </p>
              </div>
            </p>
          )}
        </div>
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
  React.ElementRef<"a"> & { img?: string },
  React.ComponentPropsWithoutRef<"a"> & { img?: string }
>(({ className, title, children, img, ...props }, ref) => {
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
