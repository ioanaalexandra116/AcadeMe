import GirlTitle from "../assets/girl-title.svg";
import Post from "@/components/Post";
import { getFeedPostsIds } from "@/firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import Background from "@/assets/home-background.svg";

const Home = () => {
  const [feed, setFeed] = useState<string[]>([]);
  const { user, userLoading } = useContext(AuthContext);

  if (!user || userLoading) {
    return <Loading />;
  }

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const feed = await getFeedPostsIds(user.uid);
        setFeed(feed);
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundAttachment: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          position: "relative",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflowY: "auto",
          boxSizing: "border-box",
          zIndex: 2,
        }}
      >
        <div className="flex flex-col items-center justify-center pt-16">
          {/* <img src={GirlTitle} className="w-50 h-50"></img> */}
          {feed.map((flashcardSetId) => (
            <div key={flashcardSetId} className="p-8 flex justify-center">
              <Post flashcardSetId={flashcardSetId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
