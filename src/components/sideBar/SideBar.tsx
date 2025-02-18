import React, { useState } from "react";
import "./SideBar.css";
import { Link, useNavigate } from "react-router-dom";
import MemberStore from "../../stores/MemberStore";
import { API_BASE_URL } from "../../config";
import axios from "axios";
import AlertModal from "../modal/AlertModal";

interface SideBarProps {
  closeSideBar: () => void;
  isSideBarVisible: boolean;
}

const SideBar: React.FC<SideBarProps> = ({
  isSideBarVisible,
  closeSideBar,
}) => {
  const isAnonymous = MemberStore((state: any) => state.isAnonymous);
  const initMemberInfo = MemberStore((state: any) => state.initMemberInfo);
  const navigate = useNavigate();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalContent, setAlertModalContent] = useState("");

  const handleLogin =()=> {
    closeSideBar();
  }
  //로그아웃 처리
  const handleLogout = () => {
    initMemberInfo();
    axios.get(`${API_BASE_URL}/members/logout`, { withCredentials: true });
    closeSideBar();
  };

  // false면 렌더링 하지 않음
  if (!isSideBarVisible) {
    return null;
  }

  const handleMyPlans = () => {
    if (isAnonymous()) {
      navigate("/loginForm");
      setAlertModalContent("로그인 후 이용해주세요.");
      setIsAlertModalOpen(true);
      return;
    }
    navigate("/plans/list");
    closeSideBar();
  };

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
          {isAnonymous() ? (
            <Link className="sideBar-1" to="/loginForm" onClick={handleLogin}>
              로그인
              <img src="/icons/arrow_forward.jpg" alt="login"></img>
            </Link>
          ) : (
            <div className="sideBar-1" onClick={handleLogout}>
              로그아웃
              <img src="/icons/arrow_forward.jpg" alt="login"></img>
            </div>
          )}
        </li>
        <li>
          <div className="sideBar-2 border-yellow">
            나의 일정
            <div className="sideBar-3" onClick={handleMyPlans}>
              나의 일정 확인
              <img src="/icons/arrow_forward.jpg" alt="MyPlan"></img>
            </div>
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
      <AlertModal
        isOpen={isAlertModalOpen}
        content={alertModalContent}
        onConfirm={() => {
          setIsAlertModalOpen(false);
        }}
      />
    </aside>
  );
};

export default SideBar;
