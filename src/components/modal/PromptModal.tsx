import React from "react";
import "./PromptModal.css";
import SearchTextArea from "../input/SearchTextArea";

interface PromptModalProps {
  title: string;
  message: string;
}

const PromptModal: React.FC<PromptModalProps> = ({ title, message }) => {
  return (
    <div id="prompt-modal-container">
      <div className="top-btn">
        <img src="/icons/arrow-bottom-white.png" alt="close"></img>
      </div>
      <h2 className="modal-title">{title}</h2>
      <p className="modal-message">{message}</p>
      <SearchTextArea />
    </div>
  );
};

export default PromptModal;
