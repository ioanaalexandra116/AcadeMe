import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import GirlTitle from "../assets/main-logo.svg";
import { FlashcardSet, AvatarProperties, UserData } from "@/interfaces";
import {
  getMostPlayedSetId,
  getFlashcardSet,
  getUsername,
  getAvatarProps,
  getUserRanking,
} from "@/firebase/firestore";
import Loading from "./Loading";
import MostPopular from "@/assets/most-popular.svg";
import AdvanceCateg from "@/assets/advance-categ.svg";
import FancyButton from "./FancyButton";
import { useNavigate } from "react-router-dom";
import PlayPreview from "@/assets/play-preview.svg";
import SecondCardBackground from "@/assets/carousel-background-2.jpg";
import Podium from "@/assets/podium.svg";
import Avatar from "./Avatar";

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
  const navigate = useNavigate();

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

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
            dimensions: "80px",
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
      setLoading(false);
    }
  }, [flashcardSet]);

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-4xl flex items-center justify-center"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselPrevious />
      <CarouselContent>
        <CarouselItem key={"logo"}>
          <div className="p-0.5">
            <Card style={{ width: 880, height: 400 }}>
              <CardContent className="flex items-center justify-center h-full">
                <img
                  src={GirlTitle}
                  style={{
                    width: "400px",
                    height: "400px",
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
        {/* Second place (left) */}
        <div className="absolute" style={{ top: 100, left: 220, zIndex: 10 }}>
          <Avatar {...topUsers[1]?.avatarProps}/>
        </div>
        {/* First place (center) */}
        <div className="absolute" style={{ top: 10, left: 395, zIndex: 10 }}>
          <Avatar {...topUsers[0]?.avatarProps}/>
        </div>
        {/* Third place (right) */}
        <div className="absolute" style={{ top: 170, left: 580, zIndex: 10 }}>
          <Avatar {...topUsers[2]?.avatarProps}/>
        </div>
        {/* Podium Image */}
        <img
          src={Podium}
          alt="Podium"
          style={{
            position: "relative",
            width: "520px",
            height: "410px",
            top: "30px",
            left: "145px",
          }}
        />
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
                backgroundImage: `url(${SecondCardBackground})`,
              }}
            >
              <CardContent className="h-full w-full flex-col items-center justify-center">
                <img
                  className="text-4xl font-bold text-black contoured-text flex justify-center z-10"
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
                        onClick={() =>
                          window.location.replace(
                            `/profile?userId=${flashcardSet?.creator}`
                          )
                        }
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
                      }}
                    >
                      {flashcardSet?.title}
                    </h1>
                    <FancyButton
                      onClick={() => navigate(`/play?flashcardSetId=${setId}`)}
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
  );
}
