import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import { getUserData, FollowUser, UnfollowUser } from "@/firebase/firestore";
import Post from "@/components/Post";
import DotsBackground from "@/components/DotsBackground";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { AvatarProperties } from "@/interfaces";
import Loader from "@/components/Loader";
import { Card } from "@/components/ui/card";
import Description from "@/assets/description.svg";
import Friends from "@/assets/friends.svg";
import User from "@/assets/username.svg";
import WhiteCrown from "@/assets/white-crown.svg";
import SaveIcon from "@/assets/favorite-posts.svg";
import EditProfile from "@/assets/edit-profile.svg";
import Posts from "@/assets/posts.svg";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { user, userLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [flashcardSets, setFlashcardSets] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [level, setLevel] = useState<number>(1);
  const [showPosts, setShowPosts] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
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
  const [characterProperties, setCharacterProperties] =
    useState<AvatarProperties>(defaultCharacterProperties);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [followed, setFollowed] = useState(false);

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchUserData = async () => {
      try {
        const userData = await getUserData(userId || user.uid);
        if (userData) {
          userData.avatarProps.dimensions = "175px";
          setCharacterProperties(userData.avatarProps);
          setFlashcardSets(userData.posts);
          setFavorites(userData.favorites);
          setUsername(userData.username);
          setDescription(userData.description);
          setLevel(Math.floor(userData.exp / 1000) * 1000);
          setFollowing(userData.following);
          setFollowers(userData.followers);
          if (userData.followers.includes(userId || "")) {
            setFollowed(true);
          } else {
            setFollowed(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoadingAvatar(false);
    };
    fetchUserData();
  }, [user]);

  const FollowUser = async (follower: string, following: string) => {
    setLoadingFollow(true);
    try {
      await FollowUser(follower, following);
    } catch (error) {
      console.error("Error following user:", error);
    }
    setLoadingFollow(false);
    setFollowed(true);
  };

  const UnfollowUser = async (follower: string, following: string) => {
    setLoadingFollow(true);
    try {
      await UnfollowUser(follower, following);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
    setLoadingFollow(false);
    setFollowed(false);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-16">
      <div className="absolute inset-0 z-1">
        <DotsBackground />
      </div>
      <Card
        className="relative flex justify-center items-center border border-black"
        style={{ backgroundColor: "#fff", height: "240px", maxWidth: "480px" }}
        cardWidth={460}
      >
        <div className="flex flex-row justify-center items-center space-x-20 p-4">
          {loadingAvatar ? <Loader /> : <Avatar {...characterProperties} />}
          <div className="flex flex-col items-start justify-center space-y-1">
            <div className="flex flex-row text-md text-center items-center justify-center space-x-2 font-bold">
              <img src={User} alt="user" className="w-5 h-5" />
              <p>{username}</p>
            </div>
            {description && (
              <div className="flex flex-row text-md text-center space-x-2">
                <img
                  src={Description}
                  alt="description"
                  className="w-5 h-5 mt-1"
                />
                <p
                  style={{
                    fontStyle: "italic",
                    textAlign: "left",
                    maxWidth: "200px",
                  }}
                >
                  {description}
                </p>
              </div>
            )}
            <div
              className="flex flex-row text-md text-center items-center justify-center space-x-2 cursor-pointer"
              onClick={() => navigate("/leaderboard")}
            >
              <img src={WhiteCrown} alt="crown" className="w-5 h-5" />
              <p>Level {level + 1}</p>
            </div>
            <div className="relative flex flex-row text-md text-center items-center justify-center space-x-2 cursor-pointer">
              <img src={Friends} alt="friends" className="w-5 h-5" />
              <Link to="/followed-categories">following</Link>
            </div>
            <div className="absolute bottom-2 right-2">
              {userId === user.uid && (
                <Button
                  style={{
                    backgroundColor: "#fccede",
                    color: "#fff",
                    height: "34px",
                    width: "120px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f987af";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fccede";
                  }}
                  onClick={() => navigate("/edit-profile")}
                >
                  <img src={EditProfile} alt="edit" className="w-5 h-5" />
                  <p className="ml-1">Edit Profile</p>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
      <div
        className="relative flex flex-row justify-between items-center space-x-2 mt-4 w-1/2"
        style={{ width: window.innerWidth < 768 ? "100%" : "50%" }}
      >
        <div
          style={{
            borderBottom: showPosts ? "1px solid black" : "none",
            paddingBottom: "8px", // Adjust spacing if needed
            width: "50%",
          }}
          className="flex flex-row justify-center items-center"
        >
          <img
            src={Posts}
            alt="posts"
            className="w-6 h-6 mt-4 ml-2 cursor-pointer"
            onClick={() => setShowPosts(true)}
          />
        </div>
        <div
          style={{
            borderBottom: !showPosts ? "1px solid black" : "none",
            paddingBottom: "8px", // Adjust spacing if needed
            width: "50%",
          }}
          className="flex flex-row justify-center items-center"
        >
          <img
            src={SaveIcon}
            alt="save"
            className="w-6 h-6 mt-4 cursor-pointer"
            onClick={() => setShowPosts(false)}
          />
        </div>
        {userId !== user.uid && (
          <div>
            {!followed ? (
              <Button
                style={{
                  backgroundColor: "#fccede",
                  color: "#fff",
                  height: "34px",
                  width: "120px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f987af";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fccede";
                }}
                onClick={() => {
                  FollowUser(user.uid, userId || "");
                }}
              >
                Follow
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: "#fccede",
                  color: "#fff",
                  height: "34px",
                  width: "120px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f987af";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fccede";
                }}
                onClick={() => {
                  UnfollowUser(user.uid, userId || "");
                }}
              >
                Unfollow
              </Button>
            )}
          </div>
        )}
      </div>
      {showPosts ? (
        <div className={`flex flex-wrap justify-center items-center`}>
          {flashcardSets.map((flashcardSetId) => (
            <div key={flashcardSetId} className="p-8 flex justify-center">
              <Post flashcardSetId={flashcardSetId} />
            </div>
          ))}
        </div>
      ) : (
        <div className={`flex flex-wrap justify-center items-center`}>
          {favorites.map((flashcardSetId) => (
            <div key={flashcardSetId} className="p-8 flex justify-center">
              <Post flashcardSetId={flashcardSetId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
