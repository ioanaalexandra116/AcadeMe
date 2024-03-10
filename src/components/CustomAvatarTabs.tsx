import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Gender from "../assets/gender.svg";
import Lips from "../assets/lips.svg";
import ColorPicker from "./ColorPicker";
import AvatarMan from "../assets/avatar-man.svg";
import AvatarWoman from "../assets/avatar-woman.svg";
import Eye from "../assets/eye.svg";
import Eyelashes from "../assets/eyelashes.svg";
import Smiley from "../assets/smiley-face.svg";
import Nose from "../assets/nose.svg";
import Bow from "../assets/bow.svg";
import HairstyleWoman from "../assets/hairstyle-woman.svg";
import HairstyleMan from "../assets/hairstyle-man.svg";
import Frame from "../assets/frame.svg";
import { AvatarProperties } from "@/interfaces";

const triggerStyle: React.CSSProperties = {
  zIndex: 1,
  position: "relative", // Correctly typed as a literal
};

export function CustomAvatarTabs({
  onCharacterPropertiesChange,
  recievedCharacterProperties,
}: {
  onCharacterPropertiesChange: (properties: AvatarProperties) => void;
  recievedCharacterProperties: AvatarProperties; // Declare characterProperties in prop types
}) {
  const [characterProperties, setCharacterProperties] =
    useState<AvatarProperties>(recievedCharacterProperties);
  const [bow, setBow] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedTab, setSelectedTab] = useState("gender");
  const [selectedAvatar, setSelectedAvatar] = useState(
    characterProperties.gender
  );
  const [persistentColorSkin, setPersistentColorSkin] = useState(
    characterProperties.skinColor
  );
  const [persistentColorHair, setPersistentColorHair] = useState(
    characterProperties.hairColor
  );
  const [persistentColorEyes, setPersistentColorEyes] = useState(
    characterProperties.eyeColor
  );
  const [persistentColorEyelashes, setPersistentColorEyelashes] = useState(
    characterProperties.eyelidsColor
  );
  const [persistentColorNose, setPersistentColorNose] = useState(
    characterProperties.noseColor
  );
  const [persistentColorLips, setPersistentColorLips] = useState(
    characterProperties.mouthColor
  );
  const [persistentColorBow, setPersistentColorBow] = useState(
    characterProperties.bowColor || "transparent"
  );
  const [persistentColorBackground, setPersistentColorBackground] = useState(
    characterProperties.backgroundColor
  );

  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({
    zIndex: 10,
    position: "relative",
    width: "100%", // Set the initial width
  });

  const [elementSize, setElementSize] = useState<number>(150); // Initial size of the elements

  const updateCardStyles = () => {
    const windowWidth = window.innerWidth;
    const newElementSize = windowWidth > 480 ? 150 : windowWidth / 3; // Adjust the size based on the screen width

    const newCardStyle: React.CSSProperties = {
      ...cardStyle,
      width: "100%", // Adjust as needed
    };

    setCardStyle(newCardStyle);
    setElementSize(newElementSize);
  };

  useEffect(() => {
    updateCardStyles(); // Initial call

    const handleResize = () => {
      updateCardStyles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array for initial setup only

  useEffect(() => {
    // Call the function from the parent with the updated characterProperties
    onCharacterPropertiesChange(characterProperties);
  }, [characterProperties, onCharacterPropertiesChange]);

  const handleColorChange = (selectedTab: string) => (color: string) => {
    setSelectedColor(color);
    setCharacterProperties((prevProperties) => ({
      ...prevProperties,
      [selectedTab + "Color"]: color,
    }));
  };

  useEffect(() => {
    if (selectedTab == "bow" && selectedColor == "noBow") {
      setCharacterProperties((prevProperties) => ({
        ...prevProperties,
        ["bow" + "Color"]: "transparent",
      }));
      setBow(true);
    } else if (selectedTab != "bow") {
      setBow(true);
    }
  }, [selectedColor, selectedTab]);

  const handleAvatarSelection = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  useEffect(() => {
    setCharacterProperties((prevProperties) => ({
      ...prevProperties,
      ["gender"]: selectedAvatar,
    }));
  }, [selectedAvatar]);

  return (
    <Card
      cardWidth={480}
      className="flex flex-col padding-0  border-0"
      style={{
        border: "0px solid rgba(255, 255, 255, 0)",
        boxShadow: "none",
        backgroundColor: "#FCCEDB",
      }}
    >
      <Tabs
        defaultValue="gender"
        className="w-[480px] display:flex shadow-2xl border-0 flex-col"
      >
        <TabsList className="grid w-full grid-cols-9 bg-transparent flex flex-wrap items-center justify-center allign-center space-x-3">
          <TabsTrigger value="gender" onClick={() => setSelectedTab("gender")}>
            <img src={Gender} alt="Gender" className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger value="skin" onClick={() => setSelectedTab("skin")}>
            <img src={Smiley} alt="Smiley" className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger value="hair" onClick={() => setSelectedTab("hair")}>
            {" "}
            {selectedAvatar == "woman" ? (
              <img src={HairstyleWoman} alt="Hairstyle" className="w-6 h-6" />
            ) : (
              <img src={HairstyleMan} alt="Hairstyle" className="w-6 h-6" />
            )}
          </TabsTrigger>
          <TabsTrigger value="eye" onClick={() => setSelectedTab("eye")}>
            <img src={Eye} alt="Eyes" className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger
            value="eyelids"
            onClick={() => setSelectedTab("eyelids")}
          >
            <img src={Eyelashes} alt="Eyelashes" className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger value="nose" onClick={() => setSelectedTab("nose")}>
            <img src={Nose} alt="Nose" className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger value="mouth" onClick={() => setSelectedTab("mouth")}>
            <img src={Lips} alt="Lips" className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger value="bow" onClick={() => setSelectedTab("bow")}>
            <img src={Bow} alt="Bow" className="w-6 h-6" />
          </TabsTrigger>
          <TabsTrigger
            value="background"
            onClick={() => setSelectedTab("background")}
          >
            <img src={Frame} alt="Frame" className="w-6 h-6" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gender">
          <Card
            className="flex flex-col items-center justify-center h-[560px] relative border-0 rounded-xl shadow-2xl" // Add relative positioning to the Card
            cardWidth={480}
            style={cardStyle}
          >
            <CardHeader className="absolute top-0 left-0 right-0 flex flex-col items-top justify-center text-center"></CardHeader>
            <CardTitle className="absolute top-20 flex flex-col items-top justify-center mb-2">
              Choose an avatar
            </CardTitle>
            <CardDescription className="absolute top-28 mb-2">
              Select the avatar that best represents you
            </CardDescription>
            <CardContent className="flex flex-row items-center justify-center space-x-16">
              <Button
                onClick={() => handleAvatarSelection("man")}
                style={{
                  backgroundColor: "transparent",
                  border:
                    selectedAvatar === "man"
                      ? "2px solid black"
                      : "2px solid rgba(255, 255, 255, 0)",
                  padding: 0,
                  borderRadius: "50%",
                  overflow: "hidden",
                  height: "150px",
                }}
              >
                <img
                  src={AvatarMan}
                  alt="AvatarMan"
                  style={{ width: elementSize, height: elementSize }}
                />
              </Button>
              <Button
                onClick={() => handleAvatarSelection("woman")}
                style={{
                  backgroundColor: "transparent",
                  border:
                    selectedAvatar === "woman"
                      ? "2px solid black"
                      : "2px solid rgba(255, 255, 255, 0)",
                  padding: 0, // Remove default padding
                  borderRadius: "50%", // Make it circular
                  overflow: "hidden", // Ensure the circular shape
                  height: "150px",
                }}
              >
                <img
                  src={AvatarWoman}
                  alt="AvatarWoman"
                  style={{ width: elementSize, height: elementSize }}
                />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skin" style={triggerStyle}>
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorSkin}
            setPersistentColor={setPersistentColorSkin}
          />
        </TabsContent>
        <TabsContent value="hair" style={triggerStyle}>
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorHair}
            setPersistentColor={setPersistentColorHair}
          />
        </TabsContent>
        <TabsContent value="eye" style={triggerStyle}>
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorEyes}
            setPersistentColor={setPersistentColorEyes}
          />
        </TabsContent>
        <TabsContent value="eyelids" style={triggerStyle}>
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorEyelashes}
            setPersistentColor={setPersistentColorEyelashes}
          />
        </TabsContent>
        <TabsContent value="nose" style={triggerStyle}>
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorNose}
            setPersistentColor={setPersistentColorNose}
          />
        </TabsContent>
        <TabsContent value="mouth" style={triggerStyle}>
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorLips}
            setPersistentColor={setPersistentColorLips}
          />
        </TabsContent>
        <TabsContent value="bow" style={triggerStyle}>
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={bow}
            persistentColor={persistentColorBow}
            setPersistentColor={setPersistentColorBow}
          />
        </TabsContent>
        <TabsContent value="background" style={triggerStyle}>
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorBackground}
            setPersistentColor={setPersistentColorBackground}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
