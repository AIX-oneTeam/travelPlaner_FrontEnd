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
        <div className="logo-placeholder">
          <img src="/icons/Easy_Travel.png" alt="로고" />
        </div>
        {/* 카카오 로그인 */}
        <div className="kakao-login-button">
          <img
            src="/images/kakao_login_btn.jpg"
            alt="카카오 로그인 버튼"
            onClick={handleKakaoLogin}
          />
        </div>

        {/* 네이버 로그인 */}
        <div className="naver-login-button">
          <button onClick={handleNaverLogin}>
            <img src="/images/naver-logo.jpg" alt="네이버" />
            <span>네이버 로그인</span>
          </button>
        </div>

        {/* 구글 로그인 */}
        <div className="google-login-button">
          <button onClick={handleGoogleLogin}>
            <img src="/images/google-logo.jpg" alt="구글" />
            <span>Google 계정으로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
