import { useEffect, useState, useContext } from "react";
import { Notification, AvatarProperties } from "@/interfaces/interfaces";
import {
  getNotifications,
  getUsername,
  getAvatarProps,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/firebase/firestore";
import { AuthContext } from "@/context";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";
import Loader from "./Loader";
import Admin from "@/assets/admin.svg";
import { Card } from "./ui/card";
import Avatar from "./Avatar";
import { Button } from "./ui/button";

export const NotificationsList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCursor, setLoadingCursor] = useState(false);
  const [avatarsLoading, setAvatarsLoading] = useState(true);
  const { user, userLoading } = useContext(AuthContext);
  const [usersAvatarProps, setUsersAvatarProps] = useState<AvatarProperties[]>(
    []
  );
  const [usernames, setUsernames] = useState<string[]>([]);
  const [allRead, setAllRead] = useState(false);
  const location = useLocation();

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchNotifications = async () => {
      try {
        const notificationsFirebase = await getNotifications(user.uid);
        const updatedNotifications = [] as Notification[];

        for (let key in notificationsFirebase) {
          const notificationData = notificationsFirebase[key];
          const timestamp = key;

          const existingNotification = notifications.find(
            (notif) => notif.timestamp === timestamp
          );

          if (!existingNotification) {
            const newNotification = {
              timestamp: key,
              id: notificationData[0],
              message: notificationData[1],
              read: notificationData[2] === "unread" ? false : true,
            };

            updatedNotifications.push(newNotification);
          }
        }

        if (updatedNotifications.length > 0) {
          setNotifications([]);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            ...updatedNotifications,
          ]);
        }

        // sort by timestamp in descending order
        setNotifications((prevNotifications) =>
          prevNotifications.sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime(); // Get timestamp in milliseconds
            const dateB = new Date(b.timestamp).getTime(); // Get timestamp in milliseconds
            return dateB - dateA; // Sort in descending order (latest first)
          })
        );
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user, location.pathname]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchUsersDetails = async () => {
      try {
        const users = await Promise.all(
          notifications.map(async (notification) => {
            if (notification.message.includes("following")) {
              const username = await getUsername(notification.id);
              const avatarProps = await getAvatarProps(notification.id);
              if (avatarProps) {
                avatarProps.dimensions = "40px";
              }
              return { username, avatarProps };
            } else {
              const title = notification.id;
              return { title, avatarProps: {} as AvatarProperties };
            }
          })
        );

        const usernames = users.map((user) => user.username);
        const usersAvatarProps = users.map(
          (user) => user.avatarProps as AvatarProperties
        );

        setUsernames(usernames);
        setLoading(false);
        setUsersAvatarProps(usersAvatarProps);
        setAvatarsLoading(false);
        console.log("usersAvatarProps", usersAvatarProps);
      } catch (error) {
        console.error("Error fetching users details:", error);
      }
    };

    fetchUsersDetails();
  }, [user, notifications, setUsernames, setUsersAvatarProps]);

  const pressFollowNotification = async (notification: Notification) => {
    try {
      await markNotificationAsRead(user.uid, notification.timestamp);
      if (notification.message.includes("following")) {
        setLoadingCursor(true);
        window.location.href = `/profile?userId=${notification.id}`;
      } else if (notification.message.includes("modified")) {
        setLoadingCursor(true);
        window.location.href = `/profile?userId=${user.uid}`;
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const pressMarkAllAsRead = async () => {
    try {
      setAllRead(true);
      await markAllNotificationsAsRead(user.uid);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Normalize time to 00:00:00 for comparison
    const normalizeDate = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const normalizedDate = normalizeDate(date);
    const normalizedToday = normalizeDate(today);
    const normalizedYesterday = normalizeDate(yesterday);

    const timeString = date.toLocaleTimeString("ro-RO", options);

    if (normalizedDate.getTime() === normalizedToday.getTime()) {
      return `Today at ${timeString}`;
    } else if (normalizedDate.getTime() === normalizedYesterday.getTime()) {
      return `Yesterday at ${timeString}`;
    } else {
      const dateOptions: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
      };
      const dateString = date.toLocaleDateString("en-US", dateOptions);
      return `${dateString} at ${timeString}`;
    }
  };

  return loading || loadingCursor ? (
    <Loading />
  ) : (
    <div className="flex flex-col items-center">
      <h1
        className="text-4xl font-bold text-black mt-5 mb-10 contoured-text"
        style={{
          color: "#f987af",
          textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Notifications
      </h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center justify-start space-y-4 pb-4">
          {notifications.map((notification, index) => (
            <Card
              key={notification.timestamp}
              style={{
                backgroundColor:
                  notification.read || allRead ? "#f9f9f9" : "#F7E3E3",
                width: "400px",
                paddingTop: "12px",
                paddingBottom: "2px",
                paddingLeft: "20px",
                paddingRight: "8px",
                cursor: notification.message.includes("removed")
                  ? "default"
                  : "pointer",
              }}
              onClick={pressFollowNotification.bind(this, notification)}
            >
              <div className="flex flex-row items-center justify-start">
                {usersAvatarProps &&
                  usernames &&
                  usersAvatarProps[index] &&
                  usernames[index] && (
                    <div className="flex items-center space-x-3">
                      {avatarsLoading ? (
                        <Loader />
                      ) : (
                        <Avatar {...usersAvatarProps[index]} />
                      )}
                      <p
                        className="contoured-text font-bold pr-2"
                        style={{
                          color: "#E09BAC",
                        }}
                      >
                        {usernames[index]}
                      </p>
                    </div>
                  )}
                {!notification.message.includes("following") && (
                  <div className="flex items-center space-x-3 pl-2 pr-3">
                    <img src={Admin} alt="admin" className="w-7 h-7" />
                    <p
                      className="contoured-text font-bold pr-2"
                      style={{
                        color: "#E09BAC",
                      }}
                    >
                      {usernames[index]}
                    </p>
                  </div>
                )}
                {notification.message.includes("following") ? (
                  <p style={{ paddingRight: "12px" }}>{notification.message}</p>
                ) : (
                  <p style={{ paddingRight: "12px" }}>
                    {notification.message.split("flashcard set")[0] +
                      "flashcard set "}
                    <div
                      style={{
                        color: "#E09BAC",
                        display: "inline",
                        fontWeight: "bold",
                      }}
                    >
                      {notification.id}
                    </div>
                    {notification.message.split("flashcard set")[1]}
                  </p>
                )}
              </div>
              <p
                className="flex flex-row items-center justify-end"
                style={{ color: "gray", fontSize: "12px", marginTop: "4px" }}
              >
                {formatDate(notification.timestamp)}
              </p>
            </Card>
          ))}
          <Button
            style={{
              backgroundColor: "#f987af",
              color: "black",
              marginTop: "20px",
              position: "fixed",
              right: "30px",
              bottom: "20px",
            }}
            onClick={pressMarkAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
