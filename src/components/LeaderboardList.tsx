import React, { useEffect, useState, useContext } from "react";
import { UserData } from "@/interfaces/interfaces";
import { getUserRanking, doesUserHaveExp } from "@/firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { Card } from "./ui/card";
import Avatar from "./Avatar";
import { AuthContext } from "@/context";
import "./Leaderboard.css";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export const Leaderboard: React.FC = () => {
  const { user, userLoading } = useContext(AuthContext);
  const [userRanking, setUserRanking] = useState<UserData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    const fetchPodium = async () => {
      try {
        const ranking = await getUserRanking();
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

    const checkExp = async () => {
      if (!user) return;
      const hasExp = await doesUserHaveExp(user.uid);
      if (!hasExp) {
        setSuccess(true);
      }
    };

    checkExp();
    fetchPodium();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
      <AlertDialog open={success} onOpenChange={setSuccess}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogTitle>Don't see yourself here?</AlertDialogTitle>
            <AlertDialogDescription>
              You don't have any experience points yet. Go ahead and play
              flashcard sets to earn some!
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSuccess(false)}>
                Close
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setSuccess(false);
                  navigate("/search/flashcards");
                }}
              >
                Find Flashcards
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <div className="flex flex-col items-center">
        <h1
          className="relative text-4xl font-bold text-black mt-5 mb-10 contoured-text z-0"
          style={{
            color: "#E5B700",
            textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            letterSpacing: "1px",
          }}
        >
          Leaderboard
        </h1>
        <span className="leaderboard-title z-10 relative">Leaderboard</span>
        <Card className="relative" style={{ bottom: "80px", width: "400px" }}>
          {userRanking?.map((user, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between w-full p-2 pl-6 pr-6"
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
    </>
  );
};

export default Leaderboard;
