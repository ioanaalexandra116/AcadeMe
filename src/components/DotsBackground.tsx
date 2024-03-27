import styled from 'styled-components';

const BackgroundPattern = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 300%;
  height: 300%;
  overflow: hidden;
  z-index: -1; /* Ensures the background doesn't interfere with other content */

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(#f987af 5%, #0000 6%), radial-gradient(#fccede 5%, #0000 6%);
    background-position: 0 0, 25px 25px; /* Adjust the background position as needed */
    background-size: 50px 50px; /* Adjust the size of the pattern */
    animation: moveBackground 400s linear infinite;
  }

  @keyframes moveBackground {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-50%, -50%);
    }
  }
`;

export default BackgroundPattern;
