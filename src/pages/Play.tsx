import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  getFlashcardSet,
  updateActivity,
  updatePlayCount,
} from "@/firebase/firestore";
import { Input } from "@/components/ui/input";
import { FlashcardSet } from "@/interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { useLocation } from "react-router-dom";
import SadHamster from "@/assets/sad-hamster.png";
import HappyHamster from "@/assets/happy-hamster.png";
import Background from "@/assets/laptop-background.svg";
import Navbar from "@/components/Navbar";

const myAnim = keyframes`
  0% {
    opacity: 0;
    transform: translateX(250px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const myAnimLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-250px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const SlideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(250px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SlideOut = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(250px);
  }
`;

interface StyledImageProps {
  animate?: boolean;
}

const StyledImage = styled.img<StyledImageProps>`
  animation: ${({ animate }) => (animate ? SlideIn : SlideOut)} 1s ease 0s 1
    normal forwards;
`;

const AnimatedFirst = styled.div`
  animation: ${myAnimLeft} 0.8s ease 0s 1 normal forwards;
`;

interface StyledCardProps {
  animate?: boolean;
  windowWidth?: number;
}

const StyledCard = styled.div<StyledCardProps>`
  width: 500px;
  height: 292px;
  perspective: 1000px;

  ${({ windowWidth }) =>
    windowWidth &&
    windowWidth < 786 &&
    css`
      width: 350px;
      height: 204px;
    `}

  ${(props) =>
    props.animate &&
    css`
      animation: ${myAnim} 0.8s ease 0s 1 normal forwards;
    `}
`;

