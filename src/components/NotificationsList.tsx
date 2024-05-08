import { useEffect, useState, useContext } from "react";
import { Notification, AvatarProperties } from "@/interfaces/interfaces";
import { getNotifications, getUsername, getAvatarProps } from "@/firebase/firestore";
import { AuthContext } from "@/context";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";
import { Card } from "./ui/card";
import Avatar from "./Avatar";

export const NotificationsList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userLoading } = useContext(AuthContext);
  const [usersAvatarProps, setUsersAvatarProps] = useState<AvatarProperties[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (!user) {
      return; // Exit early if user is not available
    }

    const fetchNotifications = async () => {
      try {
        const notificationsFirebase = await getNotifications(user.uid);
        const updatedNotifications = [] as Notification[];

        // Reset notifications array before fetching new data
        setNotifications([]);

        for (let key in notificationsFirebase) {
          const notificationData = notificationsFirebase[key];
          const timestamp = key;

          // Check if notification already exists based on timestamp
          const existingNotification = notifications.find(
            (notif) => notif.timestamp === timestamp
          );

          if (!existingNotification) {
            // Create a new notification object
            const newNotification = {
              timestamp,
              id: notificationData[0],
              message: notificationData[1],
              read: notificationData[2] === "unread" ? false : true,
            };

            updatedNotifications.push(newNotification);
          }
        }

        // Update notifications state only once after processing all notifications
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          ...updatedNotifications,
        ]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    // Call fetchNotifications when user changes
    fetchNotifications();
  }, [user, location.pathname]);

  useEffect(() => {
    if (!user) {
        return; // Exit early if user is not available
    }

    const fetchUsersDetails = async () => {
        try {
            const users = await Promise.all(
                notifications.map(async (notification) => {
                    const username = await getUsername(notification.id);
                    const avatarProps = await getAvatarProps(notification.id);
                    if (avatarProps) {
                        avatarProps.dimensions = "40px"; // Set default dimensions
                    }

                    // Ensure avatarProps is defined before using it
                    if (avatarProps) {
                        return { username, avatarProps };
                    } else {
                        // Handle case where avatarProps is undefined
                        return { username, avatarProps: {} as AvatarProperties };
                        // You may replace {} with default values or handle it differently based on your requirements
                    }
                })
            );

            const filteredUsers = users.filter(user => user.avatarProps !== undefined); // Filter out undefined avatarProps

            const usernames = filteredUsers.map((user) => user.username);
            const usersAvatarProps = filteredUsers.map((user) => user.avatarProps as AvatarProperties);

            setUsernames(usernames);
            setUsersAvatarProps(usersAvatarProps);
        } catch (error) {
            console.error("Error fetching users details:", error);
        }
    };

    fetchUsersDetails();
}, [user, notifications, setUsernames, setUsersAvatarProps]);


return (
    <div className="flex flex-col items-center justify-center">
      <h1
        className="text-4xl font-bold text-black contoured-text"
        style={{
          color: "#f987af",
          textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px",
        }}
      >
        Notifications
      </h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
          {notifications.map((notification, index) => (
            <Card
              key={notification.timestamp}
              style={{
                backgroundColor: notification.read ? "#f9f9f9" : "#f6f6f6",
                width: "400px",
                padding: "12px",
              }}
              
            >
                <div className="flex flex-row items-center justify-center space-x-3">
                {usersAvatarProps && usernames && usersAvatarProps[index] && usernames[index] && (
                <div className="flex items-center space-x-3">
                    <Avatar
                        {...usersAvatarProps[index]}
                    />
                  <p>{usernames[index]}</p>
                </div>
              )}
              <p>{notification.message}</p>
            </div>

            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
