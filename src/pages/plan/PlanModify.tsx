import React, { useState } from "react";
import PlanHeader from "./include/PlanHeader"; // 일정 날짜 헤더 컴포넌트

// 모달 컴포넌트
import ConfirmModal from "../../components/modal/ConfirmModal";
import PromptModal from "../../components/modal/PromptModal";

// css
import styles from "./PlanModify.module.css";

const PlanModify: React.FC = () => {
  // 테스트 데이터
  const days = [
    { day: "DAY 1", date: "02월18일" },
    { day: "DAY 2", date: "02월19일" },
    { day: "DAY 3", date: "02월20일" },
    { day: "DAY 4", date: "02월21일" },
    { day: "DAY 5", date: "02월22일" },
  ];

  // 테스트 데이터(여행 지역)
  const destination = "제주도";

  // 테스트 데이터
  const travelPlans = [
    {
      day: "DAY 1",
      time: "오후 1시",
      drivingTime: "30분",
      image: "/images/jeju.jpg",
      title: "금릉해변",
      description:
        "바닥이 훤히 비치는 투명한 물빛과 얕은 수심으로 아이들과 물놀이하기 좋은 금능해수욕장입니다.",
    },
    {
      day: "DAY 1",
      time: "오후 2시",
      drivingTime: "15분",
      image: "/images/jeju.jpg",
      title: "협재해변",
      description:
        "협재해변은 제주도의 대표적인 맑은 물과 아름다운 풍경을 자랑합니다.",
    },
    {
      day: "DAY 2",
      time: "오후 3시",
      drivingTime: "20분",
      image: "/images/jeju.jpg",
      title: "한라산",
      description:
        "한라산은 제주도의 대표적인 산으로 트레킹 코스로 유명합니다.",
    },
  ];

  const [selectedDay, setSelectedDay] = useState<string>("DAY 1");
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]); // 선택된 일정 관리
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isPromptOpen, setPromptOpen] = useState<boolean>(false); // PromptModal 상태 추가

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
    setSelectedPlans([]); // 날짜 변경 시 선택 초기화
  };

  // 체크 박스 상태 관리
  const handleCheckboxChange = (index: number) => {
    setSelectedPlans((prevSelected) => {
      if (prevSelected.includes(index)) {
        return prevSelected.filter((i) => i !== index); // 선택 해제
      } else {
        return [...prevSelected, index]; // 선택 추가
      }
    });
  };

  // 전체 선택
  const handleSelectAll = () => {
    const allIndexes = travelPlans
      .filter((plan) => plan.day === selectedDay)
      .map((_, index) => index);

    // 현재 선택 상태와 모든 인덱스 비교
    if (selectedPlans.length === allIndexes.length) {
      setSelectedPlans([]); // 모두 선택되어 있으면 해제
    } else {
      setSelectedPlans(allIndexes); // 모두 선택
    }
  };

  // 삭제 버튼 클릭 시 모달 열기
  const handleDelete = () => {
    setModalOpen(true);
  };

  // 모달 안에서 저장 버튼 클릭했을때
  const handleModalConfirm = () => {
    setModalOpen(false);
    setSelectedPlans([]);
    // 삭제 로직 추가
  };

  // 모달 닫기
  const handleModalCancel = () => {
    setModalOpen(false);
  };

  // OpenModal 클릭 시 PromptModal 열기
  const handleOpenModalClick = () => {
    setPromptOpen(true);
  };

  // PromptModal 닫기
  const handlePromptClose = () => {
    setPromptOpen(false);
  };

  return (
    <>
      <div className={styles.travel_plan_list_container}>
        {/* PlanHeader 컴포넌트 */}
        <PlanHeader
          destination={destination}
          days={days} // days 배열 전달
          selectedDay={selectedDay}
          onDayClick={handleDayClick} // DAY 변경 핸들러 전달
        />

        <div
          className={styles.travel_plan_controls}
          style={{ textAlign: "right" }}
        >
          <span onClick={handleSelectAll} style={{ cursor: "pointer" }}>
            전체선택
          </span>
          <span>&nbsp;|&nbsp;</span>
          <span onClick={handleDelete} style={{ cursor: "pointer" }}>
            삭제
          </span>
        </div>

        {/* 일정 요소 list */}
        {travelPlans
          .filter((plan) => plan.day === selectedDay)
          .map((plan, index) => (
            <div className={styles.travel_plan_card_section} key={index}>
              <div className={styles.travel_plan_card_container}>
                <div className={styles.teavel_plan_check}>
                  <input
                    type="checkbox"
                    checked={selectedPlans.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </div>
                <div className={styles.travle_image_container}>
                  <div className={styles.travle_image}>
                    <img src={plan.image} alt={plan.title} />
                  </div>
                  <div className={styles.place_description}>
                    <h2>{plan.title}</h2>
                    <p>{plan.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* 모달 열기 */}
        {!isPromptOpen && (
          <div
            className={styles.open_modal_cotanier}
            onClick={handleOpenModalClick}
          >
            <div className={styles.top_btn}>
              <img src="/icons/arrow-top-white.png" alt="open"></img>
            </div>
          </div>
        )}

        {/* 프롬프트 모달 */}
        {isPromptOpen && (
          <PromptModal
            title="장소"
            message="원하시는 장소를 직접 검색하거나 예를 들어주세요. AI가 찾아서 추천해드려요!"
            onClose={handlePromptClose}
          />
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={isModalOpen}
        content={"선택하신 일정들을 삭제할까요?"}
        confirmText={"삭제"}
        cancelText="취소"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </>
  );
};

export default PlanModify;
