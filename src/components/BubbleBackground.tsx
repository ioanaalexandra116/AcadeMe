import styled from "styled-components";

interface AnimatedBubblesProps {
    height: number;
  }

// Define the styled component
const AnimatedBubbles = styled.div<AnimatedBubblesProps>`
  /* Basic dimensions and centering */
  width: 100%;
  height: 100%;
  max-height: ${(props) => props.height}px;
  min-height: 100vh;
  background: lightblue; /* Default background color */
  position: relative;
  overflow: hidden;

  /* Radial gradient background */
  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, #A4DEF7 10%, transparent 20%), #3498db
      radial-gradient(circle, transparent 10%, #A4DEF7 20%);
    background-size: 30px 30px; /* Adjust the size of the pattern */
    animation: moveBackground 80s linear infinite; /* Adjust the animation duration and timing function */
  }

  @keyframes moveBackground {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(20%, 20%);
    }
  }
`;

const BubbleBackground = ({ contentHeight }: { contentHeight: number }) => {
  return <AnimatedBubbles height={contentHeight} />;
};

export default BubbleBackground;