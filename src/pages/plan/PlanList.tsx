import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LongBtn from "../../components/buttons/LongBtn";
import ConfirmModal from "../../components/modal/ConfirmModal"; // 모달 컴포넌트
import PlanHeader from "./include/PlanHeader"; // 일정 날짜 헤더 컴포넌트
import styles from "./PlanList.module.css";
import axios from "axios";

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
  spot_time: Date;
}
interface plan {
  name: string;
  start_date: Date;
  end_date: Date;
  main_location: string;
  ages: number;
  companion_count: number;
  concepts: string;
}
interface spot {
  kor_name: string;
  eng_name?: string;
  description: string;
  address: string;
  map_url?: string;
  day: number;
  time: string;
  // TODO: 지도 API 이용해야 할지?
  drivingTime: string;
  image_url: string;
  isParkingLot?: boolean;
  isPet?: boolean;
}

//
const generateDaysArray = (startDate: Date, endDate: Date) => {
  const daysArray = [];
  let currentDate = new Date(startDate);
  let dayCount = 1;

  while (currentDate <= endDate) {
    daysArray.push({
      day: dayCount,
      date: `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`,
    });
    currentDate.setDate(currentDate.getDate() + 1);
    dayCount++;
  }

  return daysArray;
};

const PlanList: React.FC = (planId) => {
  // 테스트 데이터
  planId = 1;

  const [plan, setPlan] = useState<plan>({
    name: "제주도 여행",
    start_date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 2)),
    main_location: "제주시",
    ages: 20,
    companion_count: 3,
    concepts: "가족여행",
  });
  const [spots, setSpots] = useState<spot[]>([
    {
      day: 1,
      time: "오후 1시",
      drivingTime: "30분",
      image_url: "/images/jeju.jpg",
      kor_name: "금릉해변",
      eng_name: "Geumneung Beach",
      description:
        "바닥이 훤히 비치는 투명한 물빛과 얕은 수심으로 아이들과 물놀이하기 좋은 금능해수욕장입니다.",
      address: "제주특별자치도 제주시 한림읍 금능리 1377-1",
    },
    {
      day: 1,
      time: "오후 2시",
      drivingTime: "15분",
      image_url: "/images/jeju.jpg",
      kor_name: "협재해변",
      eng_name: "Hyeopjae Beach",
      description:
        "협재해변은 제주도의 대표적인 맑은 물과 아름다운 풍경을 자랑합니다.",
      address: "제주특별자치도 제주시 한림읍 협재리 2497",
    },
    {
      day: 1,
      time: "오후 3시",
      drivingTime: "20분",
      image_url: "/images/jeju.jpg",
      kor_name: "한라산",
      eng_name: "Halla Mountain",
      description:
        "한라산은 제주도의 대표적인 산으로 트레킹 코스로 유명합니다.",
      address: "제주특별자치도 서귀포시 성산읍 성산리 200-1",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/plan_spots/${planId}`
        );
        const plan = response.data.data[0];
        const spotInfos = response.data.data[1];
        setPlan(plan.plan);

        const updatedSpots = spotInfos.map((spotInfo: any) => ({
          ...spotInfo.spot,
          ...spotInfo.plan_spot,
        }));
        setSpots((prev) => [...prev, ...updatedSpots]);
        console.log(spots);
        console.log(updatedSpots);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const days: { day: number; date: string }[] = generateDaysArray(
    plan.start_date,
    plan.end_date
  );
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // 헤더 날짜 선택
  const handleDayClick = (day: number) => {
    setSelectedDay(day);
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
      <form className={styles.travel_plan_list_container}>
        {/* PlanHeader 컴포넌트 */}
        <PlanHeader
          destination={plan.main_location}
          days={days} // days 배열 전달
          selectedDay={selectedDay}
          onDayClick={handleDayClick} // DAY 변경 핸들러 전달
        />

        {/* 일정 요소 list */}
        {spots
          .filter((spot) => spot.day === selectedDay)
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

        <div className={styles.form_actions_btns}>
          <div className={styles.travle_save_btn}>
            <LongBtn
              type="button"
              content="저장하기"
              onClick={handleSaveClick}
            />
          </div>
          <div className={styles.travle_modify_btn}>
            <LongBtn
              content="변경하기"
              onClick={() => navigate("/plan/modify")}
            />
          </div>
        </div>
      </form>

      {/* 저장 확인 모달 */}
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
