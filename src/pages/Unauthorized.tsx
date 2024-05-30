import FancyButton from "@/components/FancyButton";
import logo from "@/assets/girl.svg";

const Unauthorized = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <img src={logo} alt="logo" className="w-80" />
        <h1
          className="text-4xl font-bold z-10"
          style={{
            background: "linear-gradient(90deg, #F2D755, #F987AF, #9B7960)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            width: "500px",
          }}
        >
          Create an account or log in to unlock the full experience!
        </h1>
        <div className="flex flex-row justify-center space-x-4 mt-8">
          <FancyButton message="REGISTER" />
          <FancyButton message="LOGIN" />
        </div>
      </div>
    </>
  );
};

export default Unauthorized;
