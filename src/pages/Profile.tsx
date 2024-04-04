import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import { getUserData } from "@/firebase/firestore";
import Post from "@/components/Post";
import DotsBackground from "@/components/DotsBackground";
import { useLocation } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { AvatarProperties } from "@/interfaces";
import Loader from "@/components/Loader";
import LevelRibbon from "@/assets/level-ribbon.svg";

const Profile = () => {
  const { user, userLoading } = useContext(AuthContext);
  const [flashcardSets, setFlashcardSets] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [level, setLevel] = useState<number>(1);
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
          setUsername(userData.username);
          setDescription(userData.description);
          setLevel(Math.floor(userData.exp / 1000) * 1000);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoadingAvatar(false);
    };
    fetchUserData();
  }, [user]);

  return (
    <div className="flex flex-col relative items-center justify-center pt-16">
      {loadingAvatar ? <Loader /> : <Avatar {...characterProperties} />}
      <div className="relative flex flex-col items-center justify-center bottom-6">
        <img src={LevelRibbon} alt="Level Ribbon" className="w-32 h-32" />
        <div className="absolute top-2 left-0 right-0 text-center text-lg font-bold">
          {level + 1}
        </div>
      </div>
      <div className="relative bottom-24">
      <div className="text-2xl text-center font-bold">{username}</div>
      <div className="text-lg text-center">{description}</div>
      <div className="absolute inset-0 z-1">
        <DotsBackground />
      </div>
      <div className={`flex flex-wrap justify-center items-center`}>
        {flashcardSets.map((flashcardSetId) => (
          <div key={flashcardSetId} className="p-8 flex justify-center">
            <Post flashcardSetId={flashcardSetId} />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Profile;
