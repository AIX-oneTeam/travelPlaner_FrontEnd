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

const PromptModal: React.FC<PromptModalProps> = ({ onClose, onSelect }) => {
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedAgentName, setSelectedAgentName] = useState<string>("");
  const [promptText, setPromptText] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>(
    "새로운 추천을 받고 싶으시다면 에이전트를 선택해주세요!"
  );
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

      const planData = planStore.getPlan();
      console.log("planData: ", planData);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/agents/${selectedAgent}?prompt=${promptText}`,
          planData,
          {
            withCredentials: true,
          }
        );

        console.log("에이전트 응답 결과: ", response);
        onClose();
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage("서버 요청 중 오류가 발생했습니다");
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
        <p className="modal-message">
          {selectedAgent === ""
            ? `${alertMessage}`
            : `${selectedAgentName}에게 원하시는 정보를 전달해보세요!`}
        </p>
        <SearchTextArea setPromptText={setPromptText} />
      </div>
    </div>
  );
};

export default PromptModal;
