import {
  Card,
  CardFooter,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FlashcardSet } from "@/interfaces/interfaces";
import { getFlashcardSet } from "@/firebase/firestore";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import PlayButton from "../assets/play-button.svg";

const Post = ({ flashcardSetId }: { flashcardSetId: string }) => {
  const initialFlashcardSet: FlashcardSet = {
    cover: "",
    category: [],
    title: "",
    description: "",
    flashcards: {},
    creator: "",
    playCount: 0,
  };
  const [flashcardSet, setFlashcardSet] =
    useState<FlashcardSet>(initialFlashcardSet);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      const flashcardSet = await getFlashcardSet(flashcardSetId);
      if (!flashcardSet) {
        return;
      }
      console.log(flashcardSet.flashcards);
      setFlashcardSet(flashcardSet);
      setLoading(false);
    };
    fetchFlashcardSet();
  }, [flashcardSetId]);

  return (
    <Card
      className="flex flex-col justify-between"
      style={{ width: "370px", height: "470px", backgroundColor: "#DDEEF0" }}
    >
      <CardContent className="flex flex-col" style={{ minHeight: "0" }}>
        {" "}
        {/* Use flexbox and set minHeight */}
        <h1
          className="text-2xl font-bold flex justify-center mt-3"
        >
          {flashcardSet.title}
        </h1>
        <div style={{ position: "relative", flex: "1" }}>
          {" "}
          {/* Ensure this content area expands to fill remaining space */}
          <Card
            className="absolute top-6 right-1 border-black rounded-xl"
            style={{ width: "300px", height: "175px", zIndex: 1 }}
          ></Card>
          <Card
            className="absolute top-4 left-2 border-black rounded-xl"
            style={{ width: "300px", height: "175px", zIndex: 0 }}
          ></Card>
          <Card
            className="relative top-8 right-2 flex items-center justify-center border-black rounded-xl"
            style={{ width: "300px", height: "175px", zIndex: 2 }}
          >
            {loading ? (
              <Loader />
            ) : (
              <img
                src={flashcardSet.cover}
                alt="cover"
                style={{ maxWidth: "295px", maxHeight: "170px" }}
              />
            )}
          </Card>
          <img
            src={PlayButton}
            alt="play button"
            className="relative bottom-2 left-52 w-16 h-16 z-10"
            style={{ cursor: "pointer" }}
            onClick={() => console.log("Play button clicked")}
          />
        </div>
        <div className="flex flex-wrap items-center justify-center mt-2">
          {" "}
          {/* Use flexbox and wrap */}
          {flashcardSet.category.map((category, index) => (
            <span key={index} className="text-sm text-blue-400">
              {" " + category}
              {index < flashcardSet.category.length - 1 && " >"}
            </span>
          ))}
        </div>
        <CardDescription>{flashcardSet.description}</CardDescription>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground ml-3 mb-3 flex-col items-start">
        <div className="flex flex-row items-center">
          {Object.keys(flashcardSet.flashcards).length}
          &nbsp;
          <Card
            className="border-muted-foreground rounded-sm"
            style={{ width: "25px", height: "17px", zIndex: 1 }}
          ></Card>
        </div>
        played {flashcardSet.playCount} times
      </CardFooter>
    </Card>
  );
};

export default Post;
