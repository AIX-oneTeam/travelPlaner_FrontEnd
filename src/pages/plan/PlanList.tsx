import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import LongBtn from "../../components/buttons/LongBtn";
import ConfirmModal from "../../components/modal/ConfirmModal"; // 모달 컴포넌트
import "./PlanList.css";

const PlanList: React.FC = () => {
  const navigate = useNavigate();

  // 테스트 데이터
  const days = [
    { day: "DAY 1", date: "02월18일" },
    { day: "DAY 2", date: "02월19일" },
    { day: "DAY 3", date: "02월20일" },
    { day: "DAY 4", date: "02월21일" },
    { day: "DAY 5", date: "02월22일" },
  ];

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
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // 화면 크기 768px 이하
        settings: {
          slidesToShow: 2, // 작은 화면에서는 2개씩 보여줌
        },
      },
      {
        breakpoint: 480, // 화면 크기 480px 이하
        settings: {
          slidesToShow: 1, // 더 작은 화면에서는 1개씩 보여줌
        },
      },
    ],
  };

  // 모달 열기
  const handleSaveClick = () => {
    setModalOpen(true);
  };

  // 모달 안에서 저장 버튼 클릭했을때
  const handleModalConfirm = () => {
    setModalOpen(false);
    // 저장 로직 추가
  };

  // 모달 닫기
  const handleModalCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <form className="travel-plan-list-container">
        <div className="travel-plan-list-header">
          <div className="travel-plan-list-destination">제주도</div>
          <div className="travel-plan-list-content">
            <div className="travel-plan-list-icon">
              <img src="/icons/memo.jpg" alt="Icon" />
            </div>
            <div className="travel-plan-list-dates-wrapper">
              <Slider {...sliderSettings} arrows={false}>
                {days.map(({ day, date }) => (
                  <div
                    key={day}
                    className={`travel-plan-list-date ${
                      selectedDay === day ? "selected" : ""
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="travel-plan-list-day">{day}</div>
                    <div className="travel-plan-list-date-text">{date}</div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>

        {/* 일정 요소 list */}
        {travelPlans
          .filter((plan) => plan.day === selectedDay)
          .map((plan, index) => (
            <div className="travel-plan-card-section" key={index}>
              <div className="travel-plan-card-container">
                <div className="timeline-indicator">
                  <div className="circle"></div>
                  <div className="line"></div>
                  <div className="driving-time">
                    <img src="/icons/car.jpg" alt="운전 아이콘" />
                    <p>{plan.drivingTime}</p>
                  </div>
                </div>
                <div className="travel-time-container">
                  <div className="travel-time">{plan.time}</div>
                </div>
                <div className="travle-image-container">
                  <div className="travle-image">
                    <img src={plan.image} alt={plan.title} />
                  </div>
                  <div className="place-description">
                    <h2>{plan.title}</h2>
                    <p>{plan.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

        <div className="form-actions-btns">
          <div className="travle-save-btn">
            <LongBtn
              type="button"
              content="저장하기"
              onClick={handleSaveClick}
            />
          </div>
          <div className="travle-modify-btn">
            <LongBtn
              content="변경하기"
              onClick={() => navigate("/plan/filter/selector")}
            />
          </div>
        </div>
      </form>

      {/* 모달 추가 */}
      <ConfirmModal
        isOpen={isModalOpen}
        content={"해당 플랜을 저장할까요?"}
        confirmText={"저장"}
        cancelText="취소"
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </>
  );
};

export default PlanList;