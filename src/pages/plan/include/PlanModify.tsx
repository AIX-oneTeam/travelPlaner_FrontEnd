import React, { useEffect, useRef, useState } from "react";
import PlanHeader from "./PlanHeader"; // 일정 날짜 헤더 컴포넌트
import usePlanStore from "../../../stores/PlanStore";

// 모달 컴포넌트
import ConfirmModal from "../../../components/modal/ConfirmModal";
import PromptModal from "../../../components/modal/PromptModal";

// css
import styles from "./PlanModify.module.css";

interface spotResponse {
  kor_name: string;
  eng_name: string;
  description: string;
  address: string;
  zip: string;
  url: string;
  image_url: string;
  map_url: string;
  likes: number;
  satisfaction: number;
  spot_category: number;
  phone_number: string;
  business_status: boolean;
  business_hours: string;
  order: number;
  day_x: number;
  spot_time: string;
  drivingTime?: string;
}

interface PlanListProps {
  spots: spotResponse[];
  selectedDay: number;
}

const PlanModify: React.FC<PlanListProps> = ({ spots, selectedDay }) => {
  const [selectedDaystate, setSelectedDaystate] = useState<number>(selectedDay);
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]); // 선택된 일정 관리
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isPromptOpen, setPromptOpen] = useState<boolean>(false); // PromptModal 상태 추가
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalWidth, setModalWidth] = useState<string>("100%"); // css의 fixed는 width가 뷰포트를 기준임 -> 너비 조정이 힘들어서 상태 관리로 해결
  const planStore = usePlanStore();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setModalWidth(`${containerRef.current.offsetWidth}px`);
      }
    };

    // 초기 너비 설정
    handleResize();

    // 윈도우 리사이즈 이벤트 추가
    window.addEventListener("resize", handleResize);

    // 리사이즈 이벤트 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDayClick = (day: number) => {
    setSelectedDaystate(day);
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
    const allIndexes = spots
      .filter((spot) => spot.day_x === selectedDaystate)
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
      <div
        ref={containerRef}
        className={`${styles.travel_plan_list_container} ${
          !isPromptOpen ? styles.with_padding_bottom : ""
        }`}
      >
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
        {spots
          .filter((spot) => spot.day_x === selectedDaystate)
          .map((spot, index) => (
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
                    <img src={spot.image_url} alt={spot.eng_name} />
                  </div>
                  <div className={styles.place_description}>
                    <h2>{spot.kor_name}</h2>
                    <p>{spot.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* 모달 열기 */}
        {!isPromptOpen && (
          <div
            className={styles.open_modal_cotanier}
            style={{
              width: modalWidth,
            }}
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
