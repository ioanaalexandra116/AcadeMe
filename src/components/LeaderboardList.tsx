import { useEffect, useState } from "react";
import { UserData } from "@/interfaces/interfaces";
import { getUserRanking } from "@/firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { Card } from "./ui/card";
import Avatar from "./Avatar";

export const Leaderboard = () => {
  const [userRanking, setUserRanking] = useState<UserData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPodium = async () => {
      try {
        const ranking = await getUserRanking();
        console.log(ranking);
        for (let i = 0; i < ranking.length; i++) {
          let avatarProps = ranking[i].avatarProps;
          avatarProps = {
            ...avatarProps,
            dimensions: "40px",
          };
          ranking[i].avatarProps = avatarProps;
        }
        setUserRanking(ranking);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clasament:", error);
      }
    };
    fetchPodium();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col items-center">
      <h1
        className="text-4xl font-bold text-black mt-5 mb-10 contoured-text"
        style={{
          color: "#f987af",
          textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Leaderboard
      </h1>
      <Card>
        {userRanking?.map((user, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-between w-full p-2"
          >
            <div
              className="flex flex-row items-center w-full space-x-4"
              style={{ marginLeft: index + 1 > 3 ? "0.5rem" : "0" }}
            >
              <p
                style={{
                  marginRight: index + 1 > 3 ? "0.3rem" : "0",
                  cursor: "default",
                }}
              >
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : index === 2
                  ? "🥉"
                  : index + 1}
              </p>
              <div
                className="flex flex-row items-center space-x-2 cursor-pointer"
                onClick={() => navigate(`/profile?userId=${user.id}`)}
              >
                <Avatar {...user.avatarProps} />
                <p>{user.username}</p>
              </div>
            </div>
            <div className="flex flex-row space-x-2 cursor-default">
              <p>{user.exp}</p>
              <p>EXP</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};
export default Leaderboard;
