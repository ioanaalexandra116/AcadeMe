import Post from "@/components/Post";
import { getCheckPostsIds, getUsername } from "@/firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import Background from "@/assets/home-background.svg";

const Verify = () => {
  const [check, setFeed] = useState<string[]>([]);
  const { user, userLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user || userLoading) {
      return;
    }
    const fetchFeed = async () => {
      try {
        const check = await getCheckPostsIds(user.uid);
        setFeed(check.reverse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching check:", error);
      }
    };

    const fetchUsername = async () => {
      try {
        const username = await getUsername(user.uid);
        setUsername(username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchFeed();
    fetchUsername();
    setLoading(false);
  }, [user]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <div style={{ position: "relative" }}>
        <div
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundAttachment: "fixed",
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        />
        <div className="flex flex-col items-center justify-center h-full w-full">
          <h1
            className="text-4xl font-bold text-black mt-4 mb-10 contoured-text"
            style={{
              color: "#f987af",
              textShadow: `-0.5px -0.5px 0 #000, 2px -0.5px 0 #000, -0.5px 1px 0 #000, 2px 1px 0 #000`,
            }}
          >
            {username !== "admin"
              ? "Only Admins Can Access This Page"
              : "Approve or Reject Flashcard Sets"}
          </h1>
          {username === "admin" && (
            <div className="flex flex-wrap justify-center items-center">
              {check.map((flashcardSetId) => (
                <div key={flashcardSetId} className="flex justify-center">
                  <Post flashcardSetId={flashcardSetId} verify={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Verify;
