import CreateFlashcard from "@/components/CreateFlashcard";
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
  getNextCategories,
  getFlashcardSet,
  updateFlashcardSet,
  getUsername,
  deleteFlashcardSet,
  deleteFromCheckAdmin,
  addDeleteNotification,
  addModifyNotification,
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
import EditPostIcon from "../assets/edit-post.svg";
import XDelete from "../assets/x-delete.svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FlashcardSet, ErrorMessasge } from "@/interfaces/interfaces";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CustomToaster } from "@/components/ui/sonner";
import styled, { keyframes } from "styled-components";
import { useLocation } from "react-router-dom";

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

const EditPost = () => {
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
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [flashcardSets, setFlashcardSets] = useState([
    { id: 1, frontContent: "", backContent: "" },
    { id: 2, frontContent: "", backContent: "" },
    { id: 3, frontContent: "", backContent: "" },
    { id: 4, frontContent: "", backContent: "" },
    { id: 5, frontContent: "", backContent: "" },
  ]);
  const [contextUsername, setContextUsername] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get("postId");
  const view = location.pathname.includes("view-post");
  const [isEditable, setIsEditable] = useState(!view);

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
      setCurrentPhoto(flashcardSet.cover);
      setTitle(flashcardSet.title);
      setDescription(flashcardSet.description);
      setSelectedCategory(flashcardSet.category[0]);
      setSelectedSecondCategory(flashcardSet.category[1]);
      setSelectedThirdCategory(flashcardSet.category[2]);
      const flashcards = Object.entries(flashcardSet.flashcards).map(
        ([frontContent, backContent], index) => ({
          id: index + 1,
          frontContent,
          backContent,
        })
      );
      setFlashcardSets(flashcards);
      setLoading(false);
    };
    fetchFlashcardSet();
  }, [postId]);
  const [removedCard, setRemovedCard] = useState<number | null>(null);

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    if (err) {
      toast(err);
      setErr(null);
    }
  }, [err]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchContextUsername = async () => {
      const username = await getUsername(user.uid);
      setContextUsername(username);
    };

    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchContextUsername();
    fetchCategories();
  }, [user]);

  useEffect(() => {
    if (!selectedCategory) {
      return;
    }
    const fetchSecondCategories = async () => {
      const data = await getNextCategories(selectedCategory);
      if (data !== null) {
        setSecondCategories(data);
      } else {
        console.error("Data is null");
      }
      setLoading(false);
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
    if (!next) {
      const cardContainer = document.getElementById("card-container");
      if (cardContainer) {
        const height = cardContainer.offsetHeight + 300;
        setContentHeight(height);
      }
    } else {
      const height = document.body.scrollHeight;
      setContentHeight(height);
    }
  }, [flashcardSets, next, flashcardSet]);

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
      setErr("Please complete the description");
      return;
    }
    setNext(true);
  };

  const handleEdit = async () => {
    setErr(null);
    if (
      flashcardSets.some(
        (flashcard) => !flashcard.frontContent || !flashcard.backContent
      )
    ) {
      setErr("Please fill out all the flashcards or remove the empty ones");
      return;
    }
    if (flashcardSets.length < 5) {
      setErr("The set must contain at least 5 flashcards");
      return;
    }
    const fronts = flashcardSets.map((flashcard) => flashcard.frontContent);
    const uniqueFronts = new Set(fronts);
    if (fronts.length !== uniqueFronts.size) {
      setErr("Flashcard front side must be unique");
      return;
    }
    const newFlashcardSet: FlashcardSet = {
      creator: flashcardSet?.creator || user.uid,
      title,
      description,
      cover: currentPhoto,
      category: [
        selectedCategory,
        selectedSecondCategory,
        selectedThirdCategory,
      ],
      flashcards: {},
      playCount: 0,
    };
    flashcardSets.forEach((flashcard) => {
      newFlashcardSet.flashcards[flashcard.frontContent] =
        flashcard.backContent;
    });
    handleUploadPic();
    if (!postId || !flashcardSet) {
      return;
    }
    setLoading(true);
    if (
      (flashcardSet?.title !== title ||
        flashcardSet?.description !== description ||
        flashcardSet?.cover !== currentPhoto ||
        flashcardSet?.category[0] !== selectedCategory ||
        flashcardSet?.category[1] !== selectedSecondCategory ||
        flashcardSet?.category[2] !== selectedThirdCategory ||
        JSON.stringify(flashcardSet.flashcards) !==
          JSON.stringify(newFlashcardSet.flashcards)) &&
      contextUsername === "admin"
    ) {
      await addModifyNotification(flashcardSet.title, flashcardSet.creator);
    }
    await updateFlashcardSet(postId, newFlashcardSet);
    if (view) {
      await deleteFromCheckAdmin(postId, user.uid);
      navigate(`/verify`);
    } else {
      navigate(`/profile?userId=${flashcardSet?.creator}`);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!postId || !flashcardSet) {
      return;
    }
    if (!user) {
      return;
    }
    setLoading(true);
    await deleteFlashcardSet(postId, flashcardSet.creator);
    await addDeleteNotification(flashcardSet.title, flashcardSet.creator);
    navigate(`/verify`);
    setLoading(false);
  };

  const getSpaceXClass = () => {
    if (window.innerWidth < 768) {
      return "space-x-4";
    } else {
      return "space-x-80";
    }
  };

  return loading || !flashcardSet ? (
    <Loading />
  ) : (
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
          {isEditable ? "Edit Flashcard Set" : "View Flashcard Set"}
        </h1>
        {view && (
          <>
            <Button
              style={{
                position: "fixed",
                top: "10px",
                right: "10px",
                padding: "10px 20px",
                color: "#000",
                backgroundColor: "#fff",
                cursor: "pointer",
                marginTop: "50px",
              }}
              onClick={() => setIsEditable(!isEditable)}
            >
              <div className="flex flex-row items-center justify-center space-x-2">
                {!isEditable ? (
                  <img src={EditPostIcon} alt="Edit Post" className="w-6 h-4" />
                ) : (
                  <img src={XDelete} alt="X Delete" className="w-5 h-5" />
                )}
                <p>{isEditable ? "Disable Editing" : "Enable Editing"}</p>
              </div>
            </Button>
            {next && (
              <Button
                style={{
                  position: "fixed",
                  top: "10px",
                  left: "10px",
                  padding: "10px 20px",
                  color: "#000",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  marginTop: "50px",
                }}
                onClick={() => setNext(false)}
              >
                Back
              </Button>
            )}
          </>
        )}
        {!next ? (
          <AnimatedFirst className="flex flex-col items-center justify-center space-y-5">
            <Card
              id="card-container"
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
                          className="transition-opacity duration-300 ease-in-out"
                          style={
                            showUploadButton && isEditable
                              ? {
                                  opacity: 0.5,
                                  maxWidth: "295px",
                                  maxHeight: "170px",
                                }
                              : { maxWidth: "295px", maxHeight: "170px" }
                          }
                        />
                        {showUploadButton && isEditable && (
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
                        {isEditable && (
                          <img
                            src={UploadPhoto}
                            alt="Upload photo"
                            onClick={handleClickUpload}
                            className="w-16 h-16 cursor-pointer"
                          />
                        )}
                      </Card>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{
                        display: "none",
                        cursor: isEditable ? "pointer" : "default",
                      }}
                      onChange={handleFileChange}
                      readOnly={!isEditable}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <h1 className="text-muted-foreground">Category</h1>
                  <div
                    className="flex flex-col space-y-2"
                    style={{ cursor: isEditable ? "pointer" : "default" }}
                  >
                    <Select
                      value={selectedCategory}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger
                        className="w-[300px] rounded-xl"
                        disabled={!isEditable}
                        style={{ cursor: isEditable ? "pointer" : "default" }}
                      >
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
                        <SelectTrigger
                          className="w-[300px] rounded-xl"
                          disabled={!isEditable}
                          style={{ cursor: isEditable ? "pointer" : "default" }}
                        >
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
                        <SelectTrigger
                          className="w-[300px] rounded-xl"
                          disabled={!isEditable}
                          style={{ cursor: isEditable ? "pointer" : "default" }}
                        >
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
                      cursor: isEditable ? "text" : "default",
                    }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    readOnly={!isEditable}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <h1 className="text-muted-foreground">Description</h1>
                  <Textarea
                    placeholder="Enter a short description"
                    className="w-[300px] rounded-xl h-[80px]"
                    style={{
                      border: "1px solid #000",
                      backgroundColor: "#fff",
                      resize: "none",
                      cursor: isEditable ? "text" : "default",
                    }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    readOnly={!isEditable}
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
                className="flex flex-row items-center justify-center space-x-5"
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
                <CreateFlashcard
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
                  editable={isEditable}
                />
              </div>
            ))}
            {window.innerWidth > 768 &&
              !view &&
              contextUsername !== "admin" && (
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
      {next &&
        (!view ? (
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
            {window.innerWidth < 768 &&
              !view &&
              contextUsername !== "admin" && (
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
                onClick={handleEdit}
                className="w-32 h-12 text-white rounded-full"
                style={{ backgroundColor: "#f987af" }}
              >
                Save changes
              </Button>
            </div>
          </AnimatedNext>
        ) : (
          <>
            <div className="flex z-10 mt-5 justify-center ites-center">
              <Button
                onClick={() => navigate(`/verify`)}
                className="w-44 h-12 rounded-full"
                style={{ backgroundColor: "#f987af" }}
              >
                Go back to Verify Page
              </Button>
            </div>
            <AnimatedNext
              className={`flex flex-row items-center justify-center ${getSpaceXClass()}`}
            >
              <div className="flex z-10 mb-7 mt-5">
                <Button
                  onClick={handleDelete}
                  className="w-32 h-12 text-white rounded-full"
                  style={{ backgroundColor: "#f987af" }}
                >
                  Reject
                </Button>
              </div>
              <div className="flex z-10 mb-7 mt-5">
                <Button
                  onClick={handleEdit}
                  className="w-32 h-12 text-white rounded-full"
                  style={{ backgroundColor: "#f987af" }}
                >
                  Approve
                </Button>
              </div>
            </AnimatedNext>
          </>
        ))}
    </div>
  );
};

export default EditPost;
