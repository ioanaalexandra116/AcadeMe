import { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "@/context";
import Autoplay from "embla-carousel-autoplay";
import GirlTitle from "../assets/main-logo.svg";
import { FlashcardSet, UserData } from "@/interfaces";
import {
  getMostPlayedSetId,
  getFlashcardSet,
  getUsername,
  getUserRanking,
} from "@/firebase/firestore";
import Loading from "./Loading";
import MostPopular from "@/assets/most-popular.svg";
import AdvanceCateg from "@/assets/advance-categ.svg";
import FancyButton from "./FancyButton";
import GoldenButtonComponent from "./GoldenButton";
import { useNavigate } from "react-router-dom";
import PlayPreview from "@/assets/play-preview.svg";
import Podium from "@/assets/podium.svg";
import CarouselTitleTop from "@/assets/carousel-title-top.svg";
import Avatar from "./Avatar";
import UnauthorizedPopup from "./UnauthorizedPopup";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselPlugin() {
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [setId, setSetId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [topUsers, setTopUsers] = useState<UserData[]>([]);
  const [firstHovered, setFirstHovered] = useState(false);
  const [secondHovered, setSecondHovered] = useState(false);
  const [thirdHovered, setThirdHovered] = useState(false);
  const { user, userLoading } = useContext(AuthContext);
  const [unauthorized, setUnauthorized] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }));

  useEffect(() => {
    if (!user && !userLoading) {
      setUnauthorized(true);
    }
  }, [user, userLoading]);

  useEffect(() => {
    const fetchMostPlayedSet = async () => {
      try {
        const mostPlayedSetId = await getMostPlayedSetId();
        setSetId(mostPlayedSetId);
        const mostPlayedSet = await getFlashcardSet(mostPlayedSetId);
        setFlashcardSet(mostPlayedSet as FlashcardSet);
      } catch (error) {
        console.error("Error fetching most played set:", error);
      }
    };

    const fetchPodium = async () => {
      try {
        const ranking = await getUserRanking();
        console.log(ranking);
        setTopUsers(ranking.slice(0, 3));
        for (let i = 0; i < 3; i++) {
          let avatarProps = ranking[i].avatarProps;
          avatarProps = {
            ...avatarProps,
            dimensions: "60px",
          };
          ranking[i].avatarProps = avatarProps;
        }
        setTopUsers(ranking.slice(0, 3));
      } catch (error) {
        console.error("Error fetching clasament:", error);
      }
    };

    fetchMostPlayedSet();
    fetchPodium();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = await getUsername(flashcardSet?.creator || "");
        setUsername(username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    if (flashcardSet) {
      fetchUsername();
    }
  }, [flashcardSet]);

  useEffect(() => {
    if (flashcardSet && username && topUsers.length > 0) {
      setLoading(false);
    }
  }, [flashcardSet, username, topUsers]);

  return loading ? (
    <Loading />
  ) : (
    <div className="pb-6">
      {unauthorized && (
        <UnauthorizedPopup success={success} setSuccess={setSuccess} />
      )}
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-4xl flex items-center justify-center"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselPrevious />
        <CarouselContent>
          <CarouselItem key={"logo"}>
            <div className="p-0.5 z-10">
              <Card
                style={{ width: 880, height: 400 }}
                className="relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-100 via-white to-pink-100 z-0"></div>
                <CardContent className="flex items-center justify-center h-full">
                  <img
                    src={GirlTitle}
                    style={{
                      width: "400px",
                      height: "400px",
                      zIndex: 10,
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

          <CarouselItem key={"podium"}>
            <div className="p-0.5">
              <Card style={{ width: 880, height: 400, overflow: "hidden" }}>
                <CardContent className="flex relative">
                  <div
                    className="relative top-44 flex flex-col space-y-4 items-center z-20"
                    style={{ position: "relative", left: "400px" }}
                  >
                    <h1
                      className="relative text-3xl font-bold text-black contoured-text z-20"
                      style={{
                        background:
                          "linear-gradient(90deg, #9B7960, #F987AF, #F2D755)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        width: "400px",
                      }}
                    >
                      Will you make it to the top?
                    </h1>
                    <div
                      onClick={() => {
                        if (unauthorized) {
                          setSuccess(true);
                        }
                      }}
                    >
                      <GoldenButtonComponent
                        onClick={() => {
                          if (unauthorized) {
                            setSuccess(true);
                          } else {
                            navigate("/leaderboard");
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-100 via-red-100 to-yellow-100"></div>
                  <img
                    src={CarouselTitleTop}
                    alt="Carousel Title"
                    style={{
                      width: "800px",
                      height: "80px",
                      right: "296px",
                      top: "10px",
                      position: "relative",
                      objectFit: "contain",
                    }}
                  />
                  <img
                    src={Podium}
                    alt="Podium"
                    style={{
                      position: "relative",
                      width: "320px",
                      height: "410px",
                      top: "100px",
                      right: "968px",
                    }}
                  />

                  <div className="flex flex-row items-center justify-center">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      {/* Second place (left) */}
                      <div className="flex flex-col items-center justify-center">
                        <div
                          className="absolute cursor-pointer bg-transparent rounded-full"
                          style={{
                            top: 205,
                            left: 80,
                            zIndex: 10,
                            boxShadow:
                              "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={() => {
                            if (unauthorized) {
                              setSuccess(true);
                            } else {
                              navigate(`/profile?userId=${topUsers[1]?.id}`);
                            }
                          }}
                          onMouseEnter={() => setSecondHovered(true)}
                          onMouseLeave={() => setSecondHovered(false)}
                        >
                          <Avatar {...topUsers[1]?.avatarProps} />
                        </div>
                        {secondHovered && (
                          <div
                            className="absolute"
                            style={{ top: 185, left: 110, zIndex: 10 }}
                          >
                            <p className="text-xs text-black z-10">
                              {topUsers[1]?.username}
                            </p>
                          </div>
                        )}
                      </div>
                      {/* First place (center) */}
                      <div className="flex flex-col items-center justify-center">
                        <div
                          className="absolute cursor-pointer bg-transparent rounded-full"
                          style={{
                            top: 150,
                            left: 190,
                            zIndex: 10,
                            boxShadow:
                              "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={() => {
                            if (unauthorized) {
                              setSuccess(true);
                            } else {
                              navigate(`/profile?userId=${topUsers[0]?.id}`);
                            }
                          }}
                          onMouseEnter={() => setFirstHovered(true)}
                          onMouseLeave={() => setFirstHovered(false)}
                        >
                          <Avatar {...topUsers[0]?.avatarProps} />
                        </div>
                        {firstHovered && (
                          <div
                            className="absolute"
                            style={{ top: 130, left: 220, zIndex: 10 }}
                          >
                            <p className="text-xs text-black z-10">
                              {topUsers[0]?.username}
                            </p>
                          </div>
                        )}
                      </div>
                      {/* Third place (right) */}
                      <div className="flex flex-col items-center justify-center">
                        <div
                          className="absolute cursor-pointer bg-transparent rounded-full"
                          style={{
                            top: 250,
                            left: 300,
                            zIndex: 10,
                            boxShadow:
                              "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)",
                          }}
                          onClick={() => {
                            if (unauthorized) {
                              setSuccess(true);
                            } else {
                              navigate(`/profile?userId=${topUsers[2]?.id}`);
                            }
                          }}
                          onMouseEnter={() => setThirdHovered(true)}
                          onMouseLeave={() => setThirdHovered(false)}
                        >
                          <Avatar {...topUsers[2]?.avatarProps} />
                        </div>
                        {thirdHovered && (
                          <div
                            className="absolute"
                            style={{ top: 230, left: 330, zIndex: 10 }}
                          >
                            <p className="text-xs text-black z-10">
                              {topUsers[2]?.username}
                            </p>
                          </div>
                        )}
                      </div>
                      {/* Podium Image */}
                    </div>
                    <div className="relative bottom-5 w-full flex flex-col space-y-4 items-center z-20">
                      <h1
                        className="text-3xl font-bold text-black contoured-text z-20"
                        style={{
                          background:
                            "linear-gradient(90deg, #9B7960, #F987AF, #F2D755)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Will you make it to the top?
                      </h1>
                      <GoldenButtonComponent />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>

          <CarouselItem key={"most-played"}>
            <div className="p-0.5">
              <Card
                style={{
                  width: 880,
                  height: 400,
                }}
              >
                <CardContent className="relative h-full w-full flex-col items-center justify-center">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-100 via-yellow-100 to-sky-100 z-0"></div>
                  <img
                    className="relative text-4xl font-bold text-black contoured-text flex justify-center z-10"
                    src={MostPopular}
                    style={{ width: "800px", height: "105px" }}
                  />
                  <div className="flex flex-row justify-between items-start w-full">
                    <div style={{ position: "relative", marginLeft: "20px" }}>
                      <Card
                        className="absolute top-4 left-0 border-black rounded-xl"
                        style={{ width: "300px", height: "175px", zIndex: 1 }}
                      ></Card>
                      <Card
                        className="absolute top-2 left-2 border-black rounded-xl"
                        style={{ width: "300px", height: "175px", zIndex: 0 }}
                      ></Card>
                      <Card
                        className="relative top-6 right-2 flex items-center justify-center border-black rounded-xl overflow-hidden"
                        style={{ width: "300px", height: "175px", zIndex: 2 }}
                      >
                        <img
                          src={flashcardSet?.cover}
                          alt="cover"
                          style={{ maxWidth: "295px", maxHeight: "170px" }}
                        />
                      </Card>
                      <div className="flex flex-wrap justify-center nowrap w-600">
                        {flashcardSet?.category.map((category, index) => (
                          <span
                            key={index}
                            className="text-sm text-sky-400 relative top-7 right-2 flex-row z-10"
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
                              className="cursor-pointer relative"
                            >
                              {category}
                            </p>
                          </span>
                        ))}
                      </div>
                      <div className="relative right-5 flex justify-center items-center pt-8">
                        <img
                          src={PlayPreview}
                          alt="play preview"
                          className="w-4 h-4"
                        />
                        <h1 className="text-xs ml-1">
                          {flashcardSet?.playCount}
                        </h1>
                      </div>
                      <div className="relative right-4 flex justify-center items-center">
                        <h1 className="text-xs flex">Created by</h1>
                        <h1
                          className="text-xs font-bold ml-1"
                          style={{ color: "#F987AF", cursor: "pointer" }}
                          onClick={() => {
                            if (unauthorized) {
                              setSuccess(true);
                            } else {
                              window.location.replace(
                                `/profile?userId=${flashcardSet?.creator}`
                              );
                            }
                          }}
                        >
                          {username}
                        </h1>
                      </div>
                    </div>

                    <div
                      className="flex flex-col items-center justify-center space-y-4"
                      style={{
                        position: "relative",
                        height: "200px",
                        width: "460px",
                      }}
                    >
                      <h1
                        className="text-3xl font-bold text-black contoured-text z-10"
                        style={{
                          background:
                            "linear-gradient(90deg, #F2D755, #F987AF, #9B7960)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          textAlign: "center",
                        }}
                      >
                        {flashcardSet?.title}
                      </h1>
                      <FancyButton
                        onClick={() =>
                          navigate(`/play?flashcardSetId=${setId}`)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  );
}
