import Post from "@/components/Post";
import { getFeedPostsIds } from "@/firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context";
import Loading from "@/components/Loading";
import Background from "@/assets/home-background.svg";
import { CarouselPlugin } from "@/components/HomeCarousel";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [feed, setFeed] = useState<string[]>([]);
  const { user, userLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!user && !userLoading) {
      setUnauthorized(true);
    }
  }, [user, userLoading]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchFeed = async () => {
      try {
        const feed = await getFeedPostsIds(user.uid);
        setFeed(feed.reverse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchFeed();
  }, [user]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <Navbar />
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
        <div style={{ position: "relative" }}>
          <div
            className="flex justify-center items-center pt-20"
            style={{ zIndex: 10, width: "100%" }}
          >
            {window.innerWidth > 768 && <CarouselPlugin />}
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
            {unauthorized && (
              <div
                className="flex flex-col justify-center items-center space-y-4"
                style={{ height: "180px" }}
              >
                <div className="flex justify-center items-center">
                  <h1
                    className="text-3xl font-bold contoured-text pt-4"
                    style={{
                      background: "linear-gradient(90deg, #F4D201, #DC0B72)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textAlign: "center",
                      width: "400px",
                      alignItems: "center",
                    }}
                  >
                    Log in to your account to see your feed
                  </h1>
                </div>
                <Button
                  onClick={() => window.location.assign("/search/people")}
                  className="bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"
                  size={"lg"}

                > Go To Login
                </Button>
              </div>
            )}
            {!unauthorized && feed.length === 0 && (
              <div
                className="flex flex-col justify-center items-center space-y-4"
                style={{ height: "180px" }}
              >
                <div className="flex justify-center items-center">
                  <h1
                    className="text-3xl font-bold contoured-text pt-4"
                    style={{
                      background: "linear-gradient(90deg, #F4D201, #DC0B72)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textAlign: "center",
                      width: "650px",
                      alignItems: "center",
                    }}
                  >
                    Your feed is empty. Follow your favorite creators to see
                    their posts here!
                  </h1>
                </div>
                <Button
                  onClick={() => window.location.assign("/search/people")}
                  className="bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"
                  size={"lg"}

                > Find Creators
                </Button>
              </div>
            )}
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
    </>
  );
};

export default Home;
