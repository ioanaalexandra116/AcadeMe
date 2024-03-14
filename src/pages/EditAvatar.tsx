import { CustomAvatarTabs } from "@/components/CustomAvatarTabs";
import { AvatarProperties } from "@/interfaces";
import Avatar from "@/components/Avatar";
import React from "react";
import { useState, useEffect, useContext } from "react";
import Background from "../assets/aesthetic-background.jpg";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context";
import { addAvatarProps, getAvatarProps } from "@/firebase/firestore";
import Loading from "@/components/Loading";
import { useNavigate } from "react-router-dom";

const EditAvatar = () => {
  const { user, userLoading } = useContext(AuthContext);
  const [cardStyles, setCardStyles] = React.useState({
    width: "100%",
    padding: "16px",
    margin: "auto",
  });

  useEffect(() => {
    const handleResize = () => {
      const newStyles = {
        // width: window.innerWidth > 440 ? "440px" : "100%",
        width: window.innerWidth > 480 ? `480px` : "100%",
        padding: "16px",
        margin: "auto",
      };
      setCardStyles(newStyles);
    };

    handleResize(); // Initial call

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs once after the initial render
  const navigate = useNavigate();
  if (!user || userLoading) {
    return <Loading />;
  }

  const defaultCharacterProperties: AvatarProperties = {
    gender: "man",
    backgroundColor: "rgb(164,222,247)",
    mouthColor: "rgb(224,134,114)",
    eyeColor: "rgb(102,78,39)",
    eyelidsColor: "rgb(12,10,9)",
    hairColor: "rgb(89,70,64)",
    skinColor: "rgb(255,225,189)",
    noseColor: "rgb(230,183,150)",
    dimensions: "300px",
    bowColor: "transparent",
  };

  const [characterProperties, setCharacterProperties] =
    useState<AvatarProperties>(defaultCharacterProperties);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchAvatarProps = async () => {
      try {
        const avatarProps = await getAvatarProps(user.uid);
        if (avatarProps) {
          setCharacterProperties(avatarProps);
        }
      } catch (error) {
        console.error("Error fetching avatar properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatarProps();
  }, [user]);

  const fullWidth = window.innerWidth > 700;

  const handleCharacterProperties = (properties: AvatarProperties) => {
    setCharacterProperties(properties);
  };

  const handleSaveChanges = () => {
    const properties = characterProperties as AvatarProperties;
    if (window.innerWidth < 700) {
      properties.dimensions = "175px";
    } else {
      properties.dimensions = "300px";
    }
    addAvatarProps(user.uid, properties);
    navigate("/profile");
  };

  if (loading) {
    return <Loading />;
  }

  return fullWidth ? (
    <div
      className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
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
            }}
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>
        <CustomAvatarTabs
          onCharacterPropertiesChange={handleCharacterProperties}
          recievedCharacterProperties={characterProperties}
        />
      </div>
    </div>
  ) : (
    <div
      className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div
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
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditAvatar;
