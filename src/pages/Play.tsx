import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { getFlashcardSet } from "@/firebase/firestore";
import { Input } from "@/components/ui/input";
import { FlashcardSet } from "@/interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { useLocation } from "react-router-dom";
import Education from "@/assets/education.jpg";
import SadHamster from "@/assets/sad-hamster.png";
import HappyHamster from "@/assets/happy-hamster.png";
import PreviewCreate from "@/assets/preview-create.svg";

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

const AnimatedNext = styled.div`
  animation: ${myAnim} 0.8s ease 0s 1 normal forwards;
`;

const AnimatedFirst = styled.div`
  animation: ${myAnimLeft} 0.8s ease 0s 1 normal forwards;
`;

interface StyledCardProps {
  animate?: boolean;
}

const StyledCard = styled.div<StyledCardProps>`
  width: 500px;
  height: 292px;
  perspective: 1000px;

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
  background-color: #fff;
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
  background-color: rgb(187 247 208);
  color: rgb(21 128 61);
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
  const [next, setNext] = useState(true);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [answerChecked, setAnswerChecked] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get("flashcardSetId");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputDisabled, setInputDisabled] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (!buttonRef.current) return;
        buttonRef.current.click();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
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

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (!flashcardSet?.flashcards) {
      return;
    }
    if (questionIndex >= Object.keys(flashcardSet?.flashcards).length) {
      navigate(`/play/result?score=${score}`);
    }
  }, [questionIndex, flashcardSet]);

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
    } else {
      setCorrect(false);
    }
    setAnswerChecked(true);
    setShowAnswer(true);
    setNext(false);
  };

  return flashcardSet === null ? (
    <Loading />
  ) : (
    <div
      className="bg-cover bg-center h-screen w-screen flex flex-col space-y-10 pt-16 relative "
      style={{ backgroundImage: `url(${PreviewCreate})` }}
    >
      <div className="flex flex-row justify-between">
        <h1
          className="text-4xl font-bold text-black contoured-text flex justify-start ml-6"
          style={{
            color: "#F987AF",
            textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
          }}
        >
          {score} exp
        </h1>
        <h1
          className="text-4xl font-bold text-black contoured-text flex justify-end mr-6"
          style={{
            color: "#F987AF",
            textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
          }}
        >
          {" "}
          flashcard {questionIndex + 1} /{" "}
          {Object.keys(flashcardSet?.flashcards).length}
        </h1>
      </div>
      <h1
        className="text-4xl font-bold text-black mb-5 contoured-text flex justify-center"
        style={{
          color: "#F987AF",
          textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
        }}
      >
        {flashcardSet?.title}
      </h1>
      <AnimatedFirst className="flex flex-col items-center justify-center space-y-5 relative z-10">
        {" "}
        {/* Adjusted z-index */}
        <StyledCard
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
            width: "250px",
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
          {!answerChecked ? (
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
          ) : (
            <Button
              style={{
                width: "80px",
                backgroundColor: "#F987AF",
                color: "#000",
              }}
              onClick={() => setShowAnswer(!showAnswer)}
            >
              Flip
            </Button>
          )}
          {!next && (
            <Button
              onClick={() => {
                setQuestionIndex((prev) => prev + 1);
                setInputDisabled(false);
                setShowAnswer(false);
                setNext(true);
                setAnswer("");
                setAnswerChecked(false);
              }}
              style={{
                width: "80px",
                backgroundColor: "#F987AF",
                color: "#000",
              }}
            >
              Next
            </Button>
          )}
        </div>
      </AnimatedFirst>
      <div className="relative flex flex-start bottom-64 ml-4 z-0">
        {!correct && answerChecked && (
          <img src={SadHamster} alt="Sad Hamster" className="w-[334px]" />
        )}
      </div>
      <div className="relative flex flex-start bottom-[315px] ml-4 z-0">
        {correct && answerChecked && (
          <img src={HappyHamster} alt="Happy Hamster" className="w-[350px]" />
        )}
      </div>
    </div>
  );
};

export default Play;
