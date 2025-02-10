import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import AgentSelectModal from "../../components/modal/AgentSelectModal";
import { List } from "lucide-react";
import PlanMap from "./include/PlanMap";

interface spotResponse {
  latitude: number;
  longitude: number;
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
  ages: string;
  companion_count: {
    label: string;
    count: number;
  }[];
  concepts: string[];
}

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

const Plan: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("detail");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    ages: "20대",
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

  // 에이전트 선택 후 일정 생성 관련 상태
  const [showAgentModal, setShowAgentModal] = useState<boolean>(true);

  // 일정 목록 페이지로 이동
  const handleListClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/plans/list");
  };
  // 에이전트 선택 및 요청
  const handleAgentSelect = async (agentType: string[]) => {
    setShowAgentModal(false);
    setIsLoading(true);
    try {
      let planData = planStore.getPlan();
      // 화면에 출력하기 위한 형식 변환
      const planDataforPrint = {
        name: planData.name,
        start_date: new Date(planData.start_date),
        end_date: new Date(planData.end_date),
        main_location: planData.main_location,
        ages: planData.ages,
        companion_count: planData.companion_count,
        concepts: planData.concepts,
      };
      setPlan(planDataforPrint);
      // agentType 포함 API 요청
      const response = await axios.post(
        `${API_BASE_URL}/agents/plan`,
        planData,
        {
          params: {
            agent_type: agentType,
          },
        }
      );

      const spotInfos = response.data.data.spots.spots;
      setSpots(spotInfos);
    } catch (err) {
      console.error("에이전트 요청 중 오류 발생:", err);
      setMessage("일정 생성 중 오류가 발생했습니다. 잠시후 다시 시도해주세요");
      setIsOpen(true);
    } finally {
      setIsLoading(false);
      planStore.initPlanInfo();
    }
  };

  // 저장된 일정 조회용
  const fetchPlanData = async () => {
    try {
      //스팟 데이터 초기화
      setSpots([]);
      const response = await axios.get(`${API_BASE_URL}/plan_spots/${planId}`);
      // 서버에서 반환한 일정 데이터 중 ages는 int타입임.

      // 서버의 pydantic에서는 요청받을때는 string, 저장하는 pydantic에서는 int타입임.
      // 프론트의 PlanStore(상태 관리)에서는 string으로 사용중임.
      const planResponse = response.data.data.plan;
      const planDataforStore = {
        name: planResponse.name,
        start_date: new Date(planResponse.start_date),
        end_date: new Date(planResponse.end_date),
        main_location: planResponse.main_location,
        ages: `${planResponse.ages}대`,
        companion_count: JSON.parse(planResponse.companion_count),
        concepts: JSON.parse(planResponse.concepts),
      };
      setPlan(planDataforStore);
      planStore.setPlan({
        ...planDataforStore,
        start_date: planDataforStore.start_date.toISOString(),
        end_date: planDataforStore.end_date.toISOString(),
      });

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
    if (planId) {
      fetchPlanData();
    }
  }, [planId]);

  useEffect(() => {
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

  // 날짜 헤더 클릭
  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  // 저장 모달 열기
  const handleSaveClick = async () => {
    setModalOpen(true);
  };

  // 모달에서 저장 버튼 클릭 시
  const handleModalConfirm = async () => {
    setModalOpen(false);
    let concepts =
      typeof plan.concepts !== "string"
        ? JSON.stringify(plan.concepts)
        : plan.concepts;
    let companion_count =
      typeof plan.companion_count !== "string"
        ? JSON.stringify(plan.companion_count)
        : plan.companion_count;
    try {
      // 일정 수정
      if (planId) {
        const response = await axios.post(`${API_BASE_URL}/plans/${planId}`, {
          plan: {
            ...plan,
            concepts,
            companion_count,
          },
          spots: spots,
          withCredentials: true,
          email: memberStore.getMemberInfo().email,
        });
        console.log("savePlanData", response.data);
        setMessage("일정 수정 완료");
        setIsOpen(true);
      }
      // 일정 생성
      else {
        const response = await axios.post(`${API_BASE_URL}/plans`, {
          plan: {
            ...plan,
            concepts,
            companion_count,
          },
          spots: spots,
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

  // 모달 취소
  const handleModalCancel = () => {
    setModalOpen(false);
  };

  // spots 업데이트 함수
  const handleSpotsUpdate = (updatedSpots: spotResponse[]) => {
    setSpots(updatedSpots);
  };

  const handleAddSpot = (newSpot: spotResponse) => {
    const updatedSpot = {
      ...newSpot,
      day_x: selectedDay,
      order: spots.filter((spot) => spot.day_x === selectedDay).length + 1,
    };
    setSpots((prevSpots) => [...prevSpots, updatedSpot]);
  };

  return (
    <div className={styles.travel_plan_container}>
      <div className={styles.travel_plan_tab_container}>
        <button className={styles.list_btn} onClick={handleListClick}>
          <List size={32} />
        </button>
        <div
          className={`${styles.travel_plan_tab_item} ${
            currentTab === "detail" ? styles.active : ""
          }`}
          onClick={() => setCurrentTab("detail")}
        >
          일정 확인
        </div>
        <div
          className={`${styles.travel_plan_tab_item} ${
            currentTab === "modify" ? styles.active : ""
          }`}
          onClick={() => setCurrentTab("modify")}
        >
          일정 수정
        </div>
        <div
          className={`${styles.travel_plan_tab_item} ${
            currentTab === "map" ? styles.active : ""
          }`}
          onClick={() => setCurrentTab("map")}
        >
          지도 확인
        </div>
      </div>
      <div className={styles.travel_plan_list_container}>
        {/* PlanHeader 컴포넌트 */}
        <PlanHeader
          destination={plan.main_location}
          name={plan.name}
          days={days}
          selectedDay={selectedDay}
          onDayClick={handleDayClick}
          onNameChange={handlePlanName}
        />
        <div className={styles.travel_plan_list_icon}>
          <Link to="/checkList">
            <img src="/icons/memo.jpg" alt="Icon" />
          </Link>
        </div>

        {isLoading ? (
          <div className={styles.loading_container}>
            <div className={styles.loading_spinner}></div>
            <p>AI가 여행 일정을 생성하고 있습니다...</p>
          </div>
        ) : isDataLoaded ? (
          currentTab === "detail" ? (
            <PlanDetail spots={spots} selectedDay={selectedDay} />
          ) : currentTab === "modify" ? (
            <PlanModify
              spots={spots}
              selectedDay={selectedDay}
              onSpotsUpdate={handleSpotsUpdate}
              onAddSpot={handleAddSpot}
            />
          ) : currentTab === "map" ? (
            <PlanMap spots={spots} selectedDay={selectedDay} />
          ) : null
        ) : (
          <div className={styles.loading_container}>
            <div className={styles.loading_spinner}></div>
            <p>데이터를 불러오고 있습니다.</p>
          </div>
        )}

        <div className={styles.form_actions_btns}>
          {!isLoading && isDataLoaded ? (
            <div className={styles.travle_save_btn}>
              <LongBtn
                type="button"
                content="일정 저장하기"
                onClick={handleSaveClick}
              />
            </div>
          ) : null}
        </div>
      </div>

      <AgentSelectModal
        isOpen={showAgentModal && !planId}
        onSelect={handleAgentSelect}
      />

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
          if (
            message ===
            "일정 생성 중 오류가 발생했습니다. 잠시후 다시 시도해주세요"
          ) {
            navigate("/plan/filter");
          }
        }}
      />
    </div>
  );
};

export default Plan;
