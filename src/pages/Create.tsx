import Background from "@/assets/laptop-background.svg";
import FlashcardSet from "@/assets/flashcard-set.svg";
import PreviewCreate from "@/assets/preview-create.svg";
import { Button } from "@/components/ui/button";
import styled, { keyframes } from "styled-components";
import CreateFlashcardSet from "@/components/CreateFlshcardSet";
import { useEffect, useState } from "react";

const StyledButton = styled(Button)`
  background-color: #000000;
  color: #000000;
  font-size: 18px;
  transition: box-shadow 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: #f987af;
    box-shadow: 5px 5px 0px #000;
    color: #000;
  }
`;

const bounceInTop = keyframes`
0% {
    animation-timing-function: ease-in;
    opacity: 0;
    transform: translateY(-250px);
}

38% {
    animation-timing-function: ease-out;
    opacity: 1;
    transform: translateY(0);
}

55% {
    animation-timing-function: ease-in;
    transform: translateY(-65px);
}

72% {
    animation-timing-function: ease-out;
    transform: translateY(0);
}

81% {
    animation-timing-function: ease-in;
    transform: translateY(-28px);
}

90% {
    animation-timing-function: ease-out;
    transform: translateY(0);
}

95% {
    animation-timing-function: ease-in;
    transform: translateY(-8px);
}

100% {
    animation-timing-function: ease-out;
    transform: translateY(0);
}
`;

const AnimatedButton = styled(StyledButton)`
  /* Your existing button styles */
  background-color: #f987af;
  width: 230px;
  height: 50px;
  font-size: 19px;
  transition: box-shadow 0.3s ease;
  animation: ${bounceInTop} 1.5s ease-in-out 0s 1 normal forwards;
`;

const Create = () => {
  const [showCreateFlashcardSet, setShowCreateFlashcardSet] = useState(false);
  return (
    // <>
    // <div className="bg-cover bg-center h-screen w-screen flex items-center justify-center relative" style={{ backgroundColor: "#A4DEF7" }}>
    //   <div
    //     className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-center"
    //     style={{
    //       backgroundImage: `url(${Background})`,
    //       backgroundSize: "cover",
    //       backgroundPosition: "center",
    //     }}
    //   ></div>
    //     <AnimatedButton className="center absolute">
    //     Create Flashcard Set
    //   </AnimatedButton>
    // </div>
    // </>
    <>
      <div
        className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${PreviewCreate})` }}
      >
        {showCreateFlashcardSet ? (
          <CreateFlashcardSet />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <img src={FlashcardSet} alt="flashcard set" className="w-40 mt-5" />
            <AnimatedButton onClick={() => setShowCreateFlashcardSet(true)}>
              Create Flashcard Set
            </AnimatedButton>
          </div>
        )}
      </div>
    </>
  );
};

export default Create;
