import React from "react";
import styles from "./PlanList.module.css";

interface spotInterface {
  kor_name: string;
  eng_name?: string;
  description: string;
  address: string;
  map_url?: string;
  image_url: string;
  day_x: number;
  time: string;
  // TODO: 지도 API 이용해야 할지?
  drivingTime?: string;
  isParkingLot?: boolean;
  isPet?: boolean;
}

interface PlanListProps {
  spots: spotInterface[];
  selectedDay: number;
}

const PlanList: React.FC<PlanListProps> = ({ spots, selectedDay }) => {
  return (
    <div className={styles.travel_plan_list_container}>
      {/* 일정 요소 list */}
      {spots
        .filter((spot) => spot.day_x === selectedDay)
        .map((spot, index) => (
          <div className={styles.travel_plan_card_section} key={index}>
            <div className={styles.travel_plan_card_container}>
              <div className={styles.timeline_indicator}>
                <div className={styles.circle}></div>
                <div className={styles.line}></div>
                <div className={styles.driving_time}>
                  <img src="/icons/car.jpg" alt="운전 아이콘" />
                  <p>{spot.drivingTime}</p>
                </div>
              </div>
              <div className={styles.travel_time_container}>
                <div className={styles.travel_time}>{spot.time}</div>
              </div>
              <div className={styles.travle_image_container}>
                <div className={styles.travle_image}>
                  <img src={spot.image_url} alt={spot.eng_name} />
                </div>
                <div className={styles.place_description}>
                  <h2>{spot.kor_name}</h2>
                  <p>{spot.eng_name}</p>
                  <p>{spot.address}</p>
                  <p>{spot.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PlanList;
