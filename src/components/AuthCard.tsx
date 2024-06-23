import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FloatingLabelInput } from "./FloatingLabelInput";
import Logo from "../assets/girl-title.svg";
import Background from "../assets/background.gif";

interface AuthCardProps {
  title: string;
  description: string;
  showUsernameInput?: boolean;
  customText: string;
  customLink: string;
  linkAppearance: string;
  onFormSubmit: (formData: {
    username?: string;
    email: string;
    password: string;
  }) => void;
}

export function AuthCard({
  title,
  description,
  showUsernameInput = false,
  customText,
  customLink,
  linkAppearance,
  onFormSubmit,
}: AuthCardProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFloating, setIsFloating] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isSpecialCharacter, setIsSpecialCharacter] = useState(false);
  const [isUppercaseLetter, setIsUppercaseLetter] = useState(false);
  const [isNumber, setIsNumber] = useState(false);
  const [isLength, setIsLength] = useState(false);

  const handleFocus = () => {
    setIsFloating(1);
  };

  const handleBlur = () => {
    if (password === "") {
      setIsFloating(0);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit({
      username: showUsernameInput ? username : undefined,
      email,
      password,
    });
  };

  useEffect(() => {
    if (isPasswordFocused) {
      checkPassword(password);
    }
  }, [password]);
  const checkPassword = (password: string) => {
    const minLength = 7;
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseLetterRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;

    if (password.length < minLength) {
      setIsLength(false);
    } else {
      setIsLength(true);
    }
    if (!specialCharacterRegex.test(password)) {
      setIsSpecialCharacter(false);
    } else {
      setIsSpecialCharacter(true);
    }
    if (!uppercaseLetterRegex.test(password)) {
      setIsUppercaseLetter(false);
    } else {
      setIsUppercaseLetter(true);
    }
    if (!numberRegex.test(password)) {
      setIsNumber(false);
    } else {
      setIsNumber(true);
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="max-w-md bg-white border-black" cardWidth={440}>
            <CardHeader className="flex flex-col items-center">
              <img src={Logo} alt="Logo" className="w-32 h-32 mb-3" />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="w-full" onSubmit={handleFormSubmit}>
                <div className="grid w-full gap-4">
                  {showUsernameInput && (
                    <div className="flex flex-col space-y-1">
                      <FloatingLabelInput
                        id="username"
                        type="text"
                        label="Username"
                        value={username}
                        onValueChange={(value) => setUsername(value)}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                      />
                    </div>
                  )}
                  <div className="flex flex-col space-y-1">
                    <FloatingLabelInput
                      type="text"
                      id="email"
                      label="Email"
                      value={email}
                      onValueChange={(value) => setEmail(value)}
                      handleFocus={handleFocus}
                      handleBlur={handleBlur}
                    />
                  </div>
                  <div
                    className="flex flex-col space-y-1"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  >
                    <FloatingLabelInput
                      type="password"
                      id="password"
                      label="Password"
                      value={password}
                      onValueChange={(value) => setPassword(value)}
                      handleFocus={handleFocus}
                      handleBlur={handleBlur}
                      isFloating={isFloating}
                      floatingSetter={setIsFloating}
                    />
                  </div>
                  <div className="flex flex-col space-y-3 items-center">
                    <Button
                      style={{
                        backgroundColor: "#F987AF",
                        marginTop: "1rem",
                      }}
                      type="submit"
                    >
                      {showUsernameInput ? "Create account" : "Log In"}
                    </Button>
                  </div>
                  <div
                    className="flex flex-col items-center"
                    style={{ marginTop: "-0.6rem" }}
                  >
                    {customText && (
                      <p style={{ fontSize: "0.9rem" }}>
                        {customText}{" "}
                        <a href={customLink} style={{ color: "#A4DEF7" }}>
                          {linkAppearance}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        {title === "Sign Up" && isPasswordFocused && (!isSpecialCharacter || !isLength || !isNumber || !isUppercaseLetter) && (
          <div
            className="absolute z-50 mt-16 p-1 rounded-xl text-xs text-center flex flex-col justify-end items-end"
            style={{
              backgroundColor: "transparent",
              marginBlockEnd: "1rem",
              left: "41rem",
            }}
          >
            <p style={{ color: "#F987AF" }} className="flex flex-row space-x-1">
              <div
                style={{ color: isLength ? "#AEDBAD" : "#F987AF" }}
              >
                7 characters long,
              </div>
              <div
                style={{
                  color: isSpecialCharacter
                    ? "#AEDBAD"
                    : "#F987AF",
                }}
              >
                1 special character
              </div>
            </p>
            <p style={{ color: "#F987AF" }} className="flex flex-row space-x-1">
              <div
                style={{
                  color: isUppercaseLetter ? "#AEDBAD" : "#F987AF",
                }}
              >
                1 uppercase letter,
              </div>
              <div
                style={{
                  color: isNumber ? "#AEDBAD" : "#F987AF",
                }}
              >
                1 digit
              </div>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
