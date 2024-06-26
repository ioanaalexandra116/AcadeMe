import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import NoSign from "../assets/no-sign.svg";
import { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const myAnim = keyframes`
    0% {
        opacity: 0;
        transform: translateX(-250px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
`;

interface AnimatedButtonProps {
  delay: number;
}

const AnimatedButton = styled(Button)<AnimatedButtonProps>`
  opacity: 0;
  animation: ${myAnim} 0.5s ease forwards;
  animation-delay: ${(props) => props.delay}s;
`;

interface ColorPaletteProps {
  onSelectColor: (color: string) => void;
  selectedColor: string;
  bow?: boolean;
}

export const ColorPalette = ({
  onSelectColor,
  selectedColor,
  bow = false,
}: ColorPaletteProps) => {
  const baseColors = [
    "rgb(245, 245, 244)",
    "rgb(87, 83, 78)",
    "rgb(153, 27, 27)",
    "rgb(247,8,0)",
    "rgb(253, 186, 116)",
    "rgb(242, 215, 85)",
    "rgb(249, 135, 175)",
    "rgb(77, 124, 15)",
    "rgb(1,100,69)",
    "rgb(203, 224, 207)",
    "rgb(134, 239, 172)",
    "rgb(99,247,99)",
    "rgb(94, 234, 212)",
    "rgb(164, 228, 250)",
    "rgb(8, 51, 68)",
    "rgb(164,222,247)",
    "rgb(70,165,213)",
    "rgb(230,214,251)",
    "rgb(196, 181, 253)",
    "rgb(107, 33, 168)",
    "rgb(217, 70, 239)",
    "rgb(195,5,77)",
    "rgb(247,19,142)",
    "rgb(225, 28, 75)",
    "rgb(153,72,138)",
    "rgb(253, 164, 175)",
    "rgb(136, 19, 55)",
    "rgb(242, 212, 207)",
    "rgb(226,189,193)",
    "rgb(238, 217, 200)",
    "rgb(255,225,189)",
    "rgb(236, 196, 186)",
    "rgb(226, 200, 178)",
    "rgb(230,183,150)",
    "rgb(171, 130, 99)",
    "rgb(155, 121, 96)",
    "rgb(137, 95, 65)",
    "rgb(118, 79, 51)",
    "rgb(94,75,69)",
    "rgb(79, 5, 22)",
    "rgb(102,78,39)",
    "rgb(191,101,67)",
    "rgb(224,134,114)",
    "rgb(224,194,153)",
    "rgb(52,37,26)",
    "rgb(227,169,84)",
    "rgb(165,90,85)",
    "rgb(12, 10, 9)",
  ];

  const colors = bow
    ? baseColors.filter((color) => color !== "rgb(12, 10, 9)")
    : baseColors;
  const handleBow = () => {
    onSelectColor("noBow");
  };

  const buttonHeight = window.innerWidth > 480 ? 48 : 32;
  const buttonWidth = window.innerWidth > 480 ? 48 : 32;
  const cardHeight = window.innerWidth > 480 ? 555 : 450;
  const delay = 0;

  return (
    <Card
      className="display:flex flex-col items-center justify-center brounded-xl shadow-2xl border-0"
      cardWidth={480}
      style={{
        height: cardHeight,
        width: "100%",
        padding: "16px",
        margin: "auto",
      }}
    >
      <CardHeader>
        <CardTitle className="flex flex-col items-center justify-center mb-1">
          Choose a color
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-wrap display:flex items-center justify-center"
          style={{
            marginBottom: "0.3rem",
            marginRight: "0.3rem",
            marginTop: "0.3rem",
            marginLeft: "0.3rem",
          }}
        >
          {bow && (
            <div
              className="flex flex-wrap justify-center items-center"
              style={{
                marginBottom: "0.3rem",
                marginRight: "0.3rem",
                marginTop: "0.3rem",
                marginLeft: "0.3rem",
              }}
            >
              <AnimatedButton delay={delay}
                className={`rounded-xl`}
                size="icon"
                onClick={handleBow}
                style={{
                  height: buttonHeight,
                  width: buttonWidth,
                  backgroundColor: "transparent",
                  ...(selectedColor === "noBow" ||
                  selectedColor === "transparent"
                    ? { border: "2px solid #000" }
                    : { border: "2px solid rgba(255, 255, 255, 0)" }),
                }}
              >
                <img
                  src={NoSign}
                  alt="NoSign"
                  style={{ height: "70%", width: "70%" }}
                />
              </AnimatedButton>
            </div>
          )}
          {colors.map((color, index) => (
            <div
              key={color}
              className="flex flex-wrap justify-center items-center"
              style={{
                marginBottom: "0.3rem",
                marginRight: "0.3rem",
                marginTop: "0.3rem",
                marginLeft: "0.3rem",
              }}
            >
              <AnimatedButton delay={index * 0.005}
                size="icon"
                className={`rounded-xl`}
                style={{
                  height: buttonHeight,
                  width: buttonWidth,
                  backgroundColor: color,
                  ...(selectedColor === color
                    ? { border: "2px solid #000" }
                    : { border: "2px solid rgba(255, 255, 255, 0)" }),
                }}
                onClick={() => onSelectColor(color)}
              ></AnimatedButton>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ColorPicker = ({
  onColorChange,
  bow = false,
  persistentColor,
  setPersistentColor,
}: {
  onColorChange: (color: string) => void;
  bow?: boolean;
  persistentColor: string;
  setPersistentColor: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    setSelectedColor(persistentColor);
  }, [persistentColor]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setPersistentColor(color);
    onColorChange(color);
  };

  return (
    <ColorPalette
      onSelectColor={handleColorSelect}
      selectedColor={selectedColor}
      bow={bow}
    />
  );
};

export default ColorPicker;
