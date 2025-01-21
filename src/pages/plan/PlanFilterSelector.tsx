import React, { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import LongBtn from "../../components/buttons/LongBtn";
import SearchInput2 from "../../components/input/SearchInput2";
import { Cloud, Sun, CloudRain, AlertCircle } from "lucide-react";

//css import
import "react-calendar/dist/Calendar.css";
import "./PlanFilterSelector.css";

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
    <div className="travel-schedule-section">
      <h2 className="section-title">2. 일정</h2>
      <div className="calendar-container">
        {/* 이전 달 버튼 */}
        <button
          className="calendar-nav-button prev-button"
          onClick={handlePrevMonth}
        >
          {"<"}
        </button>

        {/* 달력 */}
        <div className="calendar-wrapper">
          <Calendar
            onChange={handleDateChange}
            selectRange
            className="custom-calendar"
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
          className="calendar-nav-button next-button"
          onClick={handleNextMonth}
        >
          {">"}
        </button>
      </div>

      {/* 선택된 날짜 표시 */}
      {selectedDateRange && (
        <p className="selected-date">
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
        return <Sun className="weather-icon" />;
      case "흐림":
        return <Cloud className="weather-icon" />;
      case "비":
        return <CloudRain className="weather-icon" />;
      default:
        return <AlertCircle className="weather-icon text-error" />;
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-alert-card">
        <div className="weather-icon-wrapper">
          {getWeatherIcon(weatherState.type)}
        </div>
        <div className="weather-content">
          <h3 className="weather-title">예상 날씨 - {weatherState.type}</h3>
          <p className="weather-update-time">
            3일 전 알람으로 다시 알려드릴게요!
          </p>
        </div>
      </div>
    </div>
  );
};

const PlanFilterSelector: React.FC = () => {
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

    // +, - 버튼 active
    // setActiveButton(`${label}-${delta > 0 ? "plus" : "minus"}`);

    // Reset active button after 300ms
    // setTimeout(() => setActiveButton(null), 300);
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
  };

  return (
    <form className="travel-plan-container" onSubmit={handleSubmit}>
      <h1 className="travel-plan-header">이번 여행에 대해 알려주세요!</h1>
      <p className="travel-plan-description">
        맞춤 여행 플랜을 준비하고 있습니다.
      </p>

      {/* 지역 선택 */}
      <div className="travel-region-section">
        <h2 className="section-title">1. 지역</h2>
        <div className="region-input-container">
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
      <div className="travel-age-section">
        <h2 className="section-title">3. 나이</h2>
        <div className="age-selection-container">
          {ages.map((age) => (
            <button
              key={age}
              className={`age-button ${selectedAge === age ? "active" : ""}`}
              onClick={() => setSelectedAge(age)}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* 일행 선택 */}
      <div className="travel-companions-section">
        <h2 className="section-title">4. 일행</h2>
        <div className="companions-selection-container">
          {companions.map(({ label, count }, index) => (
            <div key={label} className="companion-group">
              <div className="companion-controls">
                <button
                  className="companion-minus"
                  onClick={() => handleCompanionChange(label, -1)}
                >
                  -
                </button>
                <span className="companion-label">{label}</span>
                <button
                  className="companion-plus"
                  onClick={() => handleCompanionChange(label, 1)}
                >
                  +
                </button>
                <span className="companion-count">
                  {label === "반려견"
                    ? `총 ${count} 마리`
                    : index === 0
                    ? `(본인 제외) 총 ${count}명`
                    : `총 ${count}명`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 목적 선택 */}
      <div className="travel-purpose-section">
        <h2 className="section-title">5. 목적</h2>
        <div className="purpose-selection-container">
          {purposes.map((purpose) => (
            <button
              key={purpose}
              className={`purpose-button ${
                selectedPurposes.includes(purpose) ? "active" : ""
              }`}
              onClick={() => togglePurpose(purpose)}
            >
              {purpose}
            </button>
          ))}
        </div>
      </div>

      {/* 완료 버튼 */}
      <div className="travel-plan-complete-button">
        <LongBtn type="submit" content="완료" />
      </div>
    </form>
  );
};

export default PlanFilterSelector;
