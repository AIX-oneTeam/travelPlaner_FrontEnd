import React from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";

interface SideBarProps {
  closeSideBar: () => void;
  isSideBarVisible: boolean;
}

const SideBar: React.FC<SideBarProps> = ({
  isSideBarVisible,
  closeSideBar,
}) => {
  // false면 렌더링 하지 않음
  if (!isSideBarVisible) {
    return null;
  }

  return (
    <aside id="sideBar-container">
      <h2 className="none">sideBar</h2>
      <ul className="sideBar-contents">
        <li>
          <div className="sideBar-header">
            <img
              className="close-btn"
              src="/icons/close.jpg"
              alt="close"
              onClick={closeSideBar}
            ></img>
          </div>
          <Link className="sideBar-1" to="/loginForm">
            로그인<img src="/icons/arrow_forward.jpg" alt="login"></img>
          </Link>
        </li>
        <li>
          <div className="sideBar-2 border-yellow">
            나의 일정
            <Link className="sideBar-3" to="/myPlan">
              나의 일정 확인
              <img src="/icons/arrow_forward.jpg" alt="MyPlan"></img>
            </Link>
          </div>
        </li>
        <li>
          <div className="sideBar-2">
            내 정보
            <Link className="sideBar-3" to="/myInfo">
              내 정보 확인
              <img src="/icons/arrow_forward.jpg" alt="MyInfo"></img>
            </Link>
            <Link className="sideBar-3" to="/editMyInfo">
              개인 정보 수정
              <img src="/icons/arrow_forward.jpg" alt="editMyInfo"></img>
            </Link>
          </div>
        </li>
        <li>
          <div className="sideBar-2">
            고객 지원
            <Link className="sideBar-3" to="/ask">
              1:1문의
              <img src="/icons/arrow_forward.jpg" alt="login"></img>
            </Link>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
