import styled, { keyframes } from "styled-components";

const rot1 = keyframes`
    to {
      transform: rotate(360deg);
    }
`;

const LoaderStyled = styled.div`
  .loader {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(249,135,175,0.5);
    border-top-color: transparent;
    animation: ${rot1} 1.2s linear infinite;
  }
`;

const Loader = () => {
  return (
    <LoaderStyled>
      <div className="loader"></div>
    </LoaderStyled>
  );
};

export default Loader;
