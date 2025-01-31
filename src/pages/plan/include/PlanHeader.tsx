import React from "react";
import Slider from "react-slick";
import styles from "./PlanHeader.module.css";

interface Day {
  day: number; // DAY 1
  date: string; // 1월 21일
}

interface PlanHeaderProps {
  days: Day[]; // days 배열
  destination: string;
  selectedDay: number;
  onDayClick: (day: number) => void; // DAY 클릭 이벤트 핸들러
}

const PlanHeader: React.FC<PlanHeaderProps> = ({
  days,
  destination,
  selectedDay,
  onDayClick,
}) => {
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.travel_plan_list_header}>
      <div className={styles.travel_plan_list_destination}>{destination}</div>

      {/* 슬라이더 */}
      <div className={styles.travel_plan_list_content}>
        <div className={styles.travel_plan_list_icon}>
          <img src="/icons/memo.jpg" alt="Icon" />
        </div>
        <div className={styles.travel_plan_list_dates_wrapper}>
          <Slider {...sliderSettings}>
            {days.map(({ day, date }) => (
              <div
                key={day}
                className={`${styles.travel_plan_list_date} ${
                  selectedDay === day ? styles.selected : ""
                }`}
                onClick={() => onDayClick(day)}
              >
                <div className={styles.travel_plan_list_day}>{day}일차</div>
                <div className={styles.travel_plan_list_date_text}>{date}</div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default PlanHeader;
