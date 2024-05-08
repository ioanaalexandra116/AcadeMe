import { useEffect, useState, useContext } from "react";
import { AvatarProperties } from "@/interfaces/interfaces";
import {
  getFollowers,
  getUsername,
  getAvatarProps,
  getFollowing,
  FollowUser,
  UnfollowUser,
} from "@/firebase/firestore";
import { AuthContext } from "@/context";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Loader from "./Loader";
import { Card } from "./ui/card";
import Avatar from "./Avatar";
import { Button } from "./ui/button";

export const FollowList = () => {
  const [followList, setFollowList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCursor, setLoadingCursor] = useState(false);
  const [avatarsLoading, setAvatarsLoading] = useState(true);
  const { user, userLoading } = useContext(AuthContext);
  const [usersAvatarProps, setUsersAvatarProps] = useState<AvatarProperties[]>(
    []
  );
  const [following, setFollowing] = useState<string[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const list = location.pathname.split("/")[1];
  const navigate = useNavigate();
  const [userFollowingStates, setUserFollowingStates] = useState<boolean[]>([]);

  if (!user || userLoading || !userId) {
    return <Loading />;
  }

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchFollowing = async () => {
      try {
        const following = await getFollowing(user.uid);
        setFollowing(following);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    const fetchFollowList = async () => {
      try {
        if (list === "followers") {
          const followers = await getFollowers(userId);
          setFollowList(followers);
        } else {
          const following = await getFollowing(userId);
          setFollowList(following);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchFollowing();
    fetchFollowList();
  }, [user, userId, list]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchUsersDetails = async () => {
      try {
        const users = await Promise.all(
          followList.map(async (userId) => {
            const username = await getUsername(userId);
            const avatarProps = await getAvatarProps(userId);
            const followState = following.includes(userId);
            if (avatarProps) {
              avatarProps.dimensions = "40px";
            }

            if (avatarProps) {
              return { username, avatarProps, followState };
            } else {
              return {
                username,
                avatarProps: {} as AvatarProperties,
                followState,
              };
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
        const userFollowingStates = filteredUsers.map(
          (user) => user.followState as boolean
        );
        setUserFollowingStates(userFollowingStates);
        setUsernames(usernames);
        setLoading(false);
        setUsersAvatarProps(usersAvatarProps);
        setAvatarsLoading(false);
      } catch (error) {
        console.error("Error fetching users details:", error);
      }
    };

    fetchUsersDetails();
  }, [user, followList, setUsernames, setUsersAvatarProps, following]);

  const pressFollowUser = async (userId: string) => {
    try {
      setLoadingCursor(true);
      await FollowUser(user.uid, userId);
      const index = followList.indexOf(userId);
      const newFollowing = [...following, userId];
      const newFollowStates = [...userFollowingStates];
      newFollowStates[index] = true;
      setUserFollowingStates(newFollowStates);
      setFollowing(newFollowing);
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setLoadingCursor(false);
    }
  };

  const pressUnfollowUser = async (userId: string) => {
    try {
      setLoadingCursor(true);
      await UnfollowUser(user.uid, userId);
      const index = followList.indexOf(userId);
      const newFollowing = following.filter((id) => id !== userId);
      const newFollowStates = [...userFollowingStates];
      newFollowStates[index] = false;
      setUserFollowingStates(newFollowStates);
      setFollowing(newFollowing);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setLoadingCursor(false);
    }
  };

  return loading ? (
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
        {list === "followers" ? "Followers" : "Following"}
      </h1>
      {loading ? (
        <Loading />
      ) : (
        <Card>
          {usersAvatarProps.map((avatarProps, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between w-full p-2"
            >
              <div
                className="flex flex-row items-center w-full cursor-pointer space-x-4"
                onClick={() => navigate(`/profile?userId=${followList[index]}`)}
              >
                {avatarsLoading ? (
                  <Loader />
                ) : (
                  <Avatar {...avatarProps} />
                )}
                <p className="text-lg font-bold">{usernames[index]}</p>
              </div>
              {user.uid !== followList[index] && (
                <Button
                style={{
                    backgroundColor: userFollowingStates[index] ? "#CBCDCA" : "#F987AF",
                    color: "#FFFFFF",
                    width: "120px",
                    cursor: loadingCursor ? "wait" : "pointer",
                }}
                  onClick={() =>
                    userFollowingStates[index]
                      ? pressUnfollowUser(followList[index])
                      : pressFollowUser(followList[index])
                  }
                  className="ml-5"
                >
                  {userFollowingStates[index] ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default FollowList;
