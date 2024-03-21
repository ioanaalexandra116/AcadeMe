// StripeBackground.jsx
import styled from "styled-components";

interface AnimatedStripesProps {
  height: number;
}

// Define the styled component
const AnimatedStripes = styled.div<AnimatedStripesProps>`
  /* Basic dimensions and centering */
  width: 100%;
  min-height: ${(props) => props.height}px; /* Set the minimum height dynamically */

  /* Dark mode colors and gradient */
  background: #56BAE4; /* Fallback for browsers that don't support gradients */
  background: linear-gradient(
    135deg,
    #56BAE4 25%,
    #A4DEF7 25%,
    #A4DEF7 50%,
    #56BAE4 50%,
    #56BAE4 75%,
    #A4DEF7 75%,
    #A4DEF7
  );
  background-size: 40px 40px;

  /* Animation */
  animation: move 4s linear infinite;

  @keyframes move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 40px 40px;
    }
  }
`;

// Wrapper component to contain all content
const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

// StripeBackground component
const StripeBackground = ({ contentHeight }: { contentHeight: number }) => { // Receive contentHeight as props
  return (
    <AnimatedStripes height={contentHeight}>
      <ContentWrapper />
    </AnimatedStripes>
  );
};

export default StripeBackground;
