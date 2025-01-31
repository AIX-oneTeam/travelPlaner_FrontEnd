import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar, { CalendarProps } from "react-calendar";
import LongBtn from "../../components/buttons/LongBtn";
import NormalInput2 from "../../components/input/NormalInput2";
import { Cloud, Sun, CloudRain, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../../config";
import axios from "axios";

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

/* 일정(달력) 컴포넌트 */
interface DateSelectorProps {
  selectedDateRange: [Date, Date] | null;
  setSelectedDateRange: React.Dispatch<
    React.SetStateAction<[Date, Date] | null>
  >;
}

/* 일정(달력) 컴포넌트 */
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

/* 날씨 정보 컴포넌트 */
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

  const [region, setRegion] = useState<string>(""); // 지역 입력값
  const [allRegions, setAllRegions] = useState<any[]>([]); // 모든 지역 리스트
  const [filteredRegions, setFilteredRegions] = useState<any[]>([]); // 필터링된 지역 리스트
  const [selectedAge, setSelectedAge] = useState<string | null>(null); // 나이
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]); // 목적

  // 매핑 테이블
  const provinceMappings: Record<string, string> = {
    강원특별자치도: "강원도",
    충청북도: "충북",
    충청남도: "충남",
    전북특별자치도: "전라북도",
    전라남도: "전남",
    경상북도: "경북",
    경상남도: "경남",
    제주특별자치도: "제주도",
  };

  // 모든 지역 데이터를 가져오는 함수
  const fetchAllRegions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/regions/all`); // API 호출
      const divisions = response.data.data.divisions;
      setAllRegions(divisions); // 전체 지역 데이터 저장
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  // 사용자가 입력한 값에 따라 필터링
  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRegion(value); // 입력값 업데이트

    // 매핑 테이블에서 공식 명칭으로 변환
    const mappedProvinces = Object.keys(provinceMappings).filter((key) =>
      provinceMappings[key].includes(value)
    );

    // 입력값 또는 변환된 값에 따라 필터링
    const filtered = allRegions.filter(
      (region) =>
        mappedProvinces.includes(region.city_province) ||
        region.city_province.includes(value) ||
        region.city_county.includes(value)
    );
    setFilteredRegions(filtered); // 필터링된 결과 업데이트
  };

  // 사용자가 리스트에서 지역 선택 시 상태 저장
  const handleRegionSelect = (selectedRegion: string) => {
    setRegion(selectedRegion);
    setFilteredRegions([]); // 리스트 초기화
  };

  const [companions, setCompanions] = useState<Companion[]>([
    { label: "성인", count: 0 },
    { label: "청소년", count: 0 },
    { label: "어린이", count: 0 },
    { label: "영유아", count: 0 },
    { label: "반려견", count: 0 },
  ]);

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
    event.preventDefault();

    try {
      // 날짜를 MySQL의 DATETIME 형식으로 변환
      const formatToStartOfDay = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // JavaScript는 월 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day} 00:00:00`;
      };

      // dateRange 변환
      const formattedDateRange = selectedDateRange
        ? {
            startDate: formatToStartOfDay(selectedDateRange[0]),
            endDate: formatToStartOfDay(selectedDateRange[1]),
          }
        : null;

      // companions에서 count가 0 이상인 데이터만 필터링
      const filteredCompanions = companions.filter(
        (companion) => companion.count > 0
      );

      // 전송할 데이터 묶기
      const requestData = {
        region,
        dateRange: formattedDateRange,
        ageGroup: selectedAge,
        companions: filteredCompanions,
        purposes: selectedPurposes,
      };

      console.log("전송 데이터:", requestData);

      // API 요청
      // const response = await axios.post(`${API_BASE_URL}/plans`, requestData);

      // 성공 처리
      // console.log("응답 데이터:", response.data);
      navigate("/plan/list");
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      alert("여행 계획 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // useEffect에서 API 호출
  useEffect(() => {
    fetchAllRegions(); // 컴포넌트 로드 시 호출
  }, []);

  return (
    <form className={styles.travel_plan_container} onSubmit={handleSubmit}>
      <h1 className={styles.travel_plan_header}>
        이번 여행에 대해 알려주세요!
      </h1>
      <p className={styles.travel_plan_description}>
        맞춤 여행 플랜을 준비하고 있습니다.
      </p>

      <div className={styles.travel_region_section}>
        <h2 className={styles.section_title}>1. 지역</h2>
        <div className={styles.region_input_container}>
          {/* 입력 필드 */}
          <NormalInput2
            type="text"
            value={region}
            placeholder="지역을 입력해주세요"
            onChange={handleRegionChange}
            className={`${styles.NormalInput_box} ${
              region && filteredRegions.length > 0 ? styles.hasList : ""
            }`}
          />
        </div>

        {/* 필터링된 지역 리스트 */}
        {region && filteredRegions.length > 0 && (
          <ul className={styles.filtered_region_list}>
            {filteredRegions.map((filteredRegion, index) => (
              <li
                key={index}
                onClick={() =>
                  handleRegionSelect(
                    filteredRegion.city_province === filteredRegion.city_county
                      ? filteredRegion.city_province // 광역시는 중복 제거
                      : `${filteredRegion.city_province} - ${filteredRegion.city_county}`
                  )
                }
              >
                {filteredRegion.city_province === filteredRegion.city_county
                  ? filteredRegion.city_province
                  : `${filteredRegion.city_province} - ${filteredRegion.city_county}`}
              </li>
            ))}
          </ul>
        )}
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
              type="button"
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
                  type="button"
                  className={styles.companion_minus}
                  onClick={() => handleCompanionChange(label, -1)}
                >
                  -
                </button>
                <span className={styles.companion_label}>{label}</span>
                <button
                  type="button"
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
