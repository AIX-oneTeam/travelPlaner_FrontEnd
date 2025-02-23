import React, { useState } from "react";
import styles from "./SurveyModal.module.css";
interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const SurveyModal: React.FC<SurveyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>설문조사</h2>
        <div>
          <label>별점: </label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            min={1}
            max={5}
          />
        </div>
        <div>
          <label>의견: </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="설문 의견을 입력하세요"
          />
        </div>
        <button onClick={() => onSubmit(rating, comment)}>제출</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  );
};

export default SurveyModal;
