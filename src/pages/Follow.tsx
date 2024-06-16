import FollowList from "@/components/FollowList";

import Background from "@/assets/home-background.svg";

const Follow = () => {
    const smallScreen = window.innerWidth < 780;
    return (
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: smallScreen ? screen.width : "100vw",
            height: smallScreen ? screen.height : "100vh",
            backgroundColor: "rgba(164,222,247,0.3)",
            overflow: "hidden",
          }}
        />
  
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
            overflow: "hidden",
          }}
        >
          <div className="pt-16">
            <FollowList />
          </div>
        </div>
      </div>
    );
  };

export default Follow;