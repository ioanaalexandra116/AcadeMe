import { AuthCard } from "@/components/AuthCard";
import { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, actionCodeSettings } from "../firebase/config";
import {
  createFirestoreUser,
  checkUsername,
  formatErrorMessage,
} from "../firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AuthContext, fromRegisterContext } from "../context";
import { ErrorMessasge, FirebaseError } from "../interfaces";
import { fromRegisterContextType } from "../interfaces/interfaces";
import { CustomToaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Background from "../assets/background.gif";
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
import Loading from "@/components/Loading";

const Register = () => {
  const [err, setErr] = useState<ErrorMessasge>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, userLoading } = useContext(AuthContext);
  const { setFromRegister } = (useContext(
    fromRegisterContext
  ) as fromRegisterContextType) ?? { setFromRegister: () => {} };
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && user && user.emailVerified) {
      navigate("/");
    }
  }, [userLoading, user]);

  useEffect(() => {
    if (err) {
      toast(formatErrorMessage(err));
    }
    setErr(null);
  }, [err]);

  function checkPassword(password: string) {
    const minLength = 7;
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseLetterRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;

    if (password.length < minLength) {
      return "Password must be at least 7 characters long";
    }
    if (!specialCharacterRegex.test(password)) {
      return "Password must contain at least one special character";
    }
    if (!uppercaseLetterRegex.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!numberRegex.test(password)) {
      return "Password must contain at least one number";
    }

    return "Success";
  }

  const handleRegister = async (formData: {
    username?: string;
    email: string;
    password: string;
  }) => {
    const { username, email, password } = formData;
    const passwordResult = checkPassword(password);
    setErr(null);
    if (!username) {
      setErr("Username is required");
      return;
    }
    if (!email) {
      setErr("Email is required");
      return;
    }
    if (!password) {
      setErr("Password is required");
      return;
    }
    if (username.length < 3) {
      setErr("Username must be at least 3 characters long");
      return;
    }
    if (passwordResult !== "Success") {
      setErr(passwordResult);
      return;
    }
    if ((await checkUsername(username)) === false) {
      setErr("Username is already taken");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        setLoading(true);
        setFromRegister(true);
        await sendEmailVerification(userCredential.user, actionCodeSettings);
        setSuccess(true);
        setLoading(false);
        await createFirestoreUser(userCredential.user, username);
      }
    } catch (error) {
      console.error(error);
      toast(formatErrorMessage((error as FirebaseError).message));
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      {success ? (
        <div
          className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
          style={{ backgroundImage: `url(${Background})` }}
        >
          <AlertDialog open={success} onOpenChange={setSuccess}>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogTitle>Registration Successful</AlertDialogTitle>
              <AlertDialogDescription>
                Your account has been created successfully. Please verify your
                email address.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSuccess(false)}>
                  Close
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => navigate("/login")}>
                  Go to Login
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : loading ? (
        <div
          className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
          style={{ backgroundImage: `url(${Background})` }}
        >
          <Loading />
        </div>
      ) : (
        <div>
          <AuthCard
            onFormSubmit={handleRegister}
            title="Sign Up"
            description="Create an account to get started"
            showUsernameInput={true}
            customText="Already have an account? "
            customLink="/login"
            linkAppearance="Sign In"
          />
          <CustomToaster
            toastOptions={{
              classNames: {
                toast: `group toast group-[.toaster]:bg-red-200 group-[.toaster]:text-red-700 group-[.toaster]:border-red-700 group-[.toaster]:rounded-xl`,
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Register;