const CardInner = styled.div<{ isPressed: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.85s;
  transform: ${(props) =>
    props.isPressed ? "rotateY(180deg)" : "rotateY(0deg)"};
`;

const CardFront = styled.div`
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #fccede;
  color: #000;
  display: flex;
  align-items: center;
  border: 1px solid #000;
  border-radius: 10px;
  justify-content: center;
  font-size: 17px;
`;

const CardBack = styled.div`
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #fff;
  color: #000;
  display: flex;
  align-items: center;
  border: 1px solid #000;
  border-radius: 10px;
  justify-content: center;
  font-size: 17px;
  transform: rotateY(180deg);
`;

const Play = () => {
  const { user, userLoading } = useContext(AuthContext);
  const [unauthorized, setUnauthorized] = useState(false);
  const [next, setNext] = useState(true);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get("flashcardSetId");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const flipRef = useRef<HTMLButtonElement>(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [showSadHamster, setShowSadHamster] = useState(false);
  const [showHappyHamster, setShowHappyHamster] = useState(false);
  const [hamsterTimeout, setHamsterTimeout] = useState<NodeJS.Timeout>();
  const [result, setResult] = useState<number | null>(null);
  const [timeEnd, setTimeEnd] = useState(Date.now());
  const [updated, setUpdated] = useState(false);
  const [resultsPressed, setResultsPressed] = useState(false);

  useEffect(() => {
    if (!user && !userLoading) {
      setUnauthorized(true);
    }
  }, [user, userLoading]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (buttonRef.current) buttonRef.current.click();
      }
      if (event.key === "ArrowRight") {
        if (nextRef.current) nextRef.current.click();
      }
      if (event.key === " ") {
        if (flipRef.current) flipRef.current.click();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [questionIndex]);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      if (!postId) {
        return;
      }
      const flashcardSet = await getFlashcardSet(postId);
      if (!flashcardSet) {
        return;
      }
      setFlashcardSet(flashcardSet);
      setLoading(false);
    };

    fetchFlashcardSet();
  }, [postId]);

  useEffect(() => {
    if (result !== null) {
      if (!user) {
        navigate(`/play/results?flashcardSetId=${postId}&&score=${result}`);
      } else navigate(`/play/results?flashcardSetId=${postId}`);
    }
  }, [result, postId, user]);

  useEffect(() => {
    if (!flashcardSet?.flashcards) {
      return;
    }
    if (questionIndex >= Object.keys(flashcardSet?.flashcards).length) {
      if (!postId) {
        return;
      }
      updatePlayCount(postId);
      if (user) {
        updateActivity(user.uid, postId, score)
          .then((result: number) => {
            setUpdated(true);
            setResult(result);
          })
          .catch((error) => console.error("Error updating activity:", error));
      } else if (unauthorized) {
        setUpdated(true);
        setResult(score);
      }
    }
  }, [questionIndex, flashcardSet, postId, score, user]);

  const handleAnswer = () => {
    setInputDisabled(true);
    if (answerChecked) {
      setShowAnswer(!showAnswer);
      return;
    }
    if (showAnswer) {
      setShowAnswer(false);
      return;
    }
    if (
      flashcardSet?.flashcards[
        Object.keys(flashcardSet?.flashcards)[questionIndex]
      ].toLowerCase() === answer.toLowerCase()
    ) {
      setScore((prev) => prev + 10);
      setCorrect(true);
      setShowHappyHamster(true);
      setHamsterTimeout(
        setTimeout(() => {
          setShowHappyHamster(false);
        }, 3000)
      );
      setTimeEnd(Date.now());
    } else {
      setCorrect(false);
      setShowSadHamster(true);
      setHamsterTimeout(
        setTimeout(() => {
          setShowSadHamster(false);
        }, 3000)
      );
      setTimeEnd(Date.now());
    }
    setAnswerChecked(true);
    setShowAnswer(true);
    setNext(false);
  };

  return flashcardSet === null || (resultsPressed && !updated) ? (
    <Loading />
  ) : (
    <>
      {showSadHamster || (showHappyHamster && <div />)}
      <Navbar />
      <div
        className="absolute w-screen h-screen z-0"
        style={{ backgroundColor: "#A4DEF7", opacity: 0.5 }}
      >
        <div
          className="absolute top-0 left-0 w-screen h-screen bg-no-repeat bg-center z-0 bg-cover"
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
          }}
        ></div>
      </div>
      <div className="flex flex-row justify-between pt-16 pb-12 z-10">
        {window.innerWidth > 786
          ? !unauthorized && (
              <h1
                className="text-4xl font-bold text-black contoured-text flex justify-start ml-6"
                style={{
                  color: "#F987AF",
                  textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
                  zIndex: 10,
                }}
              >
                {score} exp
              </h1>
            )
          : !unauthorized && (
              <h1
                className="text-xl font-bold text-black contoured-text flex justify-start ml-6"
                style={{
                  color: "#F987AF",
                  textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
                  zIndex: 10,
                }}
              >
                {score} exp
              </h1>
            )}
        {window.innerWidth > 786 ? (
          <h1
            className="text-4xl font-bold text-black contoured-text flex justify-end mr-6 ml-6"
            style={{
              color: "#F987AF",
              textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
              zIndex: 10,
            }}
          >
            {" "}
            flashcard {questionIndex + 1} /{" "}
            {Object.keys(flashcardSet?.flashcards).length}
          </h1>
        ) : (
          <h1
            className="text-xl font-bold text-black contoured-text flex justify-end mr-6"
            style={{
              color: "#F987AF",
              textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
              zIndex: 10,
            }}
          >
            {" "}
            flashcard {questionIndex + 1} /{" "}
            {Object.keys(flashcardSet?.flashcards).length}
          </h1>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {window.innerWidth > 786 ? (
          <h1
            className="text-4xl font-bold text-black mb-5 contoured-text flex justify-center pb-5 z-10"
            style={{
              color: "#F987AF",
              textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
              zIndex: 10,
            }}
          >
            {flashcardSet?.title}
          </h1>
        ) : (
          <h1
            className="text-3xl font-bold text-black mb-5 contoured-text flex justify-center"
            style={{
              color: "#F987AF",
              textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
              zIndex: 10,
            }}
          >
            {flashcardSet?.title}
          </h1>
        )}
      </div>
      <AnimatedFirst className="flex flex-col items-center justify-center space-y-5 relative z-10">
        {" "}
        {/* Adjusted z-index */}
        <StyledCard
          windowWidth={window.innerWidth}
          animate={next}
          className="flex flex-col items-center justify-center space-y-5"
        >
          {loading ? (
            <Loading />
          ) : (
            <CardInner isPressed={showAnswer}>
              <CardFront>
                {Object.keys(flashcardSet?.flashcards)[questionIndex]}
              </CardFront>
              <CardBack>
                {
                  flashcardSet?.flashcards[
                    Object.keys(flashcardSet?.flashcards)[questionIndex]
                  ]
                }
              </CardBack>
            </CardInner>
          )}
        </StyledCard>
        <Input
          ref={inputRef}
          placeholder="Type the answer"
          value={answer}
          disabled={inputDisabled}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-1/2"
          style={{
            width: window.innerWidth > 786 ? "250px" : "200px",
            border: "1px solid #000",
            backgroundColor: answerChecked
              ? correct
                ? "#BBF6D0"
                : "#EE7579"
              : "#fff",
            pointerEvents: answerChecked ? "none" : "auto",
            textAlign: "center",
          }}
          autoFocus
        />
        <div className="relative flex flex-row items-center justify-center space-x-5 mt-4">
          {!answerChecked && (
            <Button
              style={{
                width: "150px",
                backgroundColor: "#F987AF",
                color: "#000",
              }}
              onClick={handleAnswer}
              ref={buttonRef}
            >
              Check Answer
            </Button>
          )}
          {answerChecked && (
            <Button
              style={{
                width: "80px",
                backgroundColor: "#F987AF",
                color: "#000",
              }}
              onClick={() => setShowAnswer(!showAnswer)}
              ref={flipRef}
            >
              Flip
            </Button>
          )}
          {!next && (
            <Button
              ref={nextRef}
              onClick={() => {
                setQuestionIndex((prev) => prev + 1);
                setInputDisabled(false);
                setShowAnswer(false);
                setNext(true);
                setAnswer("");
                setAnswerChecked(false);
                setShowHappyHamster(false);
                setShowSadHamster(false);
                clearTimeout(hamsterTimeout);
                if (
                  questionIndex + 1 ===
                  Object.keys(flashcardSet?.flashcards).length
                ) {
                  setResultsPressed(true);
                }
              }}
              style={{
                width: "80px",
                backgroundColor: "#F987AF",
                color: "#000",
              }}
            >
              {questionIndex + 1 ===
              Object.keys(flashcardSet?.flashcards).length
                ? "Results"
                : "Next"}
            </Button>
          )}
        </div>
      </AnimatedFirst>
      {window.innerWidth > 786 ? (
        <div className="absolute bottom-0 w-full flex">
          {correct !== null && (
            <div className="overflow-hidden">
              <StyledImage
                src={correct ? HappyHamster : SadHamster}
                alt="Hamster"
                className={correct ? "w-[330px]" : "w-[330px] ml-4"}
                animate={Date.now() - timeEnd > 2000 || next ? false : true}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="absolute bottom-0 w-full flex items-center justify-center">
          {correct !== null && (
            <div className="overflow-hidden flex items-center justify-center">
              <StyledImage
                src={correct ? HappyHamster : SadHamster}
                alt="Hamster"
                className="w-[150px]"
                animate={Date.now() - timeEnd > 2000 || next ? false : true}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Play;
