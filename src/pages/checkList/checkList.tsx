import React from "react";
import styles from "./checkList.module.css";

const LIST = ["칫솔", "담요", "수건", "충전기", "비상약"];

function checkList() {
  return (
    <div className={styles.checkList_container}>
      <div className={styles.checkList_header_container}>
        <div className={styles.checkList_header_contents}>
          <div className={styles.checkList_header_title}>
            <div>Check List</div>
          </div>
          <button className={styles.checkList_header_close_button}>
            <img className={styles.checkList_header_close_button_img} src="/icons/close_gray.jpg" alt="close icon" />
          </button>
        </div>
      </div>
      <div className={styles.checkList_main_container}>
        <div className={styles.checkList_main_nav}>
          <button className={styles.checkList_main_nav_select_all}>
            전체 선택
          </button>
          <span>|</span>
          <button className={styles.checkList_main_nav_delete}>삭제</button>
        </div>
        <div className={styles.checkList_main_contents}>
          {LIST.map((item, index) => (
            <div key={index} className={styles.checkList_main_content}>
              <input type="checkbox" id={`checkbox-${index}`} />
              <label>{item}</label> 
            </div>
          ))}
        </div>
      </div>
      <div className={styles.checkList_input_container}>
      <input 
          className={styles.checkList_input} 
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className={styles.checkList_input_button} onClick={handleSubmit}>
          <img src="/icons/arrow_circle_up_black.png" alt="Submit" />
        </button>
      </div>
    </div>
  );
}

export default checkList;
