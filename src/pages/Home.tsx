import { Button } from "../components/ui/button";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import Background from "@/assets/laptop-background.svg";
import GirlTitle from "../assets/girl-title.svg";
const Home = () => {
  return (
    <>
      {/* <div
      className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${Background})` }}>
    </div> */}
      <div className="flex items-center justify-center">
        <img src={GirlTitle} className="w-50 h-50"></img>
      </div>
    </>
  );
};

export default Home;
