import { Button } from "../components/ui/button";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import ColorPicker from "@/components/ColorPicker";
import { CustomAvatarTabs } from "@/components/CustomAvatarTabs";

const Test = () => {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await auth.signOut();
      await auth.updateCurrentUser(null);
      navigate("/login");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Button
        onClick={handleLogOut}
        className="absolute top-4 right-4"
        style={{ backgroundColor: "#CBE0CF" }}
      >
        Log out
      </Button>
      
    </>
  );
};

export default Test;
