import FollowList from "@/components/FollowList";
import Background from "@/assets/home-background.svg";

const Follow = () => {

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(164,222,247,0.3)",
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
        <div className="pt-16 pb-16">
          <FollowList />
        </div>
      </div>
    </div>
  );
};

export default Follow;
