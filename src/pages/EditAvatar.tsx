import { CustomAvatarTabs } from "@/components/CustomAvatarTabs";
import { AvatarProperties } from "@/interfaces";
import Avatar from "@/components/Avatar";
import React from "react";
import { useState, useEffect } from "react";

const EditAvatar = () => {
  const [cardStyles, setCardStyles] = React.useState({
    width: "100%",
    padding: "16px",
    margin: "auto",
  });
  const [characterProperties, setCharacterProperties] =
    useState<AvatarProperties>({
      gender: "man",
      backgroundColor: "#F9E0AE",
      mouthColor: "rgb(208,37,71)",
      eyeColor: "#0a84a5",
      eyelidsColor: "#231F20",
      hairColor: "#B4863C",
      skinColor: "#ecbf9d",
      noseColor: "#B4863C",
      dimensions: "300px",
      bowColor: "rgb(208,37,71)",
    });

  const handleCharacterProperties = (properties: AvatarProperties) => {
    // Do something with the received characterProperties
    setCharacterProperties(properties);
    console.log("Received characterProperties in parent:", properties);
  };

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
  return (
    <div style={cardStyles} className="flex flex-row items-center justify-center align-middle space-x-4">
      <CustomAvatarTabs
        onCharacterPropertiesChange={handleCharacterProperties}
      />
      <Avatar {...characterProperties} />
    </div>
  );
};

export default EditAvatar;
