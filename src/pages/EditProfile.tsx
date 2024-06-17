import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import {
  getUserData,
  updateProfile,
  getAllUsernames,
} from "@/firebase/firestore";
import Background from "@/assets/strawberry-background.svg";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import { AvatarProperties } from "@/interfaces";
import Loader from "@/components/Loader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EditAvatar from "@/assets/edit-avatar.svg";
import { CustomAvatarTabs } from "@/components/CustomAvatarTabs";
import { Button } from "@/components/ui/button";
import styled, { keyframes } from "styled-components";

const myAnim = keyframes`
  0% {
    opacity: 0;
    transform: translateX(250px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const myAnimLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-250px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const AnimatedNext = styled.div`
  animation: ${myAnim} 0.8s ease 0s 1 normal forwards;
`;

const AnimatedFirst = styled.div`
  animation: ${myAnimLeft} 0.8s ease 0s 1 normal forwards;
`;

const EditProfile = () => {
  const { user, userLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [initialUsername, setInitialUsername] = useState<string>("");
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
    dimensions: "175px",
    bowColor: "transparent",
  };
  const [characterProperties, setCharacterProperties] =
    useState<AvatarProperties>(defaultCharacterProperties);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [editAvatarComp, setEditAvatarComp] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [fullWidth, setFullWidth] = useState<boolean>(window.innerWidth > 700);
  const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
  const [allUsernames, setAllUsernames] = useState<string[]>([]);

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
          setInitialUsername(userData.username);
          setUsername(userData.username);
          setDescription(userData.description);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoadingAvatar(false);
    };

    const fetchUsernames = async () => {
      const usernames = await getAllUsernames();
      console.log(usernames);
      setAllUsernames(usernames);
    };

    fetchUsernames();
    fetchUserData();
  }, [user]);

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    setAlreadyExists(allUsernames.includes(value) && value !== initialUsername);
  };

  const handleSaveChanges = () => {
    if (alreadyExists) {
      return;
    }
    updateProfile(user.uid, username, description, characterProperties);
    navigate(`/profile?userId=${user.uid}`);
  };

  const handleBack = () => {
    setEditAvatarComp(false);
    characterProperties.dimensions = "175px";
  };

  const [cardStyles, setCardStyles] = useState({
    width: "100%",
    padding: "16px",
    margin: "auto",
    marginTop: "40px",
  });

  //---------edit-avatar-------

  useEffect(() => {
    const handleResize = () => {
      const newStyles = {
        width: window.innerWidth > 480 ? `480px` : "100%",
        padding: "16px",
        margin: "auto",
        marginTop: "40px",
      };
      setCardStyles(newStyles);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCharacterProperties = (properties: AvatarProperties) => {
    setCharacterProperties(properties);
  };

  useEffect(() => {
    setFullWidth(window.innerWidth > 700);
  }, [fullWidth, editAvatarComp]);

  return (
    <div
      className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
      onLoad={() => setImageLoaded(true)}
      style={{
        backgroundImage: `url(${Background})`,
        backgroundColor: imageLoaded ? "#000" : "#transparent",
      }}
    >
      {!editAvatarComp ? (
        <AnimatedFirst className="flex flex-col items-center justify-center h-screen pt-12">
          <h1
            className="text-4xl font-bold text-black contoured-text z-10 mt-10"
            style={{
              color: "#f987af",
              textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
            }}
          >
            Edit Profile
          </h1>
          <Card className="relative flex flex-col justify-center items-center border border-black space-y-4 p-4">
            {loadingAvatar ? <Loader /> : <Avatar {...characterProperties} />}
            <div
              className="relative bottom-14 left-11 p-2 bg-white rounded-full shadow-md cursor-pointer"
              style={{ zIndex: 10 }}
              onClick={() => {
                setEditAvatarComp(true);
                characterProperties.dimensions = "300px";
              }}
            >
              <img src={EditAvatar} alt="Edit Profile" className="w-6 h-6" />
            </div>

            <div className="flex flex-col space-y-1 relative bottom-10">
              <h1 className="text-muted-foreground">Username</h1>
              <Input
                type="text"
                placeholder="Username"
                className="w-[300px] rounded-xl"
                style={{
                  border: alreadyExists
                    ? "1px solid #B71F21"
                    : "1px solid #000",
                  backgroundColor: alreadyExists ? "#F2CACE" : "#fff",
                }}
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
              />
              {alreadyExists && (
                <div className="absolute right-0 top-16 flex justify-end text-red-700 text-xs mr-2">
                  Username already taken
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-1 relative bottom-8">
              <h1 className="text-muted-foreground">Description</h1>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Textarea
                  placeholder="Enter a short description for your profile"
                  className="w-[300px] rounded-xl h-[80px]"
                  style={{
                    border: "1px solid #000",
                    backgroundColor: "#fff",
                    resize: "none",
                  }}
                  maxLength={70}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "0px",
                    right: "5px",
                    fontSize: "12px",
                    color: "#888",
                  }}
                >
                  {description.length}/70
                </div>
              </div>
            </div>
            <div className="flex flex-row space-x-5 relative">
              <Button
                style={{
                  backgroundColor: "#f987af",
                  width: "100px",
                }}
                className="relative bottom-4"
                onClick={() => navigate("/profile?userId=" + user.uid)}
              >
                <p className="ml-1">Cancel</p>
              </Button>
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
            </div>
          </Card>
        </AnimatedFirst>
      ) : fullWidth ? (
        //-----------------------------edit-avatar-desktop--------------------------
        <AnimatedNext className="flex items-center justify-center">
          <div
            style={cardStyles}
            className="flex flex-row items-center justify-center space-x-40"
          >
            <div className="flex flex-col items-center justify-center space-y-20">
              <div className="bg-transparent rounded-full shadow-2xl flex flex-col items-center justify-center border-0">
                <Avatar {...characterProperties} />
              </div>
              <Button
                style={{
                  backgroundColor: "#F987AF",
                  boxShadow: "0px 8px 14px rgba(0, 0, 0, 0.2)",
                  height: "48px",
                }}
                onClick={handleBack}
              >
                Back to Edit Profile
              </Button>
            </div>
            <CustomAvatarTabs
              onCharacterPropertiesChange={handleCharacterProperties}
              recievedCharacterProperties={characterProperties}
            />
          </div>
        </AnimatedNext>
      ) : (
        //-----------------------------edit-avatar-phone--------------------------
        <AnimatedNext
          style={cardStyles}
          className="flex flex-col items-center justify-center space-y-8"
        >
          <div className="bg-transparent rounded-full shadow-2xl">
            <Avatar {...characterProperties} />
          </div>
          <CustomAvatarTabs
            onCharacterPropertiesChange={handleCharacterProperties}
            recievedCharacterProperties={characterProperties}
          />
          <Button
            style={{
              backgroundColor: "#F987AF",
              boxShadow: "0px 8px 14px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleBack}
          >
            Back to Edit Profile
          </Button>
        </AnimatedNext>
      )}
    </div>
  );
};

export default EditProfile;
