import CreateFlashcardSet from "@/components/CreateFlshcardSet";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BubbleBackground from "@/components/BubbleBackground";
import { cloneElement } from "react";

const Create = () => {
  const [nextKey, setNextKey] = useState(5);
  const [contentHeight, setContentHeight] = useState(0);

  const [flashcardSets, setFlashcardSets] = useState([
    { flashcardKey: 1, frontContent: "", backContent: "" },
    { flashcardKey: 2, frontContent: "", backContent: "" },
    { flashcardKey: 3, frontContent: "", backContent: "" },
    { flashcardKey: 4, frontContent: "", backContent: "" },
    { flashcardKey: 5, frontContent: "", backContent: "" },
  ]);

  const handleFrontContentChange = (key: number, value: string) => {
    setFlashcardSets((prevSets) =>
      prevSets.map((set) =>
        set.flashcardKey === key ? { ...set, frontContent: value } : set
      )
    );
  };

  const handleBackContentChange = (key : number, value: string) => {
    setFlashcardSets((prevSets) =>
      prevSets.map((set) =>
        set.flashcardKey === key ? { ...set, backContent: value } : set
      )
    );
  };

  const removeCard = (key: number) => {
    console.log(key);
    setFlashcardSets((prevSets) =>
      prevSets.filter((set) => set.flashcardKey !== key).map((set) => {
        if (set.flashcardKey > key) {
          return { ...set, flashcardKey: set.flashcardKey - 1 };
        }
        return set;
      })
    );
  };

  const handlePressButton = () => {
    const newKey = nextKey;
    setNextKey(nextKey + 1);
    setFlashcardSets((prevSets) => [
      ...prevSets,
      { flashcardKey: newKey, frontContent: "", backContent: "" },
    ]);
  };


  useEffect(() => {
    const height = document.body.scrollHeight;
    setContentHeight(height);
  }, [flashcardSets]);

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 z-0">
        <BubbleBackground contentHeight={contentHeight} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-5">
        <h1
          className="text-4xl font-bold text-black mt-20 mb-5 contoured-text"
          style={{
            color: "#f987af",
            textShadow: `
              -0.5px -0.5px 0 #000,  
              2px -0.5px 0 #000,
              -0.5px  1px 0 #000,
              2px  1px 0 #000
            `,
          }}
        >
          Create flashcard set
        </h1>
        {flashcardSets.map((flashcardSet) => (
        <CreateFlashcardSet
          key={flashcardSet.flashcardKey}
          flashcardKey={flashcardSet.flashcardKey}
          frontValue={flashcardSet.frontContent}
          backValue={flashcardSet.backContent}
          onDelete={removeCard}
          setFrontValue={(value) => handleFrontContentChange(flashcardSet.flashcardKey, value)}
          setBackValue={(value) => handleBackContentChange(flashcardSet.flashcardKey, value)}
        />
      ))}
        <Button
          onClick={handlePressButton}
          className="w-40 h-12 bg-blue-500 text-white rounded-full"
          style={{ backgroundColor: "#f987af" }}
        >
          + Add New Flashcard
        </Button>
      </div>
    </div>
  );
};

export default Create;
