import SearchUser from "@/components/SearchUser";

import Background from "@/assets/notif-background.svg";

const SearchUserPage = () => {
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
            <SearchUser />
          </div>
        </div>
      </div>
    );
  };

export default SearchUserPage;
