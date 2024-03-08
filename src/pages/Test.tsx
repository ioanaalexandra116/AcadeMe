import { Button } from "../components/ui/button";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import ColorPicker from "@/components/ColorPicker";
import { ColorPalette } from "@/components/ColorPicker";

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
      {/* <Button
        onClick={handleLogOut}
        className="absolute top-4 right-4"
        style={{ backgroundColor: "#CBE0CF" }}
      >
        Log out
      </Button> */}
      <ColorPicker />
    </>
  );
};

export default Test;
