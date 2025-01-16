import React from "react";
import "./home.css";

const Home: React.FC = () => {
  return (
    <div className="travel-container">
      <img
        className="travel-main-video"
        src="/images/main-video.png"
        alt="Main Video"
      />
      <div className="travel-main-text">
        <img
          className="travel-decor-rectangle-16"
          src="/images/Rectangle 16.png"
          alt="Rectangle 16"
        />
        <img
          className="travel-decor-rectangle-17"
          src="/images/Rectangle 17.png"
          alt="Rectangle 17"
        />
        <div className="travel-plan-title">
          <br />
          맞춤 여행 계획
        </div>
        <div className="travel-plan-subtitle">만드는</div>
        <div className="travel-plan-ai">
          <span>
            <span className="travel-plan-ai-highlight">AI</span>
            <span className="travel-plan-ai-secondary">로</span>
          </span>
        </div>
      </div>
      <div className="travel-buttons">
        <div className="travel-plan-button">
          <button>voice</button>
        </div>
        <div className="travel-plan-button">
          <button>text</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
