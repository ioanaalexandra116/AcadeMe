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
      backgroundColor: "rgb(164,222,247)",
      mouthColor: "rgb(224,134,114)",
      eyeColor: "rgb(102,78,39)",
      eyelidsColor: "rgb(12,10,9)",
      hairColor: "rgb(89,70,64)",
      skinColor: "rgb(255,225,189)",
      noseColor: "rgb(230,183,150)",
      dimensions: "300px",
      bowColor: "transparent",
    });

  const handleCharacterProperties = (properties: AvatarProperties) => {
    setCharacterProperties(properties);
    console.log("Received characterProperties in parent:", properties);
  };

  // useEffect(() => {
  //   const handleResize = () => {
  //     const newStyles = {
  //       // width: window.innerWidth > 440 ? "440px" : "100%",
  //       width: window.innerWidth > 480 ? `480px` : "100%",
  //       padding: "16px",
  //       margin: "auto",
  //     };
  //     setCardStyles(newStyles);
  //   };

  //   handleResize(); // Initial call

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []); // Empty dependency array means this effect runs once after the initial render
  return (
    <div style={cardStyles} className="flex flex-row items-center justify-center space-x-40">
      <Avatar {...characterProperties} />
      <CustomAvatarTabs
        onCharacterPropertiesChange={handleCharacterProperties}
      />
    </div>
  );
};

export default EditAvatar;
