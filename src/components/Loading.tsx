import styled, { keyframes, CSSProperties } from "styled-components";
import Background from "../assets/background.gif";

interface LoadingProps {
  style?: CSSProperties;
}

const rotateSkewAnimation = keyframes`
  0% {
    transform: rotateY(0deg) skewY(0deg);
  }
  50% {
    transform: rotateY(90deg) skewY(-20deg);
  }
  100% {
    transform: rotateY(180deg) skewY(0deg);
  }
`;

const Loader = styled.div<{ backgroundColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.backgroundColor || "transparent"};
`;

const BookWrapper = styled.div`
  width: 150px;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Book = styled.svg<{ style?: CSSProperties }>`
  width: 200px;
  height: 100%;
  filter: drop-shadow(10px 10px 5px rgba(0, 0, 0, 0.137));
`;

const BookPage = styled.svg<{ style?: CSSProperties }>`
  width: 100px;
  height: auto;
  position: absolute;
  animation: ${rotateSkewAnimation} 0.4s linear infinite;
  transform-origin: left;
  left: 50%;
`;

const Loading: React.FC<LoadingProps> = ({ style }) => {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
    >
      <Loader
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          width: "100%", // Set BookWrapper width to 100%
          height: "100%", // Set BookWrapper height to 100%
        }}
      >
        <BookWrapper
          style={{
            width: "100%", // Set BookWrapper width to 100%
            height: "100%", // Set BookWrapper height to 100%
          }}
        >
          <Book>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 126 75"
              className="book"
              style={style}
            >
              <rect
                strokeWidth="5"
                stroke="#F987AF"
                rx="7.5"
                height="70"
                width="121"
                y="2.5"
                x="2.5"
              />
              <line
                strokeWidth="5"
                stroke="#F987AF"
                y2="75"
                x2="63.5"
                x1="63.5"
              />
              <path
                stroke-linecap="round"
                strokeWidth="4"
                stroke="#A4DEF7"
                d="M25 20H50"
              />
              <path
                stroke-linecap="round"
                strokeWidth="4"
                stroke="#A4DEF7"
                d="M101 20H76"
              />
              <path
                stroke-linecap="round"
                strokeWidth="4"
                stroke="#A4DEF7"
                d="M16 30L50 30"
              />
              <path
                stroke-linecap="round"
                strokeWidth="4"
                stroke="#A4DEF7"
                d="M110 30L76 30"
              />
            </svg>
          </Book>
          <BookPage
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff74"
            viewBox="0 0 65 75"
            className="book-page"
          >
            <path
              stroke-linecap="round"
              stroke-width="4"
              stroke="#A4DEF7"
              d="M40 20H15"
            ></path>
            <path
              stroke-linecap="round"
              stroke-width="4"
              stroke="#A4DEF7"
              d="M49 30L15 30"
            ></path>
            <path
              stroke-width="5"
              stroke="#F987AF"
              d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z"
            ></path>
          </BookPage>
        </BookWrapper>
      </Loader>
    </div>
  );
};

export default Loading;
