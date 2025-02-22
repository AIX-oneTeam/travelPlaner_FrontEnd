import React from "react";
import styles from "./Question.module.css";

function Question() {
  return (
    <div className={styles.question_container}>
      <div className={styles.question_content_container}>
        <div className={styles.question_email_container}>
          <h2 className={styles.question_container_title}>
            답변 받으실 이메일
          </h2>
          <input className={styles.question_email_input} type="text" placeholder="abcd123@easytravel.com"></input>
        </div>
        <div className={styles.question_type_container}>
          <h2 className={styles.question_container_title}>
            문의사항 유형
          </h2>
          <select className={styles.question_type_select}>
            <option value="">선택해주세요</option>
            <option value="usage">이용문의</option>
            <option value="business">비즈니스 문의</option>
          </select>
        </div>
        <div className={styles.question_main_content_container}>
          <h2 className={styles.question_container_title}>
            문의사항 내용
          </h2>
          <input
            className={styles.question_main_content_input}
            type="text"
            placeholder="문의하실 내용을 입력해주세요"
          ></input>
        </div>
        <div className={styles.question_final_button_container}>
          <h2 className={styles.question_final_button_title} hidden>
            문의하기 버튼
          </h2>
          <button className={styles.question_final_button}>문의하기</button>
        </div>
      </div>
    </div>
  );
}
export default Question;
