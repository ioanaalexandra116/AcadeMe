import { getActivities, getFlashcardSet } from "@/firebase/firestore";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "@/context";
import { useState, useContext, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { FlashcardSet } from "@/interfaces";
import Background from "@/assets/laptop-background.svg";
import ReplayButton from "@/assets/replay-button.svg";
import { Card } from "@/components/ui/card";
import AdvanceCateg from "../assets/advance-categ.svg";

const Results = () => {
  const [scores, setScores] = useState<number[]>([]);
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get("flashcardSetId");
  const { user, userLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(0);
  const [barColor, setBarColor] = useState("#7DD999");

  if (!user || userLoading) {
    return;
  }

  if (!postId) {
    return;
  }

  useEffect(() => {
    if (!userLoading) {
      getActivities(user.uid, postId).then((data) => {
        setScores(data);
      });
      getFlashcardSet(postId).then((data) => {
        if (data) {
          setFlashcardSet(data);
        }
      });
    }
  }, [userLoading, user, postId]);

  useEffect(() => {
    if (flashcardSet && scores) {
      setPercentage(
        (scores[scores.length - 1] /
          Object.keys(flashcardSet.flashcards).length) *
          10
      );
    }
  }, [flashcardSet, scores]);

  useEffect(() => {
    console.log(percentage);
    if (percentage < 40) {
      setBarColor("#F6675E");
    } else if (percentage < 70) {
      setBarColor("#F2D755");
    } else {
      setBarColor("#7DD999");
    }
  }, [percentage]);

  return window.innerWidth > 768 ? (
    <div className="flex flex-col items-center justify-center relative z-10 w-screen h-screen overflow-y-auto">
      <div
        className="absolute w-screen h-screen z-0"
        style={{ backgroundColor: "#A4DEF7", opacity: 0.5 }}
      >
        <div
          className="absolute top-0 left-0 w-screen h-screen bg-no-repeat bg-center z-0 bg-cover"
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
          }}
        ></div>
      </div>
      <h1
        className="text-4xl font-bold text-black mb-4 contoured-text flex justify-center z-10"
        style={{
          color: "#F987AF",
          textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
        }}
      >
        You gained {scores[scores.length - 1]} exp
      </h1>
      <h1 className="z-10 mb-2">Accuracy</h1>
      <Card
        style={{
          width: "480px",
          height: "20px",
          backgroundColor: "#Fff",
          zIndex: 10,
          marginBottom: "64px",
          borderRight: "1px solid black",
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
        }}
        className="flex items-center justify-start"
      >
        {flashcardSet && (
          <Card
            style={{
              width:
                (scores[scores.length - 1] /
                  Object.keys(flashcardSet.flashcards).length) *
                  48 +
                "px",
              height: "20px",
              backgroundColor: barColor,
              zIndex: 10,
            }}
            className="flex justify-center items-center border border-black"
          >
            <p className="text-xs">{Math.floor(percentage) + "%"}</p>
          </Card>
        )}
      </Card>

      <div className="flex flex-row items-center justify-center space-x-40">
        <div className="flex flex-col items-center">
          <h1
            className="text-3xl font-bold text-black mb-2 contoured-text flex justify-center z-10"
            style={{
              color: "#F987AF",
              textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
            }}
          >
            {flashcardSet?.title}
          </h1>
          <div style={{ position: "relative" }}>
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
            <img
              src={ReplayButton}
              alt="replay button"
              className="relative bottom-4 left-52 w-16 h-16 z-10 cursor-pointer"
              onClick={() => navigate(`/play?flashcardSetId=${postId}`)}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center">
            {flashcardSet?.category.map((category, index) => (
              <span
                key={index}
                className="text-md text-pink-500"
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
                <Link to={`/search/flashcards?categories=${flashcardSet?.category}&selected=${category}`}
                className="relative">
                  {category}
                </Link>
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="z-10 mb-2">Progress</h1>
          <div className="z-10">
            <Card
              style={{
                width: "540px",
                height: "360px",
                backgroundColor: "#fff",
              }}
              className="flex items-center justify-center border border-black"
            >
              <ReactApexChart
                options={{
                  colors: ["#F987AF"],
                  chart: {
                    id: "score graph",
                    toolbar: {
                      show: false,
                    },
                  },
                  xaxis: {
                    categories: scores.map((_, index) => index + 1),
                  },
                  yaxis: {
                    min: 0,
                    max:
                      flashcardSet && flashcardSet.flashcards
                        ? Object.keys(flashcardSet.flashcards).length * 10
                        : 100,
                    tickAmount:
                      (flashcardSet && flashcardSet.flashcards
                        ? Object.keys(flashcardSet.flashcards).length * 10
                        : 100) / 10,
                  },
                }}
                series={[
                  {
                    name: "Score",
                    data: scores,
                  },
                ]}
                type="line"
                width={500}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // small screen version
    <div className="flex flex-col items-center justify-center relative z-10 w-screen h-screen overflow-y-auto">
      <div
        className="absolute w-screen h-screen z-0"
        style={{ backgroundColor: "#A4DEF7", opacity: 0.5 }}
      >
        <div
          className="absolute top-0 left-0 w-screen h-screen bg-no-repeat bg-center z-0 bg-cover"
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
          }}
        ></div>
      </div>
      <h1
        className="text-4xl font-bold text-black mb-4 contoured-text flex justify-center z-10 pt-10"
        style={{
          color: "#F987AF",
          textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
        }}
      >
        You gained {scores[scores.length - 1]} exp
      </h1>
      <h1 className="z-10 mb-2">Accuracy</h1>
      <Card
        style={{
          width: "340px",
          height: "20px",
          backgroundColor: "#fff",
          zIndex: 10,
          borderRight: "1px solid black",
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
        }}
        className="flex items-center justify-start mb-4"
      >
        {flashcardSet && (
          <Card
            style={{
              width:
                (scores[scores.length - 1] /
                  Object.keys(flashcardSet.flashcards).length) *
                  34 +
                "px",
              height: "20px",
              backgroundColor: barColor,
              zIndex: 10,
            }}
            className="flex justify-center items-center border border-black"
          >
            <p className="text-xs">{percentage + "%"}</p>
          </Card>
        )}
      </Card>

      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <h1 className="z-10 mb-2">Progress</h1>
            <div className="z-10">
              <Card
                style={{
                  width: window.innerWidth - 10 + "px",
                  height: window.innerHeight / 4 + "px",
                  backgroundColor: "#fff",
                }}
                className="flex items-center justify-center border border-black mb-4"
              >
                <ReactApexChart
                  options={{
                    colors: ["#F987AF"],
                    chart: {
                      id: "score graph",
                      toolbar: {
                        show: false,
                      },
                    },
                    xaxis: {
                      categories: scores.map((_, index) => index + 1),
                    },
                    yaxis: {
                      min: 0,
                      max:
                        flashcardSet && flashcardSet.flashcards
                          ? Object.keys(flashcardSet.flashcards).length * 10
                          : 100,
                      tickAmount:
                        (flashcardSet && flashcardSet.flashcards
                          ? Object.keys(flashcardSet.flashcards).length * 10
                          : 100) / 10,
                    },
                  }}
                  series={[
                    {
                      name: "Score",
                      data: scores,
                    },
                  ]}
                  type="line"
                  width={window.innerWidth - 10}
                  height={window.innerHeight /4}
                />
              </Card>
            </div>
          </div>
          <h1
            className="text-3xl font-bold text-black mb-2 contoured-text flex justify-center z-10"
            style={{
              color: "#F987AF",
              textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
            }}
          >
            {flashcardSet?.title}
          </h1>
          <div style={{ position: "relative" }}>
            <Card
              className="absolute top-4 left-0 border-black rounded-xl"
              style={{ width: "250px", height: "147px", zIndex: 1 }}
            ></Card>
            <Card
              className="absolute top-2 left-2 border-black rounded-xl"
              style={{ width: "250px", height: "147px", zIndex: 0 }}
            ></Card>
            <Card
              className="relative top-6 right-2 flex items-center justify-center border-black rounded-xl overflow-hidden"
              style={{ width: "250px", height: "147px", zIndex: 2 }}
            >
              <img
                src={flashcardSet?.cover}
                alt="cover"
                style={{ maxWidth: "245px", maxHeight: "142px" }}
              />
            </Card>
            <img
              src={ReplayButton}
              alt="replay button"
              className="relative bottom-4 left-40 w-16 h-16 z-10 cursor-pointer"
              onClick={() => navigate(`/play?flashcardSetId=${postId}`)}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center">
            {flashcardSet?.category.map((category, index) => (
              <span
                key={index}
                className="text-md text-pink-500"
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
                <Link to={`/search?category=${category}`} className="relative">
                  {category}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
