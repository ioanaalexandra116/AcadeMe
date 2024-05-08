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
            const username = await getUsername(notification.id);
            const avatarProps = await getAvatarProps(notification.id);
            if (avatarProps) {
              avatarProps.dimensions = "40px";
            }

            if (avatarProps) {
              return { username, avatarProps };
            } else {
              return { username, avatarProps: {} as AvatarProperties };
              // You may replace {} with default values or handle it differently based on your requirements
            }
          })
        );

        const filteredUsers = users.filter(
          (user) => user.avatarProps !== undefined
        );

        const usernames = filteredUsers.map((user) => user.username);
        const usersAvatarProps = filteredUsers.map(
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
      setLoadingCursor(true);
      await markNotificationAsRead(user.uid, notification.timestamp);
      window.location.href = `/profile?userId=${notification.id}`;
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const pressMarkAllAsRead = async () => {
    try {
      setAllRead(true);
      await markAllNotificationsAsRead(user.uid);
      //reload the page to update the UI
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }

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
        <div className="flex flex-col items-center justify-between space-y-4 pb-4">
          {notifications.map((notification, index) => (
            <Card
              key={notification.timestamp}
              style={{
                backgroundColor: notification.read || allRead ? "#f9f9f9" : "#F7E3E3",
                width: "400px",
                paddingTop: "12px",
                paddingBottom: "12px",
                paddingLeft: "70px",
                paddingRight: "70px",
                cursor: "pointer",
              }}
              onClick={pressFollowNotification.bind(this, notification)}
            >
              <div className="flex flex-row items-center justify-between">
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
                      <p className="contoured-text font-bold"
                      style={{
                        color: "#E09BAC"
                      }}>
                        {usernames[index]}
                      </p>
                    </div>
                  )}
                <p>{notification.message}</p>
              </div>
            </Card>
          ))}
          <Button
            style={{
              backgroundColor: "#f987af",
              color: "black",
              marginTop: "20px",
              position: "fixed",
              right: "20px",
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
