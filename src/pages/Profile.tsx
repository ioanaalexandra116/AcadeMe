import { useContext, useEffect, useState, ReactNode } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import { getUserData, FollowUser, UnfollowUser, getUsername } from "@/firebase/firestore";
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

interface ResponsiveContainerProps {
  children: ReactNode;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
      const handleResize = () => {
          setIsSmallScreen(window.innerWidth < 768);
      };

      window.addEventListener('resize', handleResize);

      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []);

  return (
      <div className={isSmallScreen ? "flex flex-row justify-center items-center space-x-4 p-4" : "flex flex-row justify-center items-center space-x-20 p-4"}>
          {children}
      </div>
  );
};


const Profile = () => {
  const { user, userLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [contextUsername, setContextUsername] = useState<string>("");
  const [flashcardSets, setFlashcardSets] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [level, setLevel] = useState<number>(1);
  const [showPosts, setShowPosts] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [followingNum, setFollowingNum] = useState<number>(0);
  const [followersNum, setFollowersNum] = useState<number>(0);
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
    dimensions: "175px",
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

  const handleAddFavorite = (flashcardSetId: string) => {
    setFavorites((prevFavorites) => [...prevFavorites, flashcardSetId]);
  };

  const handleRemoveFavorite = (flashcardSetId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((id) => id !== flashcardSetId)
    );
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchUserData = async () => {
      try {
        const userData = await getUserData(userId || user.uid);
        if (userData) {
          if (window.innerWidth > 768) {
            userData.avatarProps.dimensions = "175px";
          } else {
            userData.avatarProps.dimensions = "130px";
          }
          setCharacterProperties(userData.avatarProps);
          setFlashcardSets(userData.posts.reverse());
          setFavorites(userData.favorites);
          setUsername(userData.username);
          setDescription(userData.description);
          setLevel(Math.floor(userData.exp / 1000));
          setFollowingNum(userData.following.length);
          setFollowersNum(userData.followers.length);
          if (userData.followers.includes(user.uid || "")) {
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

    const fetchUsername = async () => {
      try {
        const username = await getUsername(user.uid);
        setContextUsername(username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    }

    fetchUserData();
    fetchUsername();
  }, [user]);

  const PressFollowUser = async (follower: string, following: string) => {
    setLoadingFollow(true);
    try {
      await FollowUser(follower, following);
    } catch (error) {
      console.error("Error following user:", error);
    }
    setLoadingFollow(false);
    setFollowersNum(followersNum + 1);
    setFollowed(true);
  };

  const PressUnfollowUser = async (follower: string, following: string) => {
    setLoadingFollow(true);
    try {
      await UnfollowUser(follower, following);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
    setLoadingFollow(false);
    setFollowersNum(followersNum - 1);
    setFollowed(false);
  };

  const onDelete = (flashcardSetId: string) => {
    setFlashcardSets(flashcardSets.filter((id) => id !== flashcardSetId));
  }

  return (
    <div className="flex flex-col items-center justify-center pt-16">
      <div className="absolute inset-0 z-1">
        <DotsBackground />
      </div>
      <Card
        className="relative flex justify-center items-center border border-black mt-4"
        style={{ backgroundColor: "#fff", height: "240px", maxWidth: window.innerWidth < 768 ? "360px" : "480px"

         }}
        cardWidth={460}
      >
        <ResponsiveContainer>
          <div className="flex flex-col items-center justify-center space-y-2">
            {loadingAvatar ? <Loader /> : <Avatar {...characterProperties} />}
            {userId === user.uid && (
              <Button
                style={{
                  backgroundColor: "#fccede",
                  color: "#fff",
                  height: "30px",
                  width: "120px",
                }}
                onClick={() => navigate("/edit-profile")}
              >
                <img src={EditProfile} alt="edit" className="w-5 h-5" />
                <p className="ml-1">Edit Profile</p>
              </Button>
            )}
          </div>
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
              <Link to={`/followers?userId=${userId}`}>
                {followersNum} Followers
              </Link>
              <p> | </p>
              <Link to={`/following?userId=${userId}`}>
                {followingNum} Following
              </Link>
            </div>
            <div className="absolute bottom-2 right-2"></div>
          </div>
        </ResponsiveContainer>
      </Card>
      {userId === user.uid && (
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
        </div>
      )}
      {userId !== user.uid && contextUsername !== "admin" && (
        <div className="mt-6 flex justify-center items-center justify-center">
          {!followed ? (
            <Button
              style={{
                backgroundColor: "#f987af",
                color: "#fff",
                height: "38px",
                width: "120px",
                position: "relative",
                cursor: loadingFollow ? "wait" : "pointer",
              }}
              onClick={() => {
                if (!loadingFollow) PressFollowUser(user.uid, userId || "");
              }}
            >
              Follow
            </Button>
          ) : (
            <Button
              style={{
                backgroundColor: "#CBCDCA",
                color: "#fff",
                height: "38px",
                width: "120px",
                position: "relative",
                cursor: loadingFollow ? "wait" : "pointer",
              }}
              onClick={() => {
                if (!loadingFollow) PressUnfollowUser(user.uid, userId || "");
              }}
            >
              Unfollow
            </Button>
          )}
        </div>
      )}

      {showPosts ? (
        <div className={`flex flex-wrap justify-center items-center pt-8`}>
          {flashcardSets.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-8">
              <h1
                className="text-4xl font-bold text-black contoured-text"
                style={{
                  color: "#f987af",
                  textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "130px",
                }}
              >
                No flashcard sets yet
              </h1>
              {userId === user.uid && (
                <Button
                  style={{
                    backgroundColor: "#f987af",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={() => navigate("/create")}
                >
                  Create your first one
                </Button>
              )}
            </div>
          ) : (
            flashcardSets.map((flashcardSetId) => (
              <div key={flashcardSetId} className="flex justify-center">
                <Post flashcardSetId={flashcardSetId} onDelete={onDelete} onAddFavorite={handleAddFavorite}
          onRemoveFavorite={handleRemoveFavorite} />
              </div>
            ))
          )}
        </div>
      ) : (
        <div className={`flex flex-wrap justify-center items-center pt-8`}>
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-8">
              <h1
                className="text-4xl font-bold text-black contoured-text"
                style={{
                  color: "#f987af",
                  textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "130px",
                }}
              >
                No favorite flashcard sets yet
              </h1>
              {userId === user.uid && (
                <Button
                  style={{
                    backgroundColor: "#f987af",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={() => navigate("/search/flashcards")}
                >
                  Search for some
                </Button>
              )}
            </div>
          ) : (
            favorites.map((flashcardSetId) => (
              <div key={flashcardSetId} className="flex justify-center">
                <Post flashcardSetId={flashcardSetId} onDelete={onDelete} onAddFavorite={handleAddFavorite}
          onRemoveFavorite={handleRemoveFavorite}/>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
