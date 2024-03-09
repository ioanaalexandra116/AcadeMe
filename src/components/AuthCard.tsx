import React, { useState } from "react";
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit({
      username: showUsernameInput ? username : undefined,
      email,
      password,
    });
  };

  return (
    <div
      className="bg-cover bg-center h-screen w-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${Background})` }}
    >
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
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <FloatingLabelInput
                    type="password"
                    id="password"
                    label="Password"
                    value={password}
                    onValueChange={(value) => setPassword(value)}
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
                      {customText}
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
    </div>
  );
}
