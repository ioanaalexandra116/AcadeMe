import CreateFlashcardSet from "@/components/CreateFlshcardSet";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BubbleBackground from "@/components/BubbleBackground";

const Create = () => {
  const [contentHeight, setContentHeight] = useState(0);
  const [flashcardSets, setFlashcardSets] = useState([
    { id: 1, frontContent: "1", backContent: "" },
    { id: 2, frontContent: "2", backContent: "" },
    { id: 3, frontContent: "3", backContent: "" },
    { id: 4, frontContent: "4", backContent: "" },
    { id: 5, frontContent: "5", backContent: "" },
  ]);
  const [removedCard, setRemovedCard] = useState<number | null>(null);

  const removeCard = (id: number) => {
    const newSet = flashcardSets.filter((set) => set.id !== id);
    setFlashcardSets(newSet);
    setRemovedCard(id);
  };

  const handleFrontContentChange = (id: number, value: string) => {
    setFlashcardSets((prevSets) =>
      prevSets.map((set) =>
        set.id === id ? { ...set, frontContent: value } : set
      )
    );
  };

  const handleBackContentChange = (id: number, value: string) => {
    setFlashcardSets((prevSets) =>
      prevSets.map((set) =>
        set.id === id ? { ...set, backContent: value } : set
      )
    );
  };

  const handlePressButton = () => {
    const newId = flashcardSets.length + 1;
    setFlashcardSets((prevSets) => [
      ...prevSets,
      { id: newId, frontContent: "", backContent: "" },
    ]);
  };

  useEffect(() => {
    const height = document.body.scrollHeight;
    setContentHeight(height);
    console.log(flashcardSets);
  }, [flashcardSets]);

  useEffect(() => {
    if (removedCard) {
      const tempFlashcardSets = flashcardSets.map((set) => {
        if (set.id > removedCard) {
          return { ...set, id: set.id - 1 };
        }
        return set;
      }
      );
      setFlashcardSets(tempFlashcardSets);
    }
  }, [removedCard]);

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
            textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
          }}
        >
          Create flashcard set
        </h1>
        {flashcardSets.map((flashcardSet) => (
          <CreateFlashcardSet
            flashcardKey={flashcardSet.id}
            frontValue={flashcardSet.frontContent}
            backValue={flashcardSet.backContent}
            onDelete={removeCard}
            setFrontValue={(value) =>
              handleFrontContentChange(flashcardSet.id, value)
            }
            setBackValue={(value) =>
              handleBackContentChange(flashcardSet.id, value)
            }
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
