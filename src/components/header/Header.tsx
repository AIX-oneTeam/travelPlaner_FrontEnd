import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import MemberStore from "../../stores/MemberStore";

interface HeaderProps {
  openSideBar: () => void;
}

const Header: React.FC<HeaderProps> = ({ openSideBar }) => {
  /*---라우터 관련-------------------------------*/

  /*---상태관리 변수들(값이 변화하면 화면 렌더링 )---*/
  const memberInfo = MemberStore((state: any) => state.memberInfo);

  /*---일반 변수--------------------------------*/

  /*---일반 메소드 -----------------------------*/

  /*---훅(useEffect)+이벤트(handle)메소드-------*/

  return (
    <div id="header-container">
      <div className="header-area">
        <div className="logo-container">
          <Link to="/">
            <img className="logo" src="/icons/Easy_Travel.png" alt="로고" />
          </Link>
        </div>

        <div className="text-container">
          <div className="member-profile"></div>
          <p className="member-nickname">
            {memberInfo.nickname}
            <span>님</span>
          </p>
          <img
            className="side-menu-btn"
            src="/icons/hamburger_menu.png"
            alt="메뉴"
            onClick={openSideBar}
          />
          {/* <button>로그인</button>
            <button>로그아웃</button> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
