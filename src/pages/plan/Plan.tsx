import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LongBtn from "../../components/buttons/LongBtn";
import ConfirmModal from "../../components/modal/ConfirmModal"; // 모달 컴포넌트
import PlanHeader from "./include/PlanHeader"; // 일정 날짜 헤더 컴포넌트
import PlanList from "./include/PlanList"; // 일정 리스트 컴포넌트
import styles from "./Plan.module.css";
import axios from "axios";
import PlanModify from "./include/PlanModify";
import usePlanStore from "../../stores/PlanStore";
import { API_BASE_URL } from "../../config";
import AlertModal from "../../components/modal/AlertModal";

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
interface planInterface {
  name: string;
  start_date: Date;
  end_date: Date;
  main_location: string;
  ages: number;
  companion_count: {
    label: string;
    count: number;
  }[];
  concepts: string[];
}
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

//
const generateDaysArray = (startDate: Date, endDate: Date) => {
  const daysArray = [];
  let currentDate = new Date(startDate);
  let lastDate = new Date(endDate);
  let dayCount = 1;

  while (currentDate <= lastDate) {
    daysArray.push({
      day: dayCount,
      date: `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`,
    });
    currentDate.setDate(currentDate.getDate() + 1);
    dayCount++;
  }

  return daysArray;
};

const Plan: React.FC<{ planId?: number }> = ({ planId }) => {
  const [isModifying, setModifying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태 추가
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [plan, setPlan] = useState<planInterface>({
    name: "",
    start_date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
    main_location: "",
    ages: 20,
    companion_count: [
      {
        label: "",
        count: 0,
      },
    ],
    concepts: [],
  });
  const [spots, setSpots] = useState<spotResponse[]>([]);

  const planStore = usePlanStore();

  const fetchPlanDataFromAgent = async () => {
    try {
      setIsLoading(true); // 로딩 시작

      const planData = planStore.getPlan();
      const planDataforPrint = {
        name: planData.name,
        start_date: new Date(planData.start_date),
        end_date: new Date(planData.end_date),
        main_location: planData.main_location,
        ages: parseInt(planData.ages),
        companion_count: planData.companion_count,
        concepts: planData.concepts,
      };
      setPlan(planDataforPrint);

      const response = await axios.post(
        `${API_BASE_URL}/agents/plan`,
        planData
      );

      console.log(response);
      const spotInfos = response.data.data.spots.spots;
      console.log("spotInfos", spotInfos);

      console.log("before spots", spots);
      setSpots(spotInfos);
      console.log("after spots", spots);
    } catch (err) {
      console.error("에이전트 요청 중 오류 발생:", err);
      setMessage("일정 생성 중 오류가 발생했습니다. 잠시후 다시 시도해주세요");
      setIsOpen(true);
      return;
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const fetchPlanData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/plan_spots/${planId}`
      );
      const newPlan = response.data.data.plan;
      setPlan(newPlan);

      const spotInfos = response.data.data.detail;
      const updatedSpots = spotInfos.map((spotInfo: any) => ({
        ...spotInfo.spot,
        ...spotInfo.plan_spot,
      }));
      setSpots(updatedSpots);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // 플랜 아이디가 있으면 플랜 데이터 가져오기
    if (planId) {
      fetchPlanData();
    }
    // 플랜 아이디가 없다면 스토어의 데이터로 에이전트 요청
    else {
      fetchPlanDataFromAgent();
    }
  }, []);

  useEffect(() => {
    console.log("useEffect spots", spots);
    if (spots.length > 0) {
      setIsDataLoaded(true);
    }
  }, [spots, isDataLoaded]);

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

        {isLoading ? (
          <div className={styles.loading_container}>
            <div className={styles.loading_spinner}></div>
            <p>AI가 여행 일정을 생성하고 있습니다...</p>
          </div>
        ) : isDataLoaded ? (
          !isModifying ? (
            <PlanList spots={spots} selectedDay={selectedDay} />
          ) : (
            <PlanModify spots={spots} selectedDay={selectedDay} />
          )
        ) : (
          <div className={styles.loading_container}>
            <div className={styles.loading_spinner}></div>
            <p>데이터를 불러오고 있습니다.</p>
          </div>
        )}

        <div className={styles.form_actions_btns}>
          {isLoading && isDataLoaded ? (
            <>
              <div className={styles.travle_save_btn}>
                <LongBtn
                  type="button"
                  content="일정 저장하기"
                  onClick={handleSaveClick}
                />
              </div>
              <div className={styles.travle_modify_btn}>
                {!isModifying ? (
                  <LongBtn
                    content="일정 변경하기"
                    onClick={() => setModifying(true)}
                  />
                ) : (
                  <LongBtn
                    content="일정 확인 하기"
                    onClick={() => setModifying(false)}
                  />
                )}
              </div>
            </>
          ) : null}
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

      <AlertModal
        isOpen={isOpen}
        content={message}
        onConfirm={() => {
          setIsOpen(false);
          navigate("/");
        }}
      />
    </>
  );
};

export default Plan;
