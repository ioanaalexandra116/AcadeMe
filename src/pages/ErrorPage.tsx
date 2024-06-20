import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import sadGirl from "../assets/sad-girl.svg";

const ErrorPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img
        src={sadGirl}
        alt="
        "
        className="w-96 h-96"
      />
      <div className="flex flex-row items-center justify-center">
        <h1
          className="text-3xl font-bold text-black contoured-text z-20"
          style={{
            background: "linear-gradient(90deg, #9B7960, #F987AF, #F2D755)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            height: "200px",
          }}
        >
          Oops... something went wrong
        </h1>
        <h1 className="text-3xl font-bold text-black contoured-text z-20"
        style={{
            height: "200px",
        }}
        >
        🤕
        </h1>
      </div>
    </div>
  );
};

export default ErrorPage;
