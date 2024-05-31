import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/sad-girl.svg";
import happy from "@/assets/happy-girl.svg";

interface UnauthorizedPopupProps {
  success: boolean;
  setSuccess: (value: boolean) => void;
}

const buttonStyle = {
  background: "linear-gradient(45deg, #F987AF, #F2D755)",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  backgroundSize: "200% 200%",
  animation: "gradientAnimation 2s ease infinite",
};

const UnauthorizedPopup = ({ success, setSuccess }: UnauthorizedPopupProps) => {
  const navigate = useNavigate();
  const [sad, setSad] = useState(true);
  return (
    <AlertDialog open={success} onOpenChange={setSuccess}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          {sad ? (
            <img src={logo} alt="logo" className="w-40" />
          ) : (
            <img src={happy} alt="logo" className="w-40" />
          )}
          <AlertDialogTitle>Limited Access</AlertDialogTitle>
          <AlertDialogDescription>
            Create an account or log in to unlock the full AcadeMe experience!
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSuccess(false)}>
              Close
            </AlertDialogCancel>
            <div>
              {!sad && (
                <style>
                  {`
                  @keyframes gradientAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                `}
                </style>
              )}
              <AlertDialogAction
                onClick={() => navigate("/login")}
                onMouseEnter={() => setSad(false)}
                onMouseLeave={() => setSad(true)}
                style={!sad ? buttonStyle : { backgroundColor: "#F987AF" }}
              >
                Sign in
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnauthorizedPopup;
