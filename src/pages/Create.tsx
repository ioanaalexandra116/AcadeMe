import CreateFlashcardSet from "@/components/CreateFlshcardSet";
import {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import BubbleBackground from "@/components/BubbleBackground";
import {
  getCategories,
  getSecondCategories,
  createFlashcardSet,
} from "@/firebase/firestore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import UploadPhoto from "../assets/upload-photo.svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FlashcardSet, ErrorMessasge } from "@/interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CustomToaster } from "@/components/ui/sonner";
import styled, { keyframes } from "styled-components";

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

const Create = () => {
  const [err, setErr] = useState<ErrorMessasge>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const { user, userLoading } = useContext(AuthContext);
  const [categories, setCategories] = useState<string[]>([]);
  const [secondCategories, setSecondCategories] = useState<string[][]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSecondCategory, setSelectedSecondCategory] = useState("");
  const [selectedThirdCategory, setSelectedThirdCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [next, setNext] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // getSecondCategories("Biology");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);

  const [flashcardSets, setFlashcardSets] = useState([
    { id: 1, frontContent: "", backContent: "" },
    { id: 2, frontContent: "", backContent: "" },
    { id: 3, frontContent: "", backContent: "" },
    { id: 4, frontContent: "", backContent: "" },
    { id: 5, frontContent: "", backContent: "" },
  ]);
  const [removedCard, setRemovedCard] = useState<number | null>(null);

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (err) {
      toast(err);
      setErr(null);
    }
    console.log(err);
  }, [err]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };
    fetchCategories();
  }, [user]);

  useEffect(() => {
    if (!selectedCategory) {
      return;
    }
    const fetchSecondCategories = async () => {
      const data = await getSecondCategories(selectedCategory);
      if (data !== null) {
        setSecondCategories(data);
      } else {
        console.error("Data is null");
      }
    };
    fetchSecondCategories();
  }, [selectedCategory]);

  const handleCategoryChange = (newValue: string) => {
    setSelectedCategory(newValue);
  };

  const handleSecondCategoryChange = (newValue: string) => {
    setSelectedSecondCategory(newValue);
  };

  const handleThirdCategoryChange = (newValue: string) => {
    setSelectedThirdCategory(newValue);
  };

  useEffect(() => {
    setCurrentPhoto(currentPhoto);
  }, [currentPhoto]);

  const handleUploadPic = () => {
    setPhotoLoading(true);
    const imageRef = ref(storage, `covers/${imageUpload?.name + v4()}`);
    if (!imageUpload) {
      return;
    }
    uploadBytes(imageRef, imageUpload).then(() => {
      getDownloadURL(imageRef)
        .then((url) => {
          setCurrentPhoto(url);
          setPhotoLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };
  const [showUploadButton, setShowUploadButton] = useState(false); // state to show or hide our upload button

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
    if (removedCard !== null) {
      const tempFlashcardSets = flashcardSets.map((set) => {
        if (set.id > removedCard) {
          return { ...set, id: set.id - 1 };
        }
        return set;
      });
      setFlashcardSets(tempFlashcardSets);
      setRemovedCard(null);
    }
  }, [removedCard, flashcardSets]);

  useLayoutEffect(() => {
    const height = document.body.scrollHeight;
    setContentHeight(height);
  }, [flashcardSets, selectedCategory, selectedSecondCategory, next]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      const file = event.target.files[0];
      if (event.target.files != null) {
        setImageUpload(event.target.files[0]);
        setShowUploadButton(true); // set state to true to show upload button
      } else {
        setShowUploadButton(false); // set state to false to hide upload button
      }

      const reader = new FileReader(); // Create a FileReader instance
      reader.onload = (e) => {
        if (e.target == null) {
          return;
        }
        setCurrentPhoto(e.target.result as string);
        setShowUploadButton(true);
        setImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleNext = () => {
    setErr(null);
    if (!currentPhoto) {
      setErr("Please upload a cover photo");
      return;
    }
    if (!selectedCategory) {
      setErr("Please select a category");
      return;
    }
    if (selectedCategory !== "Trivia" && !selectedSecondCategory) {
      setErr("Please select a subcategory");
      return;
    }
    if (selectedSecondCategory && !selectedThirdCategory) {
      setErr("Please select another subcategory");
      return;
    }
    if (!title) {
      setErr("Please enter a title");
      return;
    }
    if (!description) {
      setErr("Please enter a description");
      return;
    }
    setNext(true);
  };

  const handlePost = async () => {
    setErr(null);
    if (
      flashcardSets.some(
        (flashcard) => !flashcard.frontContent || !flashcard.backContent
      )
    ) {
      setErr("Please fill out all the flashcards ore remove the empty ones");
      return;
    }
    if (flashcardSets.length < 5) {
      setErr("The set must contain at least 5 flashcards");
      return;
    }
    const flashcardSet: FlashcardSet = {
      title,
      description,
      cover: currentPhoto,
      category: [
        selectedCategory,
        selectedSecondCategory,
        selectedThirdCategory,
      ],
      flashcards: {},
    };
    flashcardSets.forEach((flashcard) => {
      flashcardSet.flashcards[flashcard.frontContent] = flashcard.backContent;
    });
    handleUploadPic();
    const response = await createFlashcardSet(flashcardSet, user.uid);
    if (response) {
      navigate("/profile");
    }
  };

  const getSpaceXClass = () => {
    if (window.innerWidth < 768) {
      return "space-x-4";
    } else {
      return "space-x-80";
    }
  };

  return (
    <div className="flex flex-col relative">
      <div className="absolute inset-0 z-0">
        <BubbleBackground contentHeight={contentHeight} />
      </div>
      {window.innerWidth < 768 && !next ? (
        <CustomToaster
          toastOptions={{
            classNames: {
              toast: `group toast group-[.toaster]:top-0 group-[.toaster]:h-16 group-[.toaster]:w-screen group-[.toaster]:fixed  group-[.toaster]:bg-red-200 group-[.toaster]:text-red-700 group-[.toaster]:border-red-700 group-[.toaster]:rounded-xl`,
            },
          }}
        />
      ) : (
        <CustomToaster
          toastOptions={{
            classNames: {
              toast: `group toast group-[.toaster]:bg-red-200 group-[.toaster]:text-red-700 group-[.toaster]:border-red-700 group-[.toaster]:rounded-xl`,
            },
          }}
        />
      )}
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
        {!next ? (
          <AnimatedFirst className="flex flex-col items-center justify-center space-y-5">
            <Card
              cardWidth={480}
              style={{
                backgroundColor: "#FCCEDE",
                width: "480px",
                border: "1px solid #000",
                marginBottom: "30px",
              }}
              className="rounded-xl"
            >
              <CardHeader></CardHeader>
              <CardContent className="flex flex-col space-y-3 items-center">
                <div className="flex flex-col space-y-1">
                  <h1 className="text-muted-foreground">Cover</h1>
                  <div className="flex flex-row items-center justify-center space-x-7">
                    {photoLoading && <Loading />}
                    {currentPhoto ? (
                      <Card
                        className="relative flex items-center justify-center border-black"
                        style={{ width: "300px", height: "175px" }}
                        onMouseEnter={() => setShowUploadButton(true)}
                        onMouseLeave={() => setShowUploadButton(false)}
                      >
                        <img
                          src={currentPhoto}
                          alt="Current photo"
                          className="transition-opacity duration-300 ease-in-out rounded-xl"
                          style={
                            showUploadButton
                              ? {
                                  opacity: 0.5,
                                  maxWidth: "295px",
                                  maxHeight: "170px",
                                }
                              : { maxWidth: "295px", maxHeight: "170px" }
                          }
                        />
                        {showUploadButton && (
                          <img
                            src={UploadPhoto}
                            alt="Upload photo"
                            onClick={handleClickUpload}
                            className="absolute flex items-center justify-center w-16 h-16 cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          />
                        )}
                      </Card>
                    ) : (
                      <Card
                        className="relative flex items-center justify-center border-black"
                        style={{ width: "300px", height: "175px" }}
                        onMouseEnter={() => setShowUploadButton(true)}
                        onMouseLeave={() => setShowUploadButton(false)}
                      >
                        <img
                          src={UploadPhoto}
                          alt="Upload photo"
                          onClick={handleClickUpload}
                          className="w-16 h-16 cursor-pointer"
                        />
                      </Card>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <h1 className="text-muted-foreground">Category</h1>
                  <div className="flex flex-col space-y-2">
                    <Select
                      value={selectedCategory}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="w-[300px] rounded-xl">
                        <SelectValue
                          placeholder={
                            <span className="text-muted-foreground">
                              Select a category
                            </span>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {selectedCategory && selectedCategory !== "Trivia" && (
                      <Select
                        value={selectedSecondCategory}
                        onValueChange={handleSecondCategoryChange}
                      >
                        <SelectTrigger className="w-[300px] rounded-xl">
                          <SelectValue
                            placeholder={
                              <span className="text-muted-foreground">
                                Select a subcategory
                              </span>
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectGroup>
                            {Object.keys(secondCategories).map((category) => {
                              return (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}

                    {selectedSecondCategory &&
                    Array.isArray(
                      secondCategories[
                        selectedSecondCategory as keyof typeof secondCategories
                      ]
                    ) ? (
                      <Select
                        value={selectedThirdCategory}
                        onValueChange={handleThirdCategoryChange}
                      >
                        <SelectTrigger className="w-[300px] rounded-xl">
                          <SelectValue
                            placeholder={
                              <span className="text-muted-foreground">
                                Select a subcategory
                              </span>
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectGroup>
                            {(
                              secondCategories[
                                selectedSecondCategory as keyof typeof secondCategories
                              ] as string[]
                            ).map((category: string) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <h1 className="text-muted-foreground">Title</h1>
                  <Input
                    type="text"
                    placeholder="Enter a title"
                    className="w-[300px] rounded-xl"
                    style={{
                      border: "1px solid #000",
                      backgroundColor: "#fff",
                    }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <h1 className="text-muted-foreground">Description</h1>
                  <Textarea
                    placeholder="Enter a description"
                    className="w-[300px] rounded-xl h-[100px]"
                    style={{
                      border: "1px solid #000",
                      backgroundColor: "#fff",
                    }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <div className="flex flex-row items-center justify-end space-x-7 mr-10 mb-7">
                <Button
                  className="w-24 h-11 rounded-full"
                  style={{ backgroundColor: "#f987af" }}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            </Card>
          </AnimatedFirst>
        ) : (
          <AnimatedNext className="flex flex-col items-center justify-center space-y-5">
            {flashcardSets.map((flashcardSet, index) => (
              <div
                key={flashcardSet.id}
                className="flex flex-row items-center justify-center space-x-7"
              >
                <h1
                  className="text-4xl font-bold text-black contoured-text"
                  style={{
                    color: "#f987af",
                    textShadow: `
          -0.5px -0.5px 0 #000,  
          2px -0.5px 0 #000,
          -0.5px  1px 0 #000,
          2px  1px 0 #000
        `,
                    minWidth: "50px",
                    textAlign: "right",
                  }}
                >
                  {index + 1}.
                </h1>
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
              </div>
            ))}
            {window.innerWidth > 768 && (
              <Button
                onClick={handlePressButton}
                className="w-20 h-12 rounded-full"
                style={{ backgroundColor: "#f987af", marginBottom: "20px" }}
              >
                Add
              </Button>
            )}
          </AnimatedNext>
        )}
      </div>
      {next && (
        <AnimatedNext
          className={`flex flex-row items-center justify-center ${getSpaceXClass()}`}
        >
          <div className="flex z-10 mb-7 mt-5">
            <Button
              onClick={() => setNext(false)}
              className="w-32 h-12 text-white rounded-full"
              style={{ backgroundColor: "#f987af" }}
            >
              Back
            </Button>
          </div>
          {window.innerWidth < 768 && (
            <div className="flex z-10 mb-7 mt-5">
              <Button
                onClick={handlePressButton}
                className="w-32 h-12 rounded-full"
                style={{ backgroundColor: "#f987af" }}
              >
                Add
              </Button>
            </div>
          )}
          <div className="flex z-10 mb-7 mt-5">
            <Button
              onClick={handlePost}
              className="w-32 h-12 text-white rounded-full"
              style={{ backgroundColor: "#f987af" }}
            >
              Post
            </Button>
          </div>
        </AnimatedNext>
      )}
    </div>
  );
};

export default Create;
