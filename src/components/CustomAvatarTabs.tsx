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
const cardStyle: React.CSSProperties = {
  zIndex: 10,
  position: "relative", // Correctly typed as a literal
};

const triggerStyle: React.CSSProperties = {
  zIndex: 1,
  position: "relative", // Correctly typed as a literal
};

export function CustomAvatarTabs({
  onCharacterPropertiesChange,
}: {
  onCharacterPropertiesChange: (properties: AvatarProperties) => void;
}) {
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
  const [bow, setBow] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedTab, setSelectedTab] = useState("gender");
  const [selectedAvatar, setSelectedAvatar] = useState("man");
  const [persistentColorSkin, setPersistentColorSkin] =
    useState("rgb(255,225,189)");
  const [persistentColorHair, setPersistentColorHair] =
    useState("rgb(89,70,64)");
  const [persistentColorEyes, setPersistentColorEyes] =
    useState("rgb(102,78,39)");
  const [persistentColorEyelashes, setPersistentColorEyelashes] =
    useState("rgb(12,10,9)");
  const [persistentColorNose, setPersistentColorNose] =
    useState("rgb(230,183,150)");
  const [persistentColorLips, setPersistentColorLips] =
    useState("rgb(224,134,114)");
  const [persistentColorBow, setPersistentColorBow] = useState("noBow");
  const [persistentColorBackground, setPersistentColorBackground] =
    useState("rgb(164,222,247)");

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
    console.log(selectedAvatar);
    setCharacterProperties((prevProperties) => ({
      ...prevProperties,
      ["gender"]: selectedAvatar,
    }));
  }, [selectedAvatar]);

  return (
    <Card
      cardWidth={480}
      className="flex flex-col padding-0 bg-background border-0"
      style={{
        border: "0px solid rgba(255, 255, 255, 0)",
        boxShadow: "none",
      }}
    >
      <Tabs
        defaultValue="gender"
        className="w-[480px] display:flex align-items:center justify-content:center"
      >
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="gender" onClick={() => setSelectedTab("gender")}>
            <img src={Gender} alt="Gender" className="w-6 h-6 mb-3" />
          </TabsTrigger>
          <TabsTrigger value="skin" onClick={() => setSelectedTab("skin")}>
            <img src={Smiley} alt="Smiley" className="w-6 h-6 mb-3" />
          </TabsTrigger>
          <TabsTrigger value="hair" onClick={() => setSelectedTab("hair")}>
            {" "}
            {selectedAvatar == "woman" ? (
              <img
                src={HairstyleWoman}
                alt="Hairstyle"
                className="w-6 h-6 mb-3"
              />
            ) : (
              <img
                src={HairstyleMan}
                alt="Hairstyle"
                className="w-6 h-6 mb-3"
              />
            )}
          </TabsTrigger>
          <TabsTrigger value="eye" onClick={() => setSelectedTab("eye")}>
            <img src={Eye} alt="Eyes" className="w-6 h-6 mb-3" />
          </TabsTrigger>
          <TabsTrigger
            value="eyelids"
            onClick={() => setSelectedTab("eyelids")}
          >
            <img src={Eyelashes} alt="Eyelashes" className="w-6 h-6 mb-3" />
          </TabsTrigger>
          <TabsTrigger value="nose" onClick={() => setSelectedTab("nose")}>
            <img src={Nose} alt="Nose" className="w-5 h-5 mb-3" />
          </TabsTrigger>
          <TabsTrigger value="mouth" onClick={() => setSelectedTab("mouth")}>
            <img src={Lips} alt="Lips" className="w-6 h-6 mb-3" />
          </TabsTrigger>
          <TabsTrigger value="bow" onClick={() => setSelectedTab("bow")}>
            <img src={Bow} alt="Bow" className="w-6 h-6 mb-3" />
          </TabsTrigger>
          <TabsTrigger
            value="background"
            onClick={() => setSelectedTab("background")}
          >
            <img src={Frame} alt="Frame" className="w-6 h-6 mb-3" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gender">
          <Card
            className="flex flex-col items-center justify-center h-[560px] relative" // Add relative positioning to the Card
            cardWidth={480}
            style={cardStyle}
          >
            <CardHeader className="absolute top-0 left-0 right-0 flex flex-col items-top justify-center text-center">
              {/* Move the text to the top of the card */}
            </CardHeader>
            <CardTitle className="absolute top-20 flex flex-col items-top justify-center mb-2">
              {/* Adjust top value as needed */}
              Choose an avatar
            </CardTitle>
            <CardDescription className="absolute top-28 mb-2">
              {/* Adjust top value as needed */}
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
                  padding: 0, // Remove default padding
                  borderRadius: "50%", // Make it circular
                  overflow: "hidden", // Ensure the circular shape
                  height: "150px",
                }}
              >
                <img
                  src={AvatarMan}
                  alt="AvatarMan"
                  style={{ width: "150px", height: "150px" }}
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
                  style={{ width: "150px", height: "150px" }}
                />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skin">
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorSkin}
            setPersistentColor={setPersistentColorSkin}
          />
        </TabsContent>
        <TabsContent value="hair">
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorHair}
            setPersistentColor={setPersistentColorHair}
          />
        </TabsContent>
        <TabsContent value="eye">
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorEyes}
            setPersistentColor={setPersistentColorEyes}
          />
        </TabsContent>
        <TabsContent value="eyelids">
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorEyelashes}
            setPersistentColor={setPersistentColorEyelashes}
          />
        </TabsContent>
        <TabsContent value="nose">
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorNose}
            setPersistentColor={setPersistentColorNose}
          />
        </TabsContent>
        <TabsContent value="mouth">
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={false}
            persistentColor={persistentColorLips}
            setPersistentColor={setPersistentColorLips}
          />
        </TabsContent>
        <TabsContent value="bow">
          <ColorPicker
            onColorChange={handleColorChange(selectedTab)}
            bow={bow}
            persistentColor={persistentColorBow}
            setPersistentColor={setPersistentColorBow}
          />
        </TabsContent>
        <TabsContent value="background">
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
