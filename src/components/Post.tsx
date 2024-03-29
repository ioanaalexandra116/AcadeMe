import {
  Card,
  CardFooter,
  CardDescription,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { FlashcardSet, AvatarProperties } from "@/interfaces/interfaces";
import {
  getFlashcardSet,
  getAvatarProps,
  getUsername,
} from "@/firebase/firestore";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import PlayButton from "../assets/play-button.svg";
import SaveIcon from "../assets/save-icon.svg";
import SavedIcon from "../assets/saved-icon.svg";
import MoreIcon from "../assets/more-icon.svg";
import DeletePost from "../assets/delete-post.svg";
import EditPost from "../assets/edit-post.svg";
import Avatar from "./Avatar";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Post = ({ flashcardSetId }: { flashcardSetId: string }) => {
  const navigate = useNavigate();
  const defaultCharacterProperties: AvatarProperties = {
    gender: "",
    backgroundColor: "transparent",
    mouthColor: "transparent",
    eyeColor: "transparent",
    eyelidsColor: "transparent",
    hairColor: "transparent",
    skinColor: "transparent",
    noseColor: "transparent",
    dimensions: "40px",
    bowColor: "transparent",
  };
  const initialFlashcardSet: FlashcardSet = {
    cover: "",
    category: [],
    title: "",
    description: "",
    flashcards: {},
    creator: "",
    playCount: 0,
  };
  const [characterProperties, setCharacterProperties] =
    useState<AvatarProperties>(defaultCharacterProperties);
  const [flashcardSet, setFlashcardSet] =
    useState<FlashcardSet>(initialFlashcardSet);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [username, setUsername] = useState("");
  const [loadingAvatar, setLoadingAvatar] = useState(true);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      const flashcardSet = await getFlashcardSet(flashcardSetId);
      if (!flashcardSet) {
        return;
      }
      setFlashcardSet(flashcardSet);
      setLoading(false);
    };
    fetchFlashcardSet();
  }, [flashcardSetId]);

  useEffect(() => {
    if (flashcardSet.creator === "") {
      return;
    }
    const fetchAvatarProps = async () => {
      try {
        const avatarProps = await getAvatarProps(flashcardSet.creator);
        if (avatarProps) {
          avatarProps.dimensions = "40px";
          setCharacterProperties(avatarProps);
          setLoadingAvatar(false);
        }
      } catch (error) {
        console.error("Error fetching avatar properties:", error);
      }
    };

    const fetchUsername = async () => {
      try {
        const username = await getUsername(flashcardSet.creator);
        setUsername(username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchAvatarProps();
    fetchUsername();
  }, [flashcardSet.creator]);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <Card
      className="flex flex-col border-black rounded-xl"
      style={{ width: "370px", height: "470px", backgroundColor: "#fff" }}
    >
      <CardHeader>
        <div
          className="flex justify-between items-center"
          onClick={() => navigate(`/profile?${flashcardSet.creator}`)}
        >
          <div className="flex items-center justify-start cursor-pointer space-x-2">
            {loadingAvatar ? <Loader /> : <Avatar {...characterProperties} />}
            <span className="relative">{username}</span>
          </div>
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  src={MoreIcon}
                  alt="more icon"
                  className="w-6 h-6 rotate-90 cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="h-24 flex justify-center items-center">
                <DropdownMenuGroup className="h-24 flex flex-col justify-center items-center">
                  <DropdownMenuItem className="w-28 h-10 flex justify-center items-center">
                    <img
                      src={EditPost}
                      alt="edit post"
                      className="w-4 h-4 cursor-pointer"
                    />
                    &nbsp; Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="w-28 h-10 flex justify-center items-center">
                    <img
                      src={DeletePost}
                      alt="delete post"
                      className="w-5 h-5 cursor-pointer"
                    />
                    &nbsp; Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className="flex flex-col"
        style={{
          minHeight: "0",
          borderBottom: "1px solid black",
          borderTop: "1px solid black",
          backgroundColor: "#F7F3E2",
        }}
      >
        <div
          className="flex justify-center items-center flex-col mt-1"
          style={{ height: "44px", color: "#9B7960" }}
        >
          <h1 className="text-xl font-bold text-center">
            {" "}
            {/* Use text-center class */}
            {flashcardSet.title}
          </h1>
        </div>
        <div style={{ position: "relative", flex: "1" }}>
          <Card
            className="absolute top-4 right-1 border-black rounded-xl"
            style={{ width: "300px", height: "175px", zIndex: 1 }}
          ></Card>
          <Card
            className="absolute top-2 left-2 border-black rounded-xl"
            style={{ width: "300px", height: "175px", zIndex: 0 }}
          ></Card>
          <Card
            className="relative top-6 right-2 flex items-center justify-center border-black rounded-xl"
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
            className="relative bottom-4 left-52 w-16 h-16 z-10 cursor-pointer"
            onClick={() => console.log("Play button clicked")}
          />
        </div>
        <div className="flex flex-wrap items-center justify-center">
          {flashcardSet.category.map((category, index) => (
            <span key={index} className="text-sm text-sky-400">
              {index > 0 && " >"} {category}
            </span>
          ))}
        </div>
        <CardDescription style={{ textAlign: "center" }}>
          {flashcardSet.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground ml-2 mb-1 mr-2 mt-1 flex-col items-start">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-row items-center">
            {Object.keys(flashcardSet.flashcards).length}
            &nbsp;
            <Card
              className="border-muted-foreground rounded-sm"
              style={{
                width: "25px",
                height: "17px",
                zIndex: 1,
                backgroundColor: "#F2D755",
              }}
            ></Card>
          </div>
          <div>played {flashcardSet.playCount} times</div>
          <div className="flex items-end">
            {!isSaved ? (
              <img
                src={SaveIcon}
                alt="save icon"
                className="relative w-9 h-8 cursor-pointer"
                onClick={handleSave}
              />
            ) : (
              <img
                src={SavedIcon}
                alt="saved icon"
                className="relative w-9 h-8 cursor-pointer"
                onClick={handleSave}
              />
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Post;
