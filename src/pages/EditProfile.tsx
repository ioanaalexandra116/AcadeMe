import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import { getUserData, updateProfile } from "@/firebase/firestore";
import Background from "@/assets/strawberry-background.svg";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { AvatarProperties } from "@/interfaces";
import Loader from "@/components/Loader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EditAvatar from "@/assets/edit-avatar.svg";
import { Button } from "@/components/ui/button";

const EditProfile = () => {
  const { user, userLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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
          setUsername(userData.username);
          setDescription(userData.description);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoadingAvatar(false);
    };
    fetchUserData();
  }, [user]);

  const handleSaveChanges = () => {
    updateProfile(user.uid,
      username,
      description,
    );
    navigate(`/profile?userId=${user.uid}`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: "#000" }}>
        <div className="absolute inset-0 z-0">
        <img src={Background} alt="Background" className="w-full h-full object-cover" />
      </div>
      <h1
        className="text-4xl font-bold text-black mt-20 contoured-text z-10"
        style={{
          color: "#f987af",
          textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
        }}
      >
        Edit Profile
      </h1>
      <Card className="relative flex flex-col justify-center items-center border border-black space-y-4 p-4">
        {loadingAvatar ? <Loader /> : <Avatar {...characterProperties} />}
        <Link
          to="/edit-avatar"
          className="relative bottom-14 left-11 p-2 bg-white rounded-full shadow-md"
          style={{ zIndex: 10 }}
        >
          <img src={EditAvatar} alt="Edit Profile" className="w-6 h-6" />
        </Link>

        <div className="flex flex-col space-y-1 relative bottom-10">
          <h1 className="text-muted-foreground">Username</h1>
          <Input
            type="text"
            placeholder="Username"
            className="w-[300px] rounded-xl"
            style={{
              border: "1px solid #000",
              backgroundColor: "#fff",
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1 relative bottom-8">
          <h1 className="text-muted-foreground">Description</h1>
          <Textarea
            placeholder="Enter a short description for your profile"
            className="w-[300px] rounded-xl h-[80px]"
            style={{
              border: "1px solid #000",
              backgroundColor: "#fff",
              resize: "none",
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button
          style={{
            backgroundColor: "#f987af",
            width: "100px",
          }}
        className="relative bottom-4"
          onClick={handleSaveChanges}
        >
            <p className="ml-1">Save</p>
        </Button>
      </Card>
    </div>
  );
};

export default EditProfile;
