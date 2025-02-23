import React, { useState, FormEvent } from "react";
import styles from "./Question.module.css";

function Question() {
  const [email, setEmail] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식

    const inquiryData = {
      email: email,
      registrationDate: currentDate,
      content: content
    };

    try {
      const response = await fetch('/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      if (response.ok) {
        alert('문의가 성공적으로 등록되었습니다.');
        setEmail("");
        setContent("");
      } else {
        alert('문의 등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('문의 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.question_container}>
      <form onSubmit={handleSubmit} className={styles.question_content_container}>
        <div className={styles.question_email_container}>
          <h2 className={styles.question_container_title}>
            답변 받으실 이메일
          </h2>
          <input 
            className={styles.question_email_input} 
            type="email" 
            placeholder="abcd123@easytravel.com"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.question_main_content_container}>
          <h2 className={styles.question_container_title}>
            문의사항 내용
          </h2>
          <textarea
            className={styles.question_main_content_input}
            placeholder="문의하실 내용을 입력해주세요"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className={styles.question_final_button_container}>
          <h2 className={styles.question_final_button_title} hidden>
            문의하기 버튼
          </h2>
          <button type="submit" className={styles.question_final_button}>문의하기</button>
        </div>
      </form>
    </div>
  );
}

export default Question;
