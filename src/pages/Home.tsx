import Post from "@/components/Post";
import { getFeedPostsIds } from "@/firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import Background from "@/assets/home-background.svg";
import { CarouselPlugin } from "@/components/HomeCarousel";

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
        setFeed(feed.reverse());
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div style={{ position: "relative"}}>
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
      <div style={{ position: "relative" }}>
        <div
          className="flex justify-center items-center pt-20"
          style={{ zIndex: 10, width: "100%" }}
        >
          <CarouselPlugin />
        </div>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflowY: "auto",
            boxSizing: "border-box",
            zIndex: 2,
          }}
        >
          <div className="flex flex-wrap justify-center items-center">
            {feed.map((flashcardSetId) => (
              <div key={flashcardSetId} className="p-4 flex justify-center">
                <Post flashcardSetId={flashcardSetId} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
