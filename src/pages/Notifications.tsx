import NotificationsList from "../components/NotificationsList";
import Background from "@/assets/home-background.svg";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const Notifications = () => {
  const [allRead, setAllRead] = useState(false);

  const updateDot = () => {
    setAllRead(true);
  }

  return (
    <>
    <Navbar allRead={allRead} />
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
      <NotificationsList updateDot={updateDot} allRead={allRead} />
    </div>
    </>
  );
};

export default Notifications;
