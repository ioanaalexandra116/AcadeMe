import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Avatar from "./Avatar";

interface ColorPaletteProps {
  onSelectColor: (color: string) => void;
}

export const ColorPalette = ({ onSelectColor }: ColorPaletteProps) => {
  // Define an array of Tailwind CSS color classes
  const colors: string[] = [
    "rgb(245, 245, 244)",
    "rgb(87, 83, 78)",
    "rgb(12, 10, 9)",
    "rgb(153, 27, 27)",
    "rgb(253, 186, 116)",
    "rgb(242, 215, 85)",
    "rgb(155, 121, 96)",
    "rgb(249, 135, 175)",
    "rgb(77, 124, 15)",
    "rgb(203, 224, 207)",
    "rgb(134, 239, 172)",
    "rgb(94, 234, 212)",
    "rgb(17, 94, 89)",
    "rgb(164, 228, 250)",
    "rgb(8, 51, 68)",
    "rgb(29, 78, 216)",
    "rgb(230,214,251)",
    "rgb(196, 181, 253)",
    "rgb(107, 33, 168)",
    "rgb(217, 70, 239)",
    "rgb(190, 24, 93)",
    "rgb(247,19,142)",
    "rgb(225, 28, 75)",
    "rgb(253, 164, 175)",
    "rgb(136, 19, 55)",
    "rgb(242, 212, 207)",
    "rgb(238, 217, 200)",
    "rgb(236, 196, 186)",
    "rgb(226, 200, 178)",
    "rgb(214, 183, 152)",
    "rgb(204, 165, 136)",
    "rgb(171, 130, 99)",
    "rgb(137, 95, 65)",
    "rgb(118, 79, 51)",
    "rgb(92, 64, 37)",
    "rgb(69,26,3)",
    "rgb(95,73,48)",
    "rgb(219,202,194)",
    "rgb(79, 5, 22)",
    "rgb(191,101,67)",
    "rgb(224,194,153)",
    "rgb(42,31,19)",
    "rgb(227,169,84)",
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4 p-4">
        {colors.slice(0, 21).map((color) => (
          <Button
            key={color}
            size={"lg"}
            className={`rounded-xl ${color} border border-black`}
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(color)}
          ></Button>
        ))}
      </div>
      <div className="flex space-x-4 p-4">
        {colors.slice(21, 42).map((color) => (
          <Button
            key={color}
            size={"lg"}
            className={`rounded-xl ${color} border border-black`}
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(color)}
          ></Button>
        ))}
      </div>
    </div>
  );
};

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState<string>("bg-red-500");

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };
  console.log(selectedColor);

  return (
    <div>
      <ColorPalette onSelectColor={handleColorSelect} />
      <Avatar
        gender="woman"
        backgroundColor="#F9E0AE"
        mouthColor={selectedColor}
        eyeColor="#0a84a5"
        eyelidsColor="#231F20"
        hairColor="#B4863C"
        skinColor="#ecbf9d"
        noseColor="#B4863C"
        bowColor="rgb(208,37,71)"
        dimensions="256px"
      />
    </div>
  );
};

export default ColorPicker;
