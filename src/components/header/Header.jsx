import React from "react";
import "../../assets/css/Header.css";

const Header = () => {
  /*---라우터 관련-------------------------------*/

  /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

  /*---일반 변수--------------------------------*/

  /*---일반 메소드 -----------------------------*/

  /*---훅(useEffect)+이벤트(handle)메소드-------*/

  return (
    <>
      <div id="header-container">
        <div className="header-area">
          <div className="logo-container">
            <img className="logo" src="/images/logo.png" alt="로고" />
          </div>
          <div className="text-container">
            <img className="logo2" src="/images/logo2.png" alt="로고2" />
            {/* <button>로그인</button>
            <button>로그아웃</button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
