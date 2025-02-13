import React, { useState, useEffect } from "react";
import styles from "./CheckList.module.css";
import { API_BASE_URL } from "../../config";
import Plan from "../plan/Plan";
import { useParams } from "react-router-dom";


function CheckList() {

  const [items, setItems] = useState<
    { text: string; id: number; checked: boolean;}[]
  >([]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    //1. 엔터 클릭 시
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault(); // 기본 동작 방지
      const newItem = { text: "", id: Date.now(), checked: false };
      const updatedItems = [...items];
      updatedItems[index].text = e.currentTarget.value.trim();
      updatedItems.splice(index + 1, 0, newItem);
      setItems(updatedItems);
      setTimeout(() => {
        const nextInput = document.querySelector(
          `input[type="text"][data-index="${index + 1}"]`
        ) as HTMLInputElement;
        if (nextInput) nextInput.focus();  //다음 인풋으로 커서 이동
      }, 0);
    } 
    //2.  백스페이스 클릭 시
    else if (
      e.key === "Backspace" &&
      items[index].text === "" &&
      items.length > 1
    ) { e.preventDefault();
      const updatedItems = []; //삭제 후 남은 항목 저장을 위한 빈 배열
      for (let i = 0; i < items.length; i++) {
        if (i !== index) {
          updatedItems.push(items[i]);  // 삭제 후 남은 항목들 저장
        } }
      setItems(updatedItems); // 남은 항목들 상태 저장
      if (index > 0) {
        setTimeout(() => {
          const prevInput = document.querySelector(
            `input[type="text"][data-index="${index - 1}"]` // 그 중에 마지막 아이탬을 찾아
          ) as HTMLInputElement;
          if (prevInput) prevInput.focus(); // 포커즈 이동 
        }, 0);  
    }}};

  // onchange
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedItems = [...items];
    updatedItems[index].text = e.target.value; // 입력된  e.target.value가 현재 변경된 index의 text로 변경
    setItems(updatedItems); // 변경된 내용 포함 모두 업데이트 
  };

  // 삭제 클릭 시
  const handleDelete = (index: number) => {
    if (items.length > 1) {
      const updatedItems = [];
      for (let i = 0; i < items.length; i++) {
        if (i !== index) {
          updatedItems.push(items[i]);
        }
      }
      setItems(updatedItems);
    } else {
      setItems([{ text: "", id: Date.now(), checked: false}]);
    }
  };

  //체크 박스 클릭 시
  const handleCheckboxChange = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].checked = !updatedItems[index].checked;
    setItems(updatedItems);
  };

  // 백엔드로 데이터 전송
  const sendItemsToBackend = async () => {
    try {
      const checklist = localStorage.getItem("checklist");
      const response = await fetch(`${API_BASE_URL}/checklists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: checklist,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  // 저장 후 이전 페이지로 이동
  const handleSaveAndGoBack = () => {
    sendItemsToBackend(); // 먼저 백엔드로 데이터를 전송
    window.history.back(); // 이전 페이지로 이동
  };

  //화면 꺼졌을때 백엔드로 데이터 전송
  const handleBeforeUnload = () => {
    sendItemsToBackend();
  };

  return (
    <div className={styles.checkList_container}>
      <div className={styles.checkList_header_container}>
        <div className={styles.checkList_header_contents}>
          <div className={styles.checkList_header_title}>
            <div>Check List</div>
          </div>
          <button className={styles.checkList_header_close_button}
            onClick={()=> handleSaveAndGoBack()}>
            <img
              className={styles.checkList_header_close_button_img}
              src="/icons/close_gray.jpg"
              alt="close icon"/>
          </button>
        </div>
      </div>
      <div className={styles.checkList_main_container}>
        <div className={styles.checkList_main_contents}>
          {items.map((item, index) => (
            <div key={item.id} className={styles.checkList_main_content}>
              <input
                type="checkbox"
                id={`checkbox-${index}`}
                checked={item.checked}
                onChange={() => handleCheckboxChange(index)}
              />
              <input
                type="text"
                value={item.text}
                data-index={index}
                placeholder={
                  items.length === 1 && index === 0
                    ? "추가 항목을 입력해주세요"
                    : ""
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                onChange={(e) => handleChange(e, index)}
              />
              <span onClick={() => handleDelete(index)}>삭제</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CheckList;
