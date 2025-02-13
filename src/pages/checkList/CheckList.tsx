import React, { useState, useEffect } from "react";
import styles from "./CheckList.module.css";
import { API_BASE_URL } from "../../config";
import { useParams, useNavigate } from "react-router-dom";

interface CheckListItem {
  text: string;
  id: number;
  checked: boolean;
  planId?: number; // 플랜 아이디 추가 (서버에 전달할 때 사용)
}

function CheckList() {
  // URL 파라미터에서 planId 가져오기
  const { planId } = useParams<{ planId?: string }>(); // planId가 없을 수도 있으므로 optional로 설정
  const navigate = useNavigate();

  const [items, setItems] = useState<CheckListItem[]>([]);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 planId를 items의 초기값에 설정
    if (planId) {
      setItems([{ text: "", id: Date.now(), checked: false, planId: parseInt(planId, 10) }]);
    } else {
      // planId가 없는 경우의 처리
      console.warn("Plan ID가 URL 파라미터에 없습니다.");
      setItems([{ text: "", id: Date.now(), checked: false }]);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [planId]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // 1. 엔터 클릭 시
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault(); // 기본 동작 방지
      // planId가 있는지 확인하고, 없으면 에러 로그를 출력하고 함수 종료
      if (!planId) {
        console.error("Plan ID is missing.");
        return;
      }
      const newItem: CheckListItem = {
        planId: parseInt(planId, 10), // planId를 number 타입으로 변환하여 저장
        text: "",
        id: Date.now(),
        checked: false,
      };
      const updatedItems = [...items];
      updatedItems[index].text = e.currentTarget.value.trim();
      updatedItems.splice(index + 1, 0, newItem);
      setItems(updatedItems);
      setTimeout(() => {
        const nextInput = document.querySelector(
          `input[type="text"][data-index="${index + 1}"]`
        ) as HTMLInputElement;
        if (nextInput) nextInput.focus(); // 다음 인풋으로 커서 이동
      }, 0);
    }
    // 2. 백스페이스 클릭 시
    else if (
      e.key === "Backspace" &&
      items[index].text === "" &&
      items.length > 1
    ) {
      e.preventDefault();
      const updatedItems = []; // 삭제 후 남은 항목 저장을 위한 빈 배열
      for (let i = 0; i < items.length; i++) {
        if (i !== index) {
          updatedItems.push(items[i]); // 삭제 후 남은 항목들 저장
        }
      }
      setItems(updatedItems); // 남은 항목들 상태 저장
      if (index > 0) {
        setTimeout(() => {
          const prevInput = document.querySelector(
            `input[type="text"][data-index="${index - 1}"]` // 그 중에 마지막 아이탬을 찾아
          ) as HTMLInputElement;
          if (prevInput) prevInput.focus(); // 포커즈 이동
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
    updatedItems[index].text = e.target.value; // 입력된 e.target.value가 현재 변경된 index의 text로 변경
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
      setItems([{ text: "", id: Date.now(), checked: false, planId: planId ? parseInt(planId, 10) : undefined }]);
    }
  };

  // 체크 박스 클릭 시
  const handleCheckboxChange = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].checked = !updatedItems[index].checked;
    setItems(updatedItems);
  };

  // 백엔드로 데이터 전송
  const sendItemsToBackend = async () => {
    try {
      // items 배열에 planId가 있는지 확인하고, 없다면 추가
      const itemsWithPlanId = items.map(item => ({
        ...item,
        planId: item.planId || (planId ? parseInt(planId, 10) : null), // 기존 planId 유지, 없으면 URL 파라미터에서 가져오기
      }));

      // planId가 여전히 없으면 에러 로그를 출력하고 함수 종료
      if (itemsWithPlanId.some(item => !item.planId)) {
        console.error("Plan ID is missing in checklist items.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/checklists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemsWithPlanId), // itemsWithPlanId를 JSON 문자열로 변환하여 body에 전달
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
    navigate(-1); // 이전 페이지로 이동
  };

  // 화면 꺼졌을때 백엔드로 데이터 전송
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
          <button
            className={styles.checkList_header_close_button}
            onClick={handleSaveAndGoBack}
          >
            <img
              className={styles.checkList_header_close_button_img}
              src="/icons/close_gray.jpg"
              alt="close icon"
            />
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
