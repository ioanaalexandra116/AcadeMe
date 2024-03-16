import styled from 'styled-components';

// Define the styled component
const AnimatedStripes = styled.div`
  /* Basic dimensions and centering */
  width: 100%;
  height: 100vh; /* Changed to 100vh for full viewport height, adjust as needed */
  display: flex;
  justify-content: center;
  align-items: center;

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

// Then use the styled component in your React component
const StripeBackground = () => {
  return (
    <AnimatedStripes/>
  );
};

export default StripeBackground;