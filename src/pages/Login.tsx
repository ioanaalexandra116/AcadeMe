import { AuthCard } from "@/components/AuthCard";
import { useContext, useEffect, useState } from "react";
import { AuthContext, fromRegisterContext } from "../context";
import { useNavigate } from "react-router-dom";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { FirebaseError } from "firebase/app";
import { ErrorMessasge } from "../interfaces/interfaces";
import { fromRegisterContextType } from "../interfaces/interfaces";
import { CustomToaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { formatErrorMessage } from "../firebase/firestore";

const Login = () => {
  const [err, setErr] = useState<ErrorMessasge>(null);
  const { user, userLoading } = useContext(AuthContext);
  const { fromRegister, setFromRegister } =
    (useContext(fromRegisterContext) as fromRegisterContextType) ?? false;
  const navigate = useNavigate();

  useEffect(() => {
    if (err) {
      toast(formatErrorMessage(err));
    }
    setErr(null);
  }, [err]);

  const modalHandler = () => {
    if (fromRegister) {
      setFromRegister(false);
      return;
    }
  };

  useEffect(() => {
    if (!userLoading && user && user.emailVerified) {
      navigate("/");
    }
  }, [userLoading, user]);

  useEffect(() => {
    modalHandler();
  }, [fromRegister]);

  useEffect(() => {
    if (
      isSignInWithEmailLink(auth, window.location.href) &&
      auth.currentUser?.emailVerified
    ) {
      const email = window.localStorage.getItem("emailForSignIn");
      signInWithEmailLink(auth, email as string, window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
        })
        .catch((error) => {
          console.error(error);
        });
    }
    modalHandler();
  }, []);

  const handleLogin = async (formData: {
    email: string;
    password: string;
  }) => {
    const { email, password } = formData;

    if (!email || !password) {
      setErr("Please complete both fields in order to log in.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      if (!userCredential.user.emailVerified) {
        setErr("You have to verify your email address before logging in");
        auth.signOut();
        return;
      }

      navigate("/");

    } catch (error: unknown) {
        console.error(error);
        toast(formatErrorMessage((error as FirebaseError).message));
    }
  };

  return (
    <div className="grid place-items-center h-screen">
        <AuthCard
            onFormSubmit={handleLogin}
            title="Sign In"
            description="Log in to your account"
            showUsernameInput={false}
            customText="You don't have an account? "
            customLink="/register"
            linkAppearance="Sign Up"
          />
          <CustomToaster
            toastOptions={{
              classNames: {
                toast: `group toast group-[.toaster]:bg-red-200 group-[.toaster]:text-red-700 group-[.toaster]:border-red-700`,
              },
            }}
          />
    </div>
  );
};

export default Login;
