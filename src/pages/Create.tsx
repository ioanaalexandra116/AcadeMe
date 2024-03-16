import Background from "@/assets/laptop-background.svg";
import { Button } from "@/components/ui/button";
import styled, {keyframes} from "styled-components";
import Navbar from "@/components/Navbar";

const StyledButton = styled(Button)`
  background-color: #F987AF;
  width: 200px;
  height: 50px;
  font-size: 18px;
  transition: box-shadow 0.3s ease;

  &:hover {
    background-color: #F987AF;
    box-shadow: 5px 5px 0px #54284e;
    color: #54284e;
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
  width: 200px;
  height: 50px;
  font-size: 18px;
  transition: box-shadow 0.3s ease;
  animation: ${bounceInTop} 1.5s ease-in-out 0s 1 normal forwards;
`;


const Create = () => {
  return (
    <>
    <div className="bg-cover bg-center h-screen w-screen flex items-center justify-center relative" style={{ backgroundColor: "#A4DEF7" }}>
      <div
        className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
        <AnimatedButton className="center absolute">
        Create Flashcard Set
      </AnimatedButton>
    </div>
    </>
  );
};

export default Create;
