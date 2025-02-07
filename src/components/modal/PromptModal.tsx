import React, { useEffect, useState } from "react";
import "./PromptModal.css";
import SearchTextArea from "../input/SearchTextArea";
import axios from "axios";
import usePlanStore from "../../stores/PlanStore";
import { API_BASE_URL } from "../../config";

interface PromptModalProps {
  onClose: () => void;
  onSelect: (agentType: string, prompt: string) => void;
}

interface spotInterface {
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

const SpotList: React.FC<{ spots: spotInterface[] }> = ({ spots }) => {
  return (
    <div className="spot-list-container">
      <ul className="spot-list">
        {spots.map((spot) => (
          <li key={spot.kor_name} className="spot-item">
            <div className="spot-image">
              <img src={spot.image_url} alt={spot.kor_name} />
            </div>
            <div className="spot-info">
              <h3 className="spot-name">{spot.kor_name}</h3>
              <p className="spot-description">{spot.description}</p>
              <div className="spot-details">
                <p className="spot-address">
                  <img src="/icons/location.png" alt="location" />
                  {spot.address}
                </p>
                {spot.phone_number && (
                  <p className="spot-phone">
                    <img src="/icons/phone.png" alt="phone" />
                    {spot.phone_number}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PromptModal: React.FC<PromptModalProps> = ({ onClose, onSelect }) => {
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedAgentName, setSelectedAgentName] = useState<string>("");
  const [promptText, setPromptText] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>(
    "새로운 추천을 받고 싶으시다면 에이전트를 선택해주세요!"
  );
  const [spots, setSpots] = useState<spotInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const planStore = usePlanStore();

  const agents = [
    { id: "cafe", label: "카페 에이전트", icon: "/icons/cafe_agent.jpg" },
    {
      id: "restaurant",
      label: "맛집 에이전트",
      icon: "/icons/restaurant_agent.jpg",
    },
    { id: "site", label: "관광지 에이전트", icon: "/icons/site_agent.jpg" },
    {
      id: "accommodation",
      label: "숙소 에이전트",
      icon: "/icons/accommodation_agent.jpg",
    },
  ];

  useEffect(() => {
    const handleSubmit = async () => {
      if (!selectedAgent) {
        setAlertMessage("에이전트가 선택되지 않았어요.");
        return;
      }
      if (!promptText.trim()) {
        setAlertMessage("요청할 내용을 입력해주세요");
        return;
      }

      const planInfo = planStore.getPlan();
      //planInfo의 start_date와 end_date는 문자열이므로, date타입으로 변환해야 함.
      const planData = {
        ...planInfo,
        start_date: new Date(planInfo.start_date),
        end_date: new Date(planInfo.end_date),
      };
      console.log("planData: ", planData);

      try {
        setIsLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}/agents/${selectedAgent}?prompt=${promptText}`,
          planData,
          {
            withCredentials: true,
          }
        );

        console.log("에이전트 응답 결과: ", response);
        const spots = response.data.data.spots;
        setSpots(spots);
        console.log("spots: ", spots);
        setIsLoading(false);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage("서버 요청 중 오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };
    handleSubmit();
  }, [promptText]);

  return (
    <div id="prompt-modal-container">
      <div className="top-btn" onClick={onClose}>
        <img src="/icons/arrow-bottom-white.jpg" alt="close" />
      </div>
      <div>
        <div className="modal-title-container">
          <div className="radio-group">
            {agents.map((agent) => (
              <label
                className={`agent_radio_btn ${
                  selectedAgent === agent.id ? "active" : ""
                }`}
                key={agent.id}
                htmlFor={agent.id}
              >
                <img
                  className="agent_radio_icon"
                  src={agent.icon}
                  alt={agent.label}
                />
                <input
                  type="radio"
                  key={agent.id}
                  id={agent.id}
                  name="agent"
                  checked={selectedAgent === agent.id}
                  onChange={() => {
                    setSelectedAgent(agent.id);
                    setSelectedAgentName(agent.label);
                  }}
                />
                {agent.label}
              </label>
            ))}
          </div>
        </div>
        {isDataLoaded ? (
          <div className="spots_list_container">
            <p className="prev_prompt_text">{promptText}</p>
            <SpotList spots={spots} />
          </div>
        ) : (
          <div></div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <p className="modal-message">
              {selectedAgent === ""
                ? `${alertMessage}`
                : `${selectedAgentName}가 정보를 찾고 있어요...`}
            </p>
            <img
              className="loading-gif"
              src="/images/loading.gif"
              alt="loading"
            />
            <SearchTextArea setPromptText={setPromptText} readOnly={true} />
          </div>
        ) : (
          <div>
            <p className="modal-message">
              {selectedAgent === ""
                ? `${alertMessage}`
                : `${selectedAgentName}에게 원하시는 정보를 전달해보세요!`}
            </p>
            <SearchTextArea setPromptText={setPromptText} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptModal;
