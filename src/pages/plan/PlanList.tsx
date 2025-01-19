import React, { useState } from "react";
import Slider from "react-slick";
import "./PlanList.css";

const PlanList: React.FC = () => {
  // 테스트 데이터
  const days = [
    { day: "DAY 1", date: "02월18일" },
    { day: "DAY 2", date: "02월19일" },
    { day: "DAY 3", date: "02월20일" },
    { day: "DAY 4", date: "02월21일" },
    { day: "DAY 5", date: "02월22일" },
  ];

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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

  return (
    <div className="travel-plan-list-container">
      <div className="travel-plan-list-header">
        <div className="travel-plan-list-destination">제주도</div>
        <div className="travel-plan-list-content">
          <div className="travel-plan-list-icon">
            <img src="/icons/memo.jpg" alt="Icon" />
          </div>
          <div className="travel-plan-list-dates-wrapper">
            <Slider {...sliderSettings}>
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
    </div>
  );
};

export default PlanList;
