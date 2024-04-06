import React from "react";
import styled from "styled-components";

// Styled component for the RibbonHeading
const StyledRibbonHeading = styled.h1`
  position: relative;
  margin: 0 auto 0px;
  width: 100%;
  height: 45px;
  padding: 0 60px;
  text-align: center;
  background-color: #f4e653;
  font-size: 0rem; /* Default font size, can be adjusted via props */

  &::before,
  &::after {
    content: "";
    width: 80px;
    height: 100%;
    background-color: #f2d755;
    position: absolute;
    z-index: -1;
    top: 20px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 25% 50%);
    background-image: linear-gradient(45deg, transparent 50%, #d7a403 50%);
    background-size: 20px 20px;
    background-repeat: no-repeat;
    background-position: bottom right;
  }

  &::before {
    left: -60px;
  }

  &::after {
    right: -60px;
    transform: scaleX(-1); /* flip horizontally */
  }

  /* Media query for smaller screens */
  @media (max-width: 300px) {
    font-size: 1.5rem;
  }
`;

interface RibbonHeadingProps {
  children: React.ReactNode;
}

const RibbonHeading: React.FC<RibbonHeadingProps> = ({ children }) => {
  return <StyledRibbonHeading>{children}</StyledRibbonHeading>;
};

export default RibbonHeading;
