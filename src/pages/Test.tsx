import Background from "../assets/background.gif";
import { Button } from "../components/ui/button";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import Avatar from "@/components/Avatar";
import Loading from "@/components/Loading";

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
      {/* <div
        className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${Background})` }}
      ></div> */}
      <Button
        onClick={handleLogOut}
        className="absolute top-4 right-4"
        style={{ backgroundColor: "#CBE0CF" }}
      >
        Log out
      </Button>
      <Avatar
        backgroundColor="#F9E0AE"
        mouthColor="#F9E0CE"
        eyeColor="#0a84a5"
        eyelidsColor="#231F20"
        hairColor="#B4863C"
        skinColor="#ecbf9d"
        noseColor="#B4863C"
      />
    </>
  );
};

export default Test;
