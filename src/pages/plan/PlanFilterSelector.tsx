import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar, { CalendarProps } from "react-calendar";
import LongBtn from "../../components/buttons/LongBtn";
import SearchInput2 from "../../components/input/SearchInput2";
import { Cloud, Sun, CloudRain, AlertCircle } from "lucide-react";

//css import
import "react-calendar/dist/Calendar.css";
import styles from "./PlanFilterSelector.module.css";

interface Companion {
  label: string;
  count: number;
}

const ages = ["10대", "20대", "30대", "40대", "50대", "60대", "70대", "80대"];

const purposes = [
  "호캉스",
  "수영장",
  "혼자",
  "기념일",
  "리조트",
  "맛집",
  "바다",
  "낮술",
  "산",
  "힐링",
  "카페 투어",
  "장수 잔치",
  "가족 여행",
  "해산물 좋아",
  "고기 좋아",
  "역사 여행",
];

// 날짜 선택 컴포넌트
interface DateSelectorProps {
  selectedDateRange: [Date, Date] | null;
  setSelectedDateRange: React.Dispatch<
    React.SetStateAction<[Date, Date] | null>
  >;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDateRange,
  setSelectedDateRange,
}) => {
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date()); // 현재 활성화된 달 상태

  // 날짜 변경 이벤트 처리
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (Array.isArray(value) && value.length === 2) {
      setSelectedDateRange(value as [Date, Date]);
    }
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setActiveStartDate(
      new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() - 1, 1)
    );
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setActiveStartDate(
      new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className={styles.travel_schedule_section}>
      <h2 className={styles.section_title}>2. 일정</h2>
      <div className={styles.calendar_container}>
        {/* 이전 달 버튼 */}
        <button
          className={`${styles.calendar_nav_button} ${styles.prev_button}`}
          onClick={handlePrevMonth}
        >
          {"<"}
        </button>

        {/* 달력 */}
        <div className={styles.calendar_wrapper}>
          <Calendar
            onChange={handleDateChange}
            selectRange
            className={styles.custom_calendar}
            locale="ko-KR"
            minDate={new Date()}
            activeStartDate={activeStartDate} // 현재 활성화된 월
            nextLabel={null} // 내부 '>' 버튼 제거
            prevLabel={null} // 내부 '<' 버튼 제거
            next2Label={null} // 내부 '>>' 버튼 제거
            prev2Label={null} // 내부 '<<' 버튼 제거
            formatDay={(locale, date) => date.getDate().toString()} // 날짜에서 "일" 제거
            showFixedNumberOfWeeks={true}
          />
        </div>

        {/* 다음 달 버튼 */}
        <button
          className={`${styles.calendar_nav_button} ${styles.next_button}`}
          onClick={handleNextMonth}
        >
          {">"}
        </button>
      </div>

      {/* 선택된 날짜 표시 */}
      {selectedDateRange && (
        <p className={styles.selected_date}>
          선택된 날짜:{" "}
          {`${selectedDateRange[0].toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })} ~ ${selectedDateRange[1].toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}
        </p>
      )}
    </div>
  );
};

// 가능한 날씨 상태
type WeatherType = "맑음" | "흐림" | "비";

// 날씨 상태 인터페이스 (나중에 API 연동 시 사용할 error 옵션 포함)
interface WeatherState {
  type: WeatherType;
  error?: boolean;
}

// 날씨 정보 컴포넌트
const WeatherAlert = () => {
  // 기본 날씨 상태 설정 (error, setWeatherState는 API 연동 전까지는 불필요)
  const [weatherState, setWeatherState] = useState<WeatherState>({
    type: "맑음",
  });

  // 날씨 상태에 따른 아이콘 선택 함수
  const getWeatherIcon = (weatherType: WeatherType): JSX.Element => {
    switch (weatherType) {
      case "맑음":
        return <Sun className={styles.weather_icon} />;
      case "흐림":
        return <Cloud className={styles.weather_icon} />;
      case "비":
        return <CloudRain className={styles.weather_icon} />;
      default:
        return (
          <AlertCircle
            className={`${styles.weather_icon} ${styles.text_error}`}
          />
        );
    }
  };

  return (
    <div className={styles.weather_container}>
      <div className={styles.weather_alert_card}>
        <div className={styles.weather_icon_wrapper}>
          {getWeatherIcon(weatherState.type)}
        </div>
        <div className={styles.weather_content}>
          <h3 className={styles.weather_title}>
            예상 날씨 - {weatherState.type}
          </h3>
          <p className={styles.weather_update_time}>
            3일 전 알람으로 다시 알려드릴게요!
          </p>
        </div>
      </div>
    </div>
  );
};

const PlanFilterSelector: React.FC = () => {
  const navigate = useNavigate();

  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date, Date] | null
  >(null);

  const [companions, setCompanions] = useState<Companion[]>([
    { label: "성인", count: 0 },
    { label: "청소년", count: 0 },
    { label: "어린이", count: 0 },
    { label: "영유아", count: 0 },
    { label: "반려견", count: 0 },
  ]);

  const [region, setRegion] = useState<string>(""); // 지역
  const [selectedAge, setSelectedAge] = useState<string | null>(null); // 나이
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]); // 목적
  // const [activeButton, setActiveButton] = useState<string | null>(null);

  // 동반자 수 변경 이벤트 핸들러
  const handleCompanionChange = (label: string, delta: number) => {
    // 이전 동반자 상태를 기반으로 동반자 수를 업데이트
    setCompanions((prevCompanions) =>
      // 동반자 배열을 순회하며 특정 label에 해당하는 동반자의 count 값을 업데이트
      prevCompanions.map(
        (companion) =>
          companion.label === label // label이 일치하는 동반자를 찾음
            ? // 기존 동반자 정보는 그대로 유지하고 count를 delta만큼 변경하되 최소값은 0으로 제한
              { ...companion, count: Math.max(0, companion.count + delta) }
            : companion // label이 일치하지 않으면 기존 동반자 데이터를 그대로 반환
      )
    );
  };

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes((prevSelected) =>
      prevSelected.includes(purpose)
        ? prevSelected.filter((item) => item !== purpose)
        : [...prevSelected, purpose]
    );
  };

  // 입력 데이터 전송 이벤트 핸들러
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 폼 기본 동작 방지

    // API 통신 로직 추가
    navigate("/plan/list");
  };

  return (
    <form className={styles.travel_plan_container} onSubmit={handleSubmit}>
      <h1 className={styles.travel_plan_header}>
        이번 여행에 대해 알려주세요!
      </h1>
      <p className={styles.travel_plan_description}>
        맞춤 여행 플랜을 준비하고 있습니다.
      </p>

      {/* 지역 선택 */}
      <div className={styles.travel_region_section}>
        <h2 className={styles.section_title}>1. 지역</h2>
        <div className={styles.region_input_container}>
          <SearchInput2
            type="text"
            value={region}
            placeholder="지역을 입력해주세요"
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>
      </div>

      {/* 날짜 선택 */}
      <DateSelector
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
      />

      {/* 날씨 정보 */}
      <WeatherAlert />

      {/* 나이 선택 */}
      <div className={styles.travel_age_section}>
        <h2 className={styles.section_title}>3. 연령대</h2>
        <div className={styles.age_selection_container}>
          {ages.map((age) => (
            <button
              key={age}
              className={`${styles.age_button} ${
                selectedAge === age ? styles.active : ""
              }`}
              onClick={() => setSelectedAge(age)}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* 일행 선택 */}
      <div className={styles.travel_companions_section}>
        <h2 className={styles.section_title}>4. 일행</h2>
        <div className={styles.companions_selection_container}>
          {companions.map(({ label, count }, index) => (
            <div key={label} className={styles.companion_group}>
              <div className={styles.companion_controls}>
                <button
                  className={styles.companion_minus}
                  onClick={() => handleCompanionChange(label, -1)}
                >
                  -
                </button>
                <span className={styles.companion_label}>{label}</span>
                <button
                  className={styles.companion_plus}
                  onClick={() => handleCompanionChange(label, 1)}
                >
                  +
                </button>
                <span className={styles.companion_count}>
                  {label === "반려견"
                    ? `총 ${count} 마리`
                    : index === 0
                    ? `(본인 포함) 총 ${count}명`
                    : `총 ${count}명`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 목적 선택 */}
      <div className={styles.travel_purpose_section}>
        <h2 className={styles.section_title}>5. 목적</h2>
        <div className={styles.purpose_selection_container}>
          {purposes.map((purpose) => (
            <button
              key={purpose}
              type="button"
              className={`${styles.purpose_button} ${
                selectedPurposes.includes(purpose) ? styles.active : ""
              }`}
              onClick={() => togglePurpose(purpose)}
            >
              {purpose}
            </button>
          ))}
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className={styles.travel_plan_complete_button}>
        <LongBtn type="submit" content="완료" />
      </div>
    </form>
  );
};

export default PlanFilterSelector;
