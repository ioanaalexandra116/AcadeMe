import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Input, InputProps } from "./ui/input"; // Adjust the import path as needed
import ShowPassword from "../assets/show-password.svg";
import HidePassword from "../assets/hide-password.svg";

interface StyledLabelProps {
  isfloating: number;
}

interface FloatingLabelInputProps extends InputProps {
  label: string;
  onValueChange: (value: string) => void;
  isFloating?: number;
  handleFocus?: () => void;
  handleBlur?: () => void;
  floatingSetter?: (value: number) => void;
}

const FloatingLabelGroup = styled.div`
  position: relative;
  margin-top: 25px; /* Increase the margin for a higher label position */
`;

const StyledInput = styled(Input)`
  && {
    margin: 0; /* Reset margin added by global styles */
    padding: 10px 0; /* Adjust padding for a centered placeholder */
    width: 100%;
    padding-left: 10px; /* Add left padding */
    position: relative;

    input[type="password"] {
      padding-right: 30px; /* Adjust for the width of the toggle button */
    }
  }
`;

const StyledLabel = styled.label<StyledLabelProps>`
  position: absolute;
  left: 10px;
  top: ${({ isfloating }) => (isfloating ? "-30px" : "5px")};
  font-size: ${({ isfloating }) => (isfloating ? "0.75rem" : "0.9rem")};
  color: ${({ isfloating }) => (isfloating ? "#6E5949" : "#AA7D8C")};
  transition: all 0.2s ease;
  pointer-events: none;
  background-color: ${({ isfloating }) =>
    isfloating ? "white" : "transparent"};
  padding: ${({ isfloating }) => (isfloating ? "0 4px" : "0")};
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
`;

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  label,
  type,
  className,
  onValueChange,
  handleFocus,
  handleBlur,
  isFloating,
  floatingSetter,
  ...props
}) => {
  const [isfloating, setIsfloating] = useState(0);
  const [inputValue, setInputValue] = useState<string | undefined>(
    props.value !== undefined ? String(props.value) : undefined
  );

  useEffect(() => {
    if (floatingSetter) {
      floatingSetter(!!props.value ? 1 : 0);
    } else {
    setIsfloating(!!props.value ? 1 : 0);
    }
    setInputValue(props.value !== undefined ? String(props.value) : undefined);
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange(newValue); // Lift the state up to the parent component
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocusBasic = () => {
    setIsfloating(1);
  };

  const handleBlurBasic = () => {
    if (!inputValue) {
      setIsfloating(0);
    }
  };

  return (
    <FloatingLabelGroup>
        <StyledLabel htmlFor={id} isfloating={isFloating || isfloating}>
          {label}
        </StyledLabel>
      
      <StyledInput
        id={id}
        type={isPasswordVisible ? "text" : type}
        {...props}
        className={`${className}`}
        onFocus={type === "password" ? handleFocus : handleFocusBasic}
        onBlur={type === "password" ? handleBlur : handleBlurBasic}
        onChange={handleChange}
      />
      {type === "password" && (
        <ToggleButton type="button" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? (
            <img src={ShowPassword} alt="Show Password" />
          ) : (
            <img src={HidePassword} alt="Hide Password" />
          )}
        </ToggleButton>
      )}
    </FloatingLabelGroup>
  );
};

export { FloatingLabelInput };
