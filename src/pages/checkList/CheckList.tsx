import React, { useState, useEffect } from "react";
// git 대소문자 변경용 주석
import styles from "./CheckList.module.css";

function CheckList() {
  const [items, setItems] = useState<
    { text: string; id: number; checked: boolean }[]
  >([]);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    saveItems();
  }, [items]);

  const loadItems = () => {
    const savedItems = localStorage.getItem("checklist");
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      if (parsedItems.length > 0) {
        setItems(parsedItems);
      } else {
        setItems([{ text: "", id: 0, checked: false }]);
      }
    } else {
      setItems([{ text: "", id: 0, checked: false }]);
    }
  };

  const saveItems = () => {
    localStorage.setItem("checklist", JSON.stringify(items));
  };

  const handleEditItem = (index: number, newText: string) => {
    const updatedItems = [...items];
    updatedItems[index].text = newText;
    setItems(updatedItems);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    //1. 엔터 클릭 시
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault(); // 기본 동작 방지
      const newItem = { text: "", id: Date.now(), checked: false };
      const updatedItems = [...items]; // 기존 값 불러오기
      updatedItems[index].text = e.currentTarget.value.trim();
      updatedItems.splice(index + 1, 0, newItem);
      setItems(updatedItems);
      setTimeout(() => {
        const nextInput = document.querySelector(
          `input[type="text"][data-index="${index + 1}"]`
        ) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }, 0); //다음 인풋으로 커서 이동
    } else if (
      e.key === "Backspace" &&
      items[index].text === "" &&
      items.length > 1
    ) {
      // 백스페이스 클릭 시
      e.preventDefault();
      const updatedItems = [];
      for (let i = 0; i < items.length; i++) {
        if (i !== index) {
          updatedItems.push(items[i]);
        }
      }
      setItems(updatedItems);
      if (index > 0) {
        setTimeout(() => {
          const prevInput = document.querySelector(
            `input[type="text"][data-index="${index - 1}"]`
          ) as HTMLInputElement;
          if (prevInput) prevInput.focus();
        }, 0);
      }
    }
  };

  // onchange
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedItems = [...items];
    updatedItems[index].text = e.target.value;
    setItems(updatedItems);
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
      setItems([{ text: "", id: Date.now(), checked: false }]);
    }
  };

  //체크 박스 클릭 시
  const handleCheckboxChange = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].checked = !updatedItems[index].checked;
    setItems(updatedItems);
  };

  return (
    <div className={styles.checkList_container}>
      <div className={styles.checkList_header_container}>
        <div className={styles.checkList_header_contents}>
          <div className={styles.checkList_header_title}>
            <div>Check List</div>
          </div>
          <button className={styles.checkList_header_close_button}
            onClick={()=> window.history.back()}>
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
                onBlur={() => handleEditItem(index, item.text)}
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
