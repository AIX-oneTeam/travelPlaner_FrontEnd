import React from "react";
import "./PromptModal.css";
import SearchTextArea from "../input/SearchTextArea";

interface PromptModalProps {
  title: string;
  message: string;
  onClose: () => void; // 모달 닫기 함수
}

const PromptModal: React.FC<PromptModalProps> = ({ title, message, onClose }) => {
  return (
    <div id="prompt-modal-container">
      <div className="top-btn" onClick={onClose}>
        <img src="/icons/arrow-bottom-white.png" alt="close"></img>
      </div>
      <h2 className="modal-title">{title}</h2>
      <p className="modal-message">{message}</p>
      <SearchTextArea />
    </div>
  );
};

export default PromptModal;