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
  getNotifications,
} from "@/firebase/firestore";
import { AvatarProperties, Notification } from "@/interfaces/interfaces";
import { useState, useContext, useEffect } from "react";
import Loading from "@/components/Loading";
import { useLocation } from "react-router-dom";
import Girl from "../assets/cover.svg";
import SimpleGirl from "../assets/girl.svg";
import User from "../assets/user.svg";
import Logout from "../assets/logout.svg";
import Login from "../assets/login.svg";
import Create from "../assets/create.svg";
import Bell from "../assets/bell.svg";
import Search from "../assets/search.svg";
import { auth } from "@/firebase/config";
import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import Crown from "../assets/crown.svg";
import Dot from "../assets/dot.svg";
import Verify from "../assets/verify.svg";
import Users from "../assets/users.svg";
import Cards from "../assets/cards.svg";
import Admin from "../assets/admin.svg";
import UnauthorizedPopup from "./UnauthorizedPopup";

interface NavbarProps {
  allRead?: boolean;
}

type MenuItems = {
  title: string;
  href: string;
  img: string;
};

export default function Navbar ({ allRead }: NavbarProps) {
  const defaultCharacterProperties: AvatarProperties = {
    gender: "man",
    backgroundColor: "#000",
    mouthColor: "#000",
    eyeColor: "#000",
    eyelidsColor: "#000",
    hairColor: "#000",
    skinColor: "#000",
    noseColor: "#000",
    dimensions: "40px",
    bowColor: "transparent",
  };

  const { user, userLoading } = useContext(AuthContext);
  const [unauthorized, setUnauthorized] = useState(false);
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [profileMenuItems, setProfileMenuItems] = useState<MenuItems[]>([]);
  const [success, setSuccess] = useState(false);
  const [authorizedLoading, setAuthorizedLoading] = useState(true);
  const [usernameLoading, setUsernameLoading] = useState(true);
  const [expLoading, setExpLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  const handleLogOut = async () => {
    try {
      await auth.signOut();
      await auth.updateCurrentUser(null);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (!user && !userLoading) {
      setUnauthorized(true);
      setProfileMenuItems([
        {
          title: "Log in",
          href: "/login",
          img: Login,
        },
      ]);
    } else if (user && username && username === "admin") {
      setUnauthorized(false);
      setProfileMenuItems([
        {
          title: "Log out",
          href: "/login",
          img: Logout,
        },
      ]);
    } else if (user) {
      setUnauthorized(false);
      setProfileMenuItems([
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
      ]);
    }
    setAuthorizedLoading(false);
  }, [user, userLoading, username]);

  useEffect(() => {
    if (!user) {
      return; // Exit early if user is not available
      setNotificationsLoading(false);
    }

    const fetchNotifications = async () => {
      try {
        const notificationsFirebase = await getNotifications(user.uid);
        const updatedNotifications = [] as Notification[];

        // Reset notifications array before fetching new data

        for (let key in notificationsFirebase) {
          const notificationData = notificationsFirebase[key];
          const timestamp = key;

          // Check if notification already exists based on timestamp

          // Create a new notification object
          const newNotification = {
            timestamp: key,
            id: notificationData[0],
            message: notificationData[1],
            read: notificationData[2] === "unread" ? false : true,
          };

          // remove existing notification if it exists

          setNotifications((prevNotifications) =>
            prevNotifications.filter((notif) => notif.timestamp !== timestamp)
          );

          updatedNotifications.push(newNotification);
        }

        // Update notifications state only once after processing all notifications
        if (updatedNotifications.length > 0) {
          setNotifications([]);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            ...updatedNotifications,
          ]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setNotificationsLoading(false);
      }
    };

    // Call fetchNotifications when user changes
    fetchNotifications();
  }, [user, location.pathname]);


  useEffect(() => {
    if (!user) {
      setAvatarLoading(false);
      setUsernameLoading(false);
      setExpLoading(false);
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
        setAvatarLoading(false);
      }
    };

    const fetchUsername = async () => {
      try {
        const username = await getUsername(user.uid);
        setUsername(username);
      } catch (error) {
        console.error("Error fetching username:", error);
      } finally {
        setUsernameLoading(false);
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
        setExpLoading(false);
      }
    };

    fetchAvatarProps();
    fetchUsername();
    fetchExp();
  }, [user, location.pathname]);

  useEffect(() => {
    if (
      !userLoading &&
      !avatarLoading &&
      !usernameLoading &&
      !expLoading &&
      !notificationsLoading &&
      !authorizedLoading
    ) {
      setLoading(false);
    }
  }, [
    userLoading,
    avatarLoading,
    usernameLoading,
    expLoading,
    notificationsLoading,
    authorizedLoading,
  ]);

  if (loading && user) {
    return <Loading />;
  }

  return (
    <>
      {unauthorized && (
        <UnauthorizedPopup success={success} setSuccess={setSuccess} />
      )}
      <NavigationMenu className="backdrop-blur-lg fixed bg-transparent shadow-md z-50">
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
        
        {username !== "admin" && (
          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  if (unauthorized) {
                    setSuccess(true);
                  } else {
                    window.location.href = "/create";
                  }
                }}
              >
                <img src={Create} alt="create" className="h-5 w-6" />
                {smallScreen ? "" : "Create"}
              </div>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        {username !== "admin" ? (
          <NavigationMenuList className="mb-1.5 mt-1 flex justify-center items-center">
            <NavigationMenuItem>
              <NavigationMenuTrigger onMouseEnter={() => setAvatarHover(false)}>
                <div className="flex items-center">
                  <img src={Search} alt="discover" className="h-5 w-6" />
                  {smallScreen ? "" : "Search"}
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex justify-center items-center">
                <ul className="grid gap-2 p-4 md:w-[200px] lg:w-[440px] lg:grid-cols-[.80fr_1fr] flex items-center justify-center">
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
                  <ListItem
                    className="cursor-pointer"
                    title="People"
                    onClick={() => {
                      if (unauthorized) {
                        setSuccess(true);
                      } else {
                        window.location.href = "/search/people";
                      }
                    }}
                  >
                    Connect with other study enthusiasts on the platform
                  </ListItem>
                  <ListItem href="/search/flashcards" title="Flashcard Sets">
                    Find flashcard sets based on your interests
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {!unauthorized && (
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Link to="/notifications">
                    <div className="flex items-center">
                      <img src={Bell} alt="notifications" className="h-5 w-6" />
                      {smallScreen ? "" : "Notifications"}
                    </div>
                    {!allRead && notifications.some((notif) => !notif.read) && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          paddingLeft: "7px",
                        }}
                      >
                        <img
                          src={Dot}
                          alt="notifications"
                          className="h-5 w-5"
                        />
                      </div>
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        ) : (
          <NavigationMenuList className="mb-1.5 mt-1 flex justify-center items-center">
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    window.location.href = "/verify";
                  }}
                >
                  <img src={Verify} alt="verify" className="h-6 w-6" />
                  {smallScreen ? "" : "Verify"}
                </div>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    window.location.href = "/search/people";
                  }}
                >
                  <img src={Users} alt="users" className="h-5 w-6" />
                  {smallScreen ? "" : "Users"}
                </div>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem className={navigationMenuTriggerStyle()}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Link to="/search/flashcards">
                  <div className="flex items-center cursor-pointer">
                    <img src={Cards} alt="flashcards" className="h-5 w-6" />
                    {smallScreen ? "" : "Flashcards"}
                  </div>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        )}
        <NavigationMenuItem
          className="flex items-right justify-end absolute"
          style={{ right: "1rem" }}
        >
          <div className="flex flex-col z-10">
            {" "}
            {/* Ensure a higher stacking context for the crown */}
            {window.innerWidth > 700 &&
              !unauthorized &&
              username !== "admin" && (
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
                      {exp % 1000 > 70 && (
                        <Card
                          style={{
                            width: (exp % 1000 / 1000) * 150 + "px",
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
                    {1000 - exp % 1000} EXP to Level {lower / 1000 + 2}
                  </p>
                </div>
              </p>
            )}
          </div>
          <NavigationMenuTrigger onMouseEnter={() => setAvatarHover(true)}>
           { username != "admin" ? (
            <Avatar {...characterProperties} />) : (
            <img src={Admin} alt="admin" className="h-8 w-8" />
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="flex justify-end items-right absolute right-0">
            <ul className="grid w-[500px] gap-3 p-4 md:w-[200px] md:grid-cols-1 lg:w-[160px]">
              {!unauthorized ? (
                <ListItem className="hover:bg-transparent">
                  Signed in as {username}
                </ListItem>
              ) : (
                <ListItem className="hover:bg-transparent">
                  Log in to access your profile
                </ListItem>
              )}
              {profileMenuItems.map((component) => (
                <ListItem
                  img={component.img}
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  onClick={
                    component.href === "/login" ? handleLogOut : undefined
                  }
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
    </>
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
