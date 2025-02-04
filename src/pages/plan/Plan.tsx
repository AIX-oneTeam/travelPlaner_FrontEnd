import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LongBtn from "../../components/buttons/LongBtn";
import ConfirmModal from "../../components/modal/ConfirmModal"; // 모달 컴포넌트
import PlanHeader from "./include/PlanHeader"; // 일정 날짜 헤더 컴포넌트
import styles from "./Plan.module.css";
import axios from "axios";
import PlanModify from "./include/PlanModify";
import usePlanStore from "../../stores/PlanStore";
import useMemberStore from "../../stores/MemberStore";
import { API_BASE_URL } from "../../config";
import AlertModal from "../../components/modal/AlertModal";
import PlanDetail from "./include/PlanDetail";

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

// PlanModify props 인터페이스 수정
interface PlanModifyProps {
  spots: spotResponse[];
  selectedDay: number;
  onSpotsUpdate: (updatedSpots: spotResponse[]) => void;
}

const Plan: React.FC = () => {
  const [isModifying, setModifying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태 추가
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const memberStore = useMemberStore();

  const { planId } = useParams();

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
  const handlePlanName = (newName: string) => {
    planStore.setPlan({ name: newName });
    setPlan({ ...plan, name: newName });
  };

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
      console.log("planData", planData);

      const response = await axios.post(
        `${API_BASE_URL}/agents/plan`,
        planData
      );
      const spotInfos = response.data.data.spots.spots;
      setSpots(spotInfos);
      setIsLoading(false); // 로딩 종료
    } catch (err) {
      console.error("에이전트 요청 중 오류 발생:", err);
      setMessage("일정 생성 중 오류가 발생했습니다. 잠시후 다시 시도해주세요");
      setIsOpen(true);
      navigate("/plan/filter/selector");
      return;
    } finally {
      // 일정 요청 완료 후 스토어와 로컬스토리지 초기화
      planStore.initPlanInfo();
    }
  };

  const fetchPlanData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plan_spots/${planId}`);
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
    // planId가 있으면 저장된 플랜 데이터를 가져오고
    // 없으면 새로운 플랜을 생성하는 로직
    if (planId) {
      fetchPlanData();
    } else {
      fetchPlanDataFromAgent();
    }
  }, [planId]);

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
  const handleSaveClick = async () => {
    setModalOpen(true);
  };

  // 모달 안에서 저장 버튼 클릭했을때
  const handleModalConfirm = async () => {
    setModalOpen(false);
    // 저장 로직 추가
    let concepts = "";
    let companion_count = "";
    if (typeof plan.concepts !== "string") {
      concepts = JSON.stringify(plan.concepts);
    } else {
      concepts = plan.concepts;
    }

    if (typeof plan.companion_count !== "string") {
      companion_count = JSON.stringify(plan.companion_count);
    } else {
      companion_count = plan.companion_count;
    }
    try {
      // 일정 수정인 경우

      if (planId) {
        const response = await axios.post(`${API_BASE_URL}/plans/${planId}`, {
          plan: {
            ...plan,
            concepts,
            companion_count,
          },
          spots: spots,
          email: memberStore.getMemberInfo().email,
        });
        console.log("savePlanData", response.data);
        setMessage("일정 수정 완료");
        setIsOpen(true);
      }
      // 일정 생성인 경우
      else {
        const response = await axios.post(`${API_BASE_URL}/plans`, {
          plan: {
            ...plan,
            concepts,
            companion_count,
          },

          spots: spots,
          // TODO: HTTPS 환경에서 쿠키로 전달하게끔 변경해야 함.
          // 현재는 HTTP환경이라 POST요청시 HttpOnly 쿠키가 전달되지 않아 임시방편임.
          email: memberStore.getMemberInfo().email,
          withCredentials: true,
        });
        console.log("savePlanData", response.data);
        setMessage("일정 저장 완료");
        setIsOpen(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("일정 저장 중 오류가 발생했습니다. 잠시후 다시 시도해주세요");
      setIsOpen(true);
    }
  };

  // 모달 닫기
  const handleModalCancel = () => {
    setModalOpen(false);
  };

  // spots 업데이트 함수 추가
  const handleSpotsUpdate = (updatedSpots: spotResponse[]) => {
    setSpots(updatedSpots);
  };

  return (
    <>
      <form className={styles.travel_plan_list_container}>
        {/* PlanHeader 컴포넌트 */}
        <PlanHeader
          destination={plan.main_location}
          name={plan.name}
          days={days} // days 배열 전달
          selectedDay={selectedDay}
          onDayClick={handleDayClick} // DAY 변경 핸들러 전달
          onNameChange={handlePlanName} // 이름 변경 핸들러 전달
        />
        <div className={styles.travel_plan_list_icon}>
          <img src="/icons/memo.jpg" alt="Icon" />
        </div>

        {isLoading ? (
          <div className={styles.loading_container}>
            <div className={styles.loading_spinner}></div>
            <p>AI가 여행 일정을 생성하고 있습니다...</p>
          </div>
        ) : isDataLoaded ? (
          !isModifying ? (
            <PlanDetail spots={spots} selectedDay={selectedDay} />
          ) : (
            <PlanModify
              spots={spots}
              selectedDay={selectedDay}
              onSpotsUpdate={handleSpotsUpdate}
            />
          )
        ) : (
          <div className={styles.loading_container}>
            <div className={styles.loading_spinner}></div>
            <p>데이터를 불러오고 있습니다.</p>
          </div>
        )}

        <div className={styles.form_actions_btns}>
          {!isLoading && isDataLoaded ? (
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
        }}
      />
    </>
  );
};

export default Plan;
