import React, { useState } from "react";
import "./NormalInput.css";

interface NormalInputProps {
  type?: "text" | "password" | "email" | "number" | "tel";
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NormalInput: React.FC<NormalInputProps> = ({
  type = "text",
  placeholder = "입력해주세요",
  onChange = () => {},
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  onChange = inputHandler;
  return (
    <div id="NormalInput-container">
      <label htmlFor="input">
        <input
          className="NormalInput-box"
          name="input"
          type={type}
          placeholder={placeholder}
          value={inputValue}
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default NormalInput;
