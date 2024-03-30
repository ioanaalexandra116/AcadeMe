import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { getFlashcardSet } from "@/firebase/firestore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FlashcardSet } from "@/interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useLocation } from "react-router-dom";
import Education from "@/assets/education.jpg";

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

const StyledCard = styled.div`
  width: 500px;
  height: 292px;
  perspective: 1000px;
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
  const [next, setNext] = useState(false);
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
  };

  return flashcardSet === null ? (
    <Loading />
  ) : (
    <div
      className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${Education})` }}
    >
      <AnimatedFirst className="flex flex-col items-center justify-center space-y-5">
        <p>Score : {score}</p>
        <p>
          Progress: {questionIndex + 1}/
          {Object.keys(flashcardSet?.flashcards).length}
        </p>
        <StyledCard>
          {loading ? (
            <Loading />
          ) : (
            <CardInner isPressed={showAnswer}>
              <CardFront>
                {Object.keys(flashcardSet?.flashcards)[questionIndex]}
              </CardFront>
              <CardBack>
                {showAnswer &&
                  flashcardSet?.flashcards[
                    Object.keys(flashcardSet?.flashcards)[questionIndex]
                  ]}
              </CardBack>
            </CardInner>
          )}
        </StyledCard>
        <Input
          placeholder="Type the answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-1/2"
          style={{
            border: "1px solid #000",
            backgroundColor: "#fff",
          }}
        />

        <div className="flex flex-row items-center justify-center space-x-5 mt-4">
          <Button style={{ width: "150px" }} onClick={handleAnswer}>
            {showAnswer ? "Back to front side" : "Check Answer"}
          </Button>
          <Button
            onClick={() => {
              setQuestionIndex((prev) => prev + 1);
              setShowAnswer(false);
              setNext(false);
              setAnswer("");
              setAnswerChecked(false);
            }}
          >
            Next
          </Button>
        </div>
      </AnimatedFirst>
    </div>
  );
};

export default Play;
