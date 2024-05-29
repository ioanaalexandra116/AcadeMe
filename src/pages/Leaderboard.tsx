import LeaderboardList from "@/components/LeaderboardList";

import Background from "@/assets/leaderboard-background.svg";

const Leaderboard = () => {
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
            backgroundColor: "rgb(255,242,157)",
            overflow: "hidden",
          }}
        />
  
        <div
          style={{
            backgroundImage: `url(${Background})`, 
            backgroundSize: "100%",
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
            <LeaderboardList />
          </div>
        </div>
      </div>
    );
  };

export default Leaderboard;