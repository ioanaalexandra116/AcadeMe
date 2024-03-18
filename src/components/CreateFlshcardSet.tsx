import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import styled from "styled-components";

interface CardInnerProps {
  isHovered: boolean;
}

const StyledCard = styled.div`
  width: 300px;
  height: 175px;
  perspective: 1000px;
`;

const CardInner = styled.div<CardInnerProps>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.999s;
  transform: ${props => (props.isHovered ? 'rotateY(180deg)' : 'rotateY(0deg)')};
`;

const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #F987AF;
  color: #000;
  display: flex;
  align-items: center;
  border: 1px solid #000;
  border-radius: 10px;
  justify-content: center;
  font-size: 24px;
`;

const CardBack = styled.div`
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
  font-size: 24px;
  transform: rotateY(180deg);
`;


const CreateFlashcardSet = () => {
  const [frontContent, setFrontContent] = useState("");
  const [backContent, setBackContent] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-row items-center justify-center space-x-10">
      <div className="flex flex-row items-center justify-center space-x-2">
        <Textarea
          placeholder="Complete the front side"
          value={frontContent}
          onChange={(e) => setFrontContent(e.target.value)}
          style={{ width: "300px", height: "175px" }}
          className="bg-white rounded-xl"
        />
        <Textarea
          placeholder="Complete the back side"
          value={backContent}
          onChange={(e) => setBackContent(e.target.value)}
          style={{ width: "300px", height: "175px" }}
          className="bg-white rounded-xl"
        />
      </div>
      <div className="flex flex-col">
        Hover for preview
      <StyledCard>
        <CardInner isHovered={isHovered} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <CardFront>
            <p>{frontContent}</p>
          </CardFront>
          <CardBack>
            <p>{backContent}</p>
          </CardBack>
        </CardInner>
      </StyledCard>
      </div>
    </div>
  );
};

export default CreateFlashcardSet;
