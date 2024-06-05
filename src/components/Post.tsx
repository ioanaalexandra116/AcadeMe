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
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  deleteFlashcardSet,
  deleteFromCheckAdmin,
  addDeleteNotification,
} from "@/firebase/firestore";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import PlayButton from "../assets/play-button.svg";
import SaveIcon from "../assets/save-icon.svg";
import SavedIcon from "../assets/saved-icon.svg";
import Confirm from "@/assets/confirm.svg";
import Delete from "@/assets/x-delete.svg";
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
import { useContext } from "react";
import { AuthContext } from "@/context";
import AdvanceCateg from "../assets/advance-categ.svg";
import UnauthorizedPopup from "./UnauthorizedPopup";
import { Button } from "./ui/button";

interface PostProps {
  flashcardSetId: string;
  verify?: boolean;
}

const Post: React.FC<PostProps> = ({ flashcardSetId, verify }) => {
  const { user, userLoading } = useContext(AuthContext);
  const [contextUsername, setContextUsername] = useState<string>("");
  const navigate = useNavigate();
  const defaultCharacterProperties: AvatarProperties = {
    gender: "man",
    backgroundColor: "rgb(164,222,247)",
    mouthColor: "rgb(224,134,114)",
    eyeColor: "rgb(102,78,39)",
    eyelidsColor: "rgb(12,10,9)",
    hairColor: "rgb(89,70,64)",
    skinColor: "rgb(255,225,189)",
    noseColor: "rgb(230,183,150)",
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
  const [showMore, setShowMore] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user && !userLoading) {
      setUnauthorized(true);
    }

    const fetchContextUsername = async () => {
      if (!user) {
        return;
      }
      const username = await getUsername(user.uid);
      setContextUsername(username);
    };

    fetchContextUsername();
  }, [user, userLoading]);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (flashcardSet.creator === user.uid || contextUsername === "admin" && verify !== true) {
      setShowMore(true);
    }
  }, [user, flashcardSet.creator]);

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
        }
      } catch (error) {
        console.error("Error fetching avatar properties:", error);
      }
      setLoadingAvatar(false);
    };

    const fetchUsername = async () => {
      try {
        const username = await getUsername(flashcardSet.creator);
        setUsername(username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    const isFavorite = async () => {
      if (!user) {
        return;
      }
      const favorites = await getFavorites(user.uid);
      if (favorites && favorites.includes(flashcardSetId)) {
        setIsSaved(true);
      }
    };
    isFavorite();
    fetchAvatarProps();
    fetchUsername();
  }, [flashcardSet.creator]);

  const handleSave = () => {
    if (!user) {
      setSuccess(true);
      return;
    }
    setIsSaved(!isSaved);
    if (isSaved) {
      removeFromFavorites(user.uid, flashcardSetId);
      return;
    }
    addToFavorites(user.uid, flashcardSetId);
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }
    setIsDeleted(true);
    await deleteFlashcardSet(flashcardSetId, flashcardSet.creator);
    await addDeleteNotification(flashcardSet.title, flashcardSet.creator);
  };

  const handleApprove = async () => {
    if (!user) {
      return;
    }
    setIsDeleted(true);
    await deleteFromCheckAdmin(flashcardSetId, user.uid);
  };

  return !isDeleted ? (
    <>
      {unauthorized && (
        <UnauthorizedPopup success={success} setSuccess={setSuccess} />
      )}
      <div className="flex items-center justify-center pl-8 pr-8 pb-16">
        <Card
          className="flex flex-col border-black rounded-xl"
          style={{
            width: "370px",
            height: verify ? "380px" : "470px",
            backgroundColor: "#fff",
          }}
        >
          <CardHeader>
            <div className="flex justify-between items-center">
              <div
                className="flex items-center justify-start cursor-pointer"
                onClick={() => {
                  if (unauthorized) {
                    setSuccess(true);
                  } else {
                    window.location.replace(
                      `/profile?userId=${flashcardSet.creator}`
                    );
                  }
                }}
              >
                {loadingAvatar ? (
                  <Loader />
                ) : (
                  <Avatar {...characterProperties} />
                )}
                &nbsp;
                <span className="relative">{username}</span>
              </div>
              {showMore && (
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
                        <DropdownMenuItem
                          className="w-28 h-10 flex justify-center items-center cursor-pointer"
                          onClick={() =>
                            navigate(`/edit-post?postId=${flashcardSetId}`)
                          }
                        >
                          <img
                            src={EditPost}
                            alt="edit post"
                            className="w-4 h-4"
                          />
                          &nbsp; Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="w-28 h-10 flex justify-center items-center cursor-pointer"
                          onClick={handleDelete}
                        >
                          <img
                            src={DeletePost}
                            alt="delete post"
                            className="w-5 h-5"
                          />
                          &nbsp; Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent
            className="flex flex-col overflow-hidden"
            style={{
              height: "380px",
              borderBottom: "1px solid black",
              borderTop: "1px solid black",
              backgroundColor: "#F7F3E2",
              padding: "8px",
            }}
          >
            <div
              className="flex justify-center items-center flex-col mt-1"
              style={{ color: "#9B7960", height: "40px" }}
            >
              <h1 className="text-xl font-bold text-center">
                {" "}
                {flashcardSet.title}
              </h1>
            </div>
            <div style={{ position: "relative", flex: "1" }}>
              <Card
                className="absolute top-4 left-6 border-black rounded-xl"
                style={{ width: "300px", height: "175px", zIndex: 1 }}
              ></Card>
              <Card
                className="absolute top-2 left-8 border-black rounded-xl"
                style={{ width: "300px", height: "175px", zIndex: 0 }}
              ></Card>
              <Card
                className="relative top-6 left-4 flex items-center justify-center border-black rounded-xl overflow-hidden"
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
              {contextUsername !== "admin" && (
                <img
                  src={PlayButton}
                  alt="play button"
                  className="relative bottom-4 left-56 w-16 h-16 z-10 cursor-pointer"
                  onClick={() =>
                    navigate(`/play?flashcardSetId=${flashcardSetId}`)
                  }
                />
              )}
            </div>
            {!verify && (
              <div className="flex flex-wrap items-center justify-center">
                {flashcardSet.category.map((category, index) => (
                  <span
                    key={index}
                    className="text-sm text-sky-400"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {index > 0 && category && (
                      <img
                        src={AdvanceCateg}
                        alt="advance category"
                        className="w-3 h-3"
                        style={{
                          transform: "rotate(180deg)",
                          marginRight: "2px",
                          marginLeft: "2px",
                        }}
                      />
                    )}
                    <p
                      onClick={() =>
                        window.location.replace(
                          `/search/flashcards?categories=${flashcardSet.category}&selected=${category}`
                        )
                      }
                      className="cursor-pointer"
                    >
                      {category}
                    </p>
                  </span>
                ))}
              </div>
            )}
            {!verify && (
              <CardDescription style={{ textAlign: "center" }} className="mb-4">
                {flashcardSet.description}
              </CardDescription>
            )}
          </CardContent>
          <CardFooter
            className="text-sm text-muted-foreground ml-2 mb-1 mr-2 mt-1 flex-col items-start"
            style={{ height: verify ? "50px" : "28px" }}
          >
            {!verify ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-row items-center h-8">
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
                {flashcardSet.playCount === 1 ? (
                  <div>played 1 time</div>
                ) : (
                  <div>played {flashcardSet.playCount} times</div>
                )}

                {contextUsername !== "admin" && (
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
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center w-full h-10 pl-8 pr-8">
                <img
                  src={Delete}
                  alt="confirm"
                  className="w-10 h-7 cursor-pointer"
                  onClick={handleDelete}
                />
                <Button style={{ backgroundColor: "#F987AF" }}
                onClick={() => navigate(`/view-post?postId=${flashcardSetId}`)}>View</Button>
                <img
                  src={Confirm}
                  alt="delete"
                  className="w-10 h-7 cursor-pointer"
                  onClick={handleApprove}
                />
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Post;
