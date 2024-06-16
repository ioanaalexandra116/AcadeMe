import NotificationsList from "../components/NotificationsList";
import Background from "@/assets/home-background.svg";

const Notifications = () => {
  return (
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
        overflow: "auto",
      }}
    >
      <NotificationsList />
    </div>
  );
};

export default Notifications;
