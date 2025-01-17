import React, { useState } from "react";
import "./SearchTextArea.css";

interface TextAreaInputProps {
  type?: "text" | "password" | "email" | "number" | "tel";
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const SearchTextArea: React.FC<TextAreaInputProps> = ({
  type = "text",
  placeholder = "입력해주세요",
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const inputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  if (onChange === undefined) {
    onChange = inputHandler;
  }

  return (
    <div id="searchTextArea-container">
      <div className="textArea-box">
        <textarea
          className="searchTextArea-box"
          name="prompt-input"
          placeholder={placeholder}
          value={inputValue}
          rows={5}
          onChange={onChange}
        ></textarea>
        <img
          id="send-btn"
          className={`prompt-send-btn ${inputValue === "" ? "none" : ""}`}
          src="/icons/arrow_up_white.png"
          alt="send"
        ></img>
      </div>
    </div>
  );
};

export default SearchTextArea;
