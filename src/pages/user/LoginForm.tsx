import React from "react";
import "./LoginForm.css";
import { v4 as uuidv4 } from "uuid";
import API_BASE_URL from "../../config"; // config.ts에서 API_BASE_URL을 임포트
import axios from "axios";

// Authorization Code Flow
// 1. 프론트는 각 인증서버에 API키를 이용해 인증 코드를 받고 이를 백엔드로 전송
// 2. 백엔드는 인증 코드를 사용해 액세스 토큰을 요청
// 3. 백엔드는 액세스 토큰을 통해 ID토큰을 받고, JWT토큰을 발행해 프론트에 전송
// 4. 프론트는 JWT토큰을 저장해 인증된 사용자임을 유지
// 5. 백엔드는 JWT토큰을 검증해 사용자 인증(상태는 저장하지 않음)

const LoginForm = () => {
  // 일반 메소드 (로그인 이벤트 핸들러)
  const handleKakaoLogin = () => {
    const kakaoClientId = process.env.REACT_APP_KAKAO_CLIENT_ID || "";
    const kakaoRedirectUrl = process.env.REACT_APP_KAKAO_REDIRECT_URL || "";
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUrl}&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  // 네이버 로그인 로직
  const handleNaverLogin = async () => {
    const naverClientId = process.env.REACT_APP_NAVER_CLIENT_ID || "";
    const redirectUri = process.env.REACT_APP_NAVER_REDIRECT_URL || "";
    const state = uuidv4();
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverClientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;

    window.location.href = naverAuthUrl;
  };

  const handleGoogleLogin = async () => {
    const googleClientId: string = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
    const googleRedirectUrl: string =
      process.env.REACT_APP_GOOGLE_REDIRECT_URL || "";
    const googleScope = "openid email profile";
    const googleResponseType = "code"; // 1회용 코드 요청
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&scope=${googleScope}&response_type=${googleResponseType}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <div id="login-container">
      <div className="login-form">
        <div className="logo-placeholder">
          <img src="/icons/Easy_Travel.png" alt="로고" />
        </div>
        {/* 카카오 로그인 */}
        <div className="kakao-login-button">
          <button onClick={handleKakaoLogin}>
            <img src="/images/kakao_login_btn.jpg" alt="카카오 로그인 버튼" />
          </button>
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
