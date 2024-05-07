import styled, { keyframes } from "styled-components";

const rot1 = keyframes`
    to {
      transform: rotate(360deg);
    }
`;

const LoaderStyled = styled.div`
  .loader {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid #fccede;
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
