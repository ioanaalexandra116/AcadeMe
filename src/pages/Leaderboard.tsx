import LeaderboardList from "@/components/LeaderboardList";
import Background from "@/assets/official-leaderboard-background.svg";

const Leaderboard = () => {

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgb(255,242,157)",
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          zIndex: -1,
        }}
      />
      <div
        style={{
          height: "100%",
          width: "100%",
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
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
