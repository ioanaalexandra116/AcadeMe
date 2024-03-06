import Background from "../assets/background.gif";
import { Button } from "../components/ui/button";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

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
      <div
        className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${Background})` }}
      ></div>
      <Button onClick={handleLogOut} className="absolute top-4 right-4" style={{ backgroundColor: "#F987AF" }}>
        Log out
      </Button>
    </>
  );
};

export default Test;
