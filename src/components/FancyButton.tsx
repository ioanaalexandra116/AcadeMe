import React from "react";
import styled from "styled-components";

interface FancyButtonProps {
  onClick?: () => void; // Optional onClick prop
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 13rem;
  overflow: hidden;
  height: 3rem;
  background-size: 300% 300%;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  border: double 4px transparent;
  background-image: linear-gradient(transparent, #fff),
    linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #d09fde 67%, #a4def7 87%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    background-image: linear-gradient(#fff, #F987AF),
    linear-gradient(137.48deg, #F2D755 10%, #F2D755 45%, #F2D755 67%, #F2D755 87%);
    background-color: transparent; /* Change button background to transparent on hover */
  }

  &:hover #container-stars {
    z-index: 1;
    background-color: transparent; /* Change background to transparent on hover */
  }

  &:active {
    border: double 4px #fe53bb;
    background-origin: border-box;
    background-clip: content-box, border-box;
    animation: none;
  }

  &:active .circle {
    background: #fe53bb;
  }
`;

const ContainerStars = styled.div`
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
`;

const Strong = styled.strong`
  z-index: 2;
  font-family: "Avalors Personal Use";
  font-size: 12px;
  letter-spacing: 5px;
  color: #ffffff;
  text-shadow: 0 0 4px white;
`;

const Glow = styled.div`
  position: absolute;
  display: flex;
  width: 12rem;
`;

const Circle = styled.div`
  width: 100%;
  height: 30px;
  filter: blur(2rem);
  animation: pulse_3011 4s infinite;
  z-index: -1;
`;

const Circle1 = styled(Circle)`
  background: rgba(254, 83, 186, 0.636);
`;

const Circle2 = styled(Circle)`
  background: transparent;
`;

const Stars = styled.div`
  position: relative;
  background: transparent;
  width: 200rem;
  height: 200rem;

  &::after {
    content: "";
    position: absolute;
    top: -10rem;
    left: -100rem;
    width: 100%;
    height: 100%;
    animation: animStarRotate 90s linear infinite;
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -50%;
    width: 170%;
    height: 500%;
    animation: animStar 60s linear infinite;
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
    opacity: 0.5;
  }
`;

const FancyButton: React.FC<FancyButtonProps> = ({ onClick }) => {
  return (
    <Button className="btn" onClick={onClick}
    >
      <ContainerStars id="container-stars">
        <Stars id="stars"></Stars>
      </ContainerStars>
      <Strong>PLAY NOW</Strong>
      <Glow id="glow">
        <Circle1 className="circle"></Circle1>
        <Circle2 className="circle"></Circle2>
      </Glow>
      <style>
        {`
          @keyframes animStar {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(-135rem);
            }
          }

          @keyframes animStarRotate {
            from {
              transform: rotate(360deg);
            }
            to {
              transform: rotate(0);
            }
          }

          @keyframes gradient_301 {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes pulse_3011 {
            0% {
              transform: scale(0.75);
              box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
            }
            100% {
              transform: scale(0.75);
              box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
            }
          }
        `}
      </style>
    </Button>
  );
};

export default FancyButton;
