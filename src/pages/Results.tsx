import { getActivities, getFlashcardSet } from "@/firebase/firestore";
import { useLocation } from "react-router-dom";
import { AuthContext } from "@/context";
import { useState, useContext, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { FlashcardSet } from "@/interfaces";

const Results = () => {
  const [scores, setScores] = useState<number[]>([]);
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postId = queryParams.get("flashcardSetId");
  const { user, userLoading } = useContext(AuthContext);

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

  return (
    <div className="pt-16">
      <h1>Results</h1>
      <div>
        {scores.map((score, index) => {
          return (
            <div key={index}>
              <p>Score: {score}</p>
            </div>
          );
        })}
        <ReactApexChart
          options={{
            colors : ['#F987AF'],
            chart: {
              id: "basic-line",
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              categories: scores.map((_, index) => index + 1),
            },
            yaxis: {
              min: 0,
              max: flashcardSet && flashcardSet.flashcards ? Object.keys(flashcardSet.flashcards).length * 10 : 100,
              tickAmount: (flashcardSet && flashcardSet.flashcards ? Object.keys(flashcardSet.flashcards).length * 10 : 100) / 10,
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
      </div>
    </div>
  );
};

export default Results;
