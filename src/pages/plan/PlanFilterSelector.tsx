import React, { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./PlanFilterSelector.css";
import LongBtn from "../../components/buttons/LongBtn";
import SearchInput2 from "../../components/input/SearchInput2";

import { Sun } from "lucide-react";

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

// 간단한 날씨 알림 컴포넌트
const WeatherAlert = () => {
  return (
    <div className="w-full max-w-md p-4">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Sun className="w-8 h-8 text-yellow-500" />
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <span className="font-medium">예상 날씨</span>
            <span className="ml-2 text-gray-600">- 화창</span>
          </div>

          <div className="text-sm text-gray-500">
            3일 전 알람으로 다시 알려드릴께요!
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 bg-gray-100 rounded-full"></div>
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

  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (Array.isArray(value) && value.length === 2) {
      setSelectedDateRange(value as [Date, Date]);
    }
  };

  const handleCompanionChange = (label: string, delta: number) => {
    setCompanions((prevCompanions) =>
      prevCompanions.map((companion) =>
        companion.label === label
          ? { ...companion, count: Math.max(0, companion.count + delta) }
          : companion
      )
    );

    // Set active button
    setActiveButton(`${label}-${delta > 0 ? "plus" : "minus"}`);

    // Reset active button after 300ms
    setTimeout(() => setActiveButton(null), 300);
  };

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes((prevSelected) =>
      prevSelected.includes(purpose)
        ? prevSelected.filter((item) => item !== purpose)
        : [...prevSelected, purpose]
    );
  };

  return (
    <div className="travel-plan-container">
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
            placeholder="지역을 입력해주세요"
            onChange={(e) => {
              console.log("지역 입력 값:", e.target.value);
            }}
          />
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="travel-schedule-section">
        <h2 className="section-title">2. 일정</h2>
        <Calendar
          onChange={handleDateChange}
          selectRange
          className="custom-calendar"
          locale="ko-KR"
          minDate={new Date()}
        />
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
    </div>
  );
};

export default PlanFilterSelector;
