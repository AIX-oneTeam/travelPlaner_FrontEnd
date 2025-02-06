import React from "react";
import styles from "./PlanDetail.module.css";

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
                <div className={styles.travel_time}>{spot.spot_time}</div>
              </div>
              <div className={styles.travle_image_container}>
                <div className={styles.travle_image}>
                  <img src={spot.image_url} alt={spot.eng_name} />
                </div>
                <div className={styles.place_info_container}>
                  <h2>{spot.kor_name}</h2>
                  <h3>{spot.eng_name}</h3>
                  <p className={styles.place_additional_info}>{spot.address}</p>
                  <div className={styles.place_description}>
                    <span>{spot.description} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PlanList;
