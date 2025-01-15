//import 라이브러리
import React from "react";
import "./LoginForm.css";

const LoginForm = () => {
  // 일반 메소드 (로그인 이벤트 핸들러)
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 클릭");
    // 카카오 로그인 로직 추가
  };

  const handleNaverLogin = () => {
    console.log("네이버 로그인 클릭");
    // 네이버 로그인 로직 추가
  };

  const handleGoogleLogin = () => {
    console.log("Google 로그인 클릭");
    // Google 로그인 로직 추가
  };

  return (
    <div id="login-container">
      <div className="login-form">
        <div className="logo-placeholder">예비로고</div>
        <div className="login-prompt">
          로그인하고 나만의 여행을
          <br />
          시작해 보세요
        </div>

        {/* 카카오 로그인 */}
        <div className="kakao-login-button" id="kakaoIdLogin">
          <img
            src="/images/kakao_login_btn.png"
            alt="카카오 로그인 버튼"
            onClick={handleKakaoLogin}
          />
        </div>

        {/* 네이버 로그인 */}
        <div className="cta-button" id="naverIdLogin">
          <button onClick={handleNaverLogin}>
            <img src="/images/btnG_아이콘사각.png" alt="네이버" />
            <span>네이버 로그인</span>
          </button>
        </div>

        {/* 구글 로그인 */}
        <div className="web-banner-image" id="googleIdLogin">
          <button onClick={handleGoogleLogin}>
            <img src="/images/google-logo.png" alt="구글" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
