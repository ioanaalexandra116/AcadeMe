import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import RightArrow from "../assets/right-arrow.svg";

interface CreateFlashcardSetProps {
  flashcardKey: number;
  onDelete: (key: number) => void;
  frontValue?: string;
  backValue?: string;
  setFrontValue?: (value: string) => void;
  setBackValue?: (value: string) => void;
}

const StyledCard = styled.div`
  width: 300px;
  height: 175px;
  perspective: 1000px;
`;

const CardInner = styled.div<{ isPressed: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.85s;
  transform: ${(props) =>
    props.isPressed ? "rotateY(180deg)" : "rotateY(0deg)"};
`;

const CardFront = styled.div`
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #f987af;
  color: #000;
  display: flex;
  align-items: center;
  border: 1px solid #000;
  border-radius: 10px;
  justify-content: center;
  font-size: 17px;
`;

const CardBack = styled.div`
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: rgb(187 247 208);
  color: rgb(21 128 61);
  display: flex;
  align-items: center;
  border: 1px solid #000;
  border-radius: 10px;
  justify-content: center;
  font-size: 17px;
  transform: rotateY(180deg);
`;

const CreateFlashcardSet = ({
  flashcardKey,
  onDelete,
  frontValue,
  backValue,
  setFrontValue,
  setBackValue
}: CreateFlashcardSetProps) => {
  const [frontContent, setFrontContent] = useState(frontValue || "");
  const [backContent, setBackContent] = useState(backValue || "");
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // Update local state when props change
    setFrontContent(frontValue || "");
    setBackContent(backValue || "");
  }, [frontValue, backValue]);

  const handleFrontContentChange = (value: string) => {
    setFrontContent(value); // Update local state
    if (setFrontValue) {
      setFrontValue(value); // Pass value to parent
    }
  };

  const handleBackContentChange = (value: string) => {
    setBackContent(value); // Update local state
    if (setBackValue) {
      setBackValue(value); // Pass value to parent
    }
  };

  return (
    <div className="flex flex-row items-center justify-center space-x-5">
      <div className="flex flex-row items-center justify-center space-x-5">
        <Textarea
          placeholder="Complete the front side"
          value={frontContent}
          onChange={(e) => handleFrontContentChange(e.target.value)}
          style={{ width: "300px", height: "175px" }}
          className="bg-white rounded-xl"
        />
        <Textarea
          placeholder="Complete the back side"
          value={backContent}
          onChange={(e) => handleBackContentChange(e.target.value)}
          style={{ width: "300px", height: "175px" }}
          className="bg-white rounded-xl"
        />
          <img src={RightArrow} alt="right arrow" className="w-10 h-10" />

      </div>
      <StyledCard className="flex flex-row items-center justify-center w-300 h-175">
        <CardInner
          isPressed={isPressed}
          onClick={() => setIsPressed(!isPressed)}
        >
          <CardFront>{frontContent}</CardFront>
          <CardBack>{backContent}</CardBack>
        </CardInner>
      </StyledCard>
      <Button onClick={() => onDelete(flashcardKey)} className="text-red-700 bg-red-200 border-red-700 hover:bg-red-700 hover:text-white">
        Remove
      </Button>
    </div>
  );
};

export default CreateFlashcardSet;