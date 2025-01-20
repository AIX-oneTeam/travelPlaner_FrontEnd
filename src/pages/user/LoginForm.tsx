import React from "react";
import "./LoginForm.css";
import API_BASE_URL from "../../config"; // config.ts에서 API_BASE_URL을 임포트
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

// Authorization Code Flow
// 1. 프론트는 각 인증서버에 API키를 이용해 인증 코드를 받고 이를 백엔드로 전송
// 2. 백엔드는 인증 코드를 사용해 액세스 토큰을 요청
// 3. 백엔드는 액세스 토큰을 통해 ID토큰을 받고, JWT토큰을 발행해 프론트에 전송
// 4. 프론트는 JWT토큰을 저장해 인증된 사용자임을 유지
// 5. 백엔드는 JWT토큰을 검증해 사용자 인증(상태는 저장하지 않음)

const googleClientId: string = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
if (!googleClientId) {
  throw new Error("REACT_APP_GOOGLE_CLIENT_ID is not defined");
}

const LoginForm = () => {
  // CSRF 방지를 위해 랜덤 문자열 생성
  const generateRandomString = (length: number) => {
    return Math.random().toString(36).substring(2, 11);
  };

  // 일반 메소드 (로그인 이벤트 핸들러)
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 클릭");
    // 카카오 로그인 로직 추가
  };

  // 네이버 로그인 로직 (백엔드 API 호출)

  const handleNaverLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/naver/login`, {
        method: "GET",
        credentials: "include", // 쿠키를 전송하도록 설정
      });
      const data = await response.json();

      console.log("네이버 로그인 데이터:", data); // 서버에서 받은 데이터 출력

      if (data.naver_auth_url) {
        localStorage.setItem("state", data.state); // state 값 저장 (옵션)
        window.location.href = data.naver_auth_url; // 네이버 로그인 URL로 리디렉션
      } else {
        alert("네이버 로그인 URL을 가져오지 못했습니다.");
      }
    } catch (error) {
      console.error("네이버 로그인 API 호출 오류:", error);
      alert("네이버 로그인 API 호출에 실패했습니다.");
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      // google 로그인 백엔드로 요청
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/google/login`,
        {
          token: credentialResponse.credential,
        }
      );
      console.log("구글 로그인 데이터:", response.data);

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.error("구글 로그인 API 호출 오류:", error);
      alert("구글 로그인 API 호출에 실패했습니다.");
    }
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
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin onSuccess={handleGoogleLogin} />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
