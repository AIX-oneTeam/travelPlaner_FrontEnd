import React, { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./PlanFilterSelector.css";
import LongBtn from "../../components/buttons/LongBtn";

interface Companion {
  label: string;
  count: number;
}

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

const PlanFilterSelector: React.FC = () => {
  // 여행 시작일, 종료일 상태
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Date, Date] | null
  >(null);

  // 일행 종류, 인원 수
  const [companions, setCompanions] = useState<Companion[]>([
    { label: "성인", count: 0 },
    { label: "청소년", count: 0 },
    { label: "어린이", count: 0 },
    { label: "영유아", count: 0 },
    { label: "반려견", count: 0 },
  ]);

  // 여행 목적(복수 선택 가능)
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);

  // 날짜 선택
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (Array.isArray(value) && value.length === 2) {
      setSelectedDateRange(value as [Date, Date]); // 시작일과 종료일 설정
    }
  };

  // 일행 수 증가/감소
  const handleCompanionChange = (label: string, delta: number) => {
    setCompanions((prevCompanions) =>
      prevCompanions.map((companion) =>
        companion.label === label
          ? { ...companion, count: Math.max(0, companion.count + delta) }
          : companion
      )
    );
  };

  // 목적 선택 토글
  const togglePurpose = (purpose: string) => {
    setSelectedPurposes(
      (prevSelected) =>
        prevSelected.includes(purpose)
          ? prevSelected.filter((item) => item !== purpose) // 이미 선택된 경우 해제
          : [...prevSelected, purpose] // 새로 선택된 경우 추가
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
          <input
            type="text"
            className="region-input"
            placeholder="지역을 입력하세요"
          />
          <button className="region-search-button">🔍</button>
        </div>
      </div>

      {/* 날짜 선택 */}
      <div className="travel-schedule-section">
        <h2 className="section-title">2. 일정</h2>
        <Calendar
          onChange={handleDateChange}
          selectRange // 날짜 범위 선택 활성화
          className="custom-calendar"
          locale="ko-KR"
          minDate={new Date()} // 오늘 이전 날짜 선택 불가
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

      {/* 나이 선택 */}
      <div className="travel-age-section">
        <h2 className="section-title">3. 나이</h2>
        <div className="age-selection-container">
          {[10, 20, 30, 40, 50, 60, 70, 80].map((age) => (
            <button
              key={age}
              className={`age-button ${age === 20 ? "active" : ""}`}
            >
              {age}대
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
