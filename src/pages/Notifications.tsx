import NotificationsList from "../components/NotificationsList";
import Background from "@/assets/notif-background.svg";

const Notifications = () => {
    const smallScreen = window.innerWidth < 780;
    return (
      <div style={{ position: "relative" }}>
        {/* Background color container */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: smallScreen ? screen.width : "100%",
            height: smallScreen ? screen.height : "100%",
            backgroundColor: "rgba(164,222,247,0.3)", // Example: semi-transparent black
          }}
        />
  
        {/* Background image */}
        <div
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "top",
            backgroundAttachment: "fixed",
            zIndex: 1, // Ensure the image is above the color layer
            position: "relative",
          }}
        >
          {/* Content */}
          <div className="pt-16">
            <NotificationsList />
          </div>
        </div>
      </div>
    );
  };

export default Notifications;
