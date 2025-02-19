import React from "react";
import "./SideBar.css";
import { Link } from "react-router-dom";
import MemberStore from "../../stores/MemberStore";
import { API_BASE_URL } from "../../config";
import axios from "axios";

interface SideBarProps {
  closeSideBar: () => void;
  isSideBarVisible: boolean;
  navigateAndCloseSideBar: (path: string) => void;
  handleMyPlans: () => void;
}

const SideBar: React.FC<SideBarProps> = ({
  isSideBarVisible,
  closeSideBar,
  navigateAndCloseSideBar,
  handleMyPlans,
}) => {
  const isAnonymous = MemberStore((state: any) => state.isAnonymous);
  const initMemberInfo = MemberStore((state: any) => state.initMemberInfo);

  const handleLogin = () => {
    navigateAndCloseSideBar("/loginForm");
  };

  const handleLogout = () => {
    initMemberInfo();
    axios.get(`${API_BASE_URL}/members/logout`, { withCredentials: true });
    closeSideBar();
  };

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
            />
          </div>
          {isAnonymous() ? (
            <div className="sideBar-1" onClick={handleLogin}>
              로그인
              <img src="/icons/arrow_forward.jpg" alt="login" />
            </div>
          ) : (
            <div className="sideBar-1" onClick={handleLogout}>
              로그아웃
              <img src="/icons/arrow_forward.jpg" alt="logout" />
            </div>
          )}
        </li>
        <li>
          <div className="sideBar-2 border-yellow">
            나의 일정
            <div className="sideBar-3" onClick={handleMyPlans}>
              나의 일정 확인
              <img src="/icons/arrow_forward.jpg" alt="MyPlan" />
            </div>
          </div>
        </li>
        <li>
          <div className="sideBar-2">
            내 정보
            <Link className="sideBar-3" to="/myInfo" onClick={closeSideBar}>
              내 정보 확인
              <img src="/icons/arrow_forward.jpg" alt="MyInfo" />
            </Link>
            <Link className="sideBar-3" to="/editMyInfo" onClick={closeSideBar}>
              개인 정보 수정
              <img src="/icons/arrow_forward.jpg" alt="editMyInfo" />
            </Link>
          </div>
        </li>
        <li>
          <div className="sideBar-2">
            고객 지원
            <Link className="sideBar-3" to="/ask" onClick={closeSideBar}>
              1:1문의
              <img src="/icons/arrow_forward.jpg" alt="ask" />
            </Link>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
