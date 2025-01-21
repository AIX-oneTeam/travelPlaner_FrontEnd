import React, { useEffect } from "react";
import "./LoginForm.css";
import { v4 as uuidv4 } from "uuid";
import {
  API_BASE_URL,
  GOOGLE_CLIENT_ID,
  NAVER_CLIENT_ID,
  KAKAO_CLIENT_ID,
} from "../../config"; // config.ts에서 API_BASE_URL을 임포트
import { useLocation } from "react-router-dom";
import MemberStore from "../../stores/MemberStore";

// Authorization Code Flow
// 1. 프론트는 각 인증서버에 API키를 이용해 인증 코드를 받고 이를 백엔드로 전송
// 2. 백엔드는 인증 코드를 사용해 액세스 토큰을 요청
// 3. 백엔드는 액세스 토큰을 통해 ID토큰을 받고, JWT토큰을 발행해 프론트에 전송
// 4. 프론트는 JWT토큰을 저장해 인증된 사용자임을 유지
// 5. 백엔드는 JWT토큰을 검증해 사용자 인증(상태는 저장하지 않음)

const LoginForm = () => {
  // 사용자가 이동한 URL을 이용해 로그인 상태 감지
  const location = useLocation();
  // 사용자 정보 저장 위한 스토어
  const setAuth = MemberStore((state: any) => state.setAuth);
  const decodedToken = MemberStore((state: any) => state.decodeToken);
  const setLocalStorage = MemberStore((state: any) => state.setLocalStorage);

  useEffect(() => {
    // 이동한 경로에 따라 작업 수행
    if (location.pathname === "/auth/login-success") {
      console.log("로그인 성공");
      // 후처리 작업
      // 쿠키에서 토큰 추출
      const accessToken = document.cookie.split("jwt_token=")[1];
      if (!accessToken) {
        console.log("토큰이 없습니다.");
        return;
      }

      const refreshToken = document.cookie.split("refresh_token=")[1];

      //zustand 스토어에 저장
      const tokenData = decodedToken(accessToken);

      setAuth({
        ...tokenData,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      //로컬 스토리지에 저장
      setLocalStorage(tokenData);
    } else if (location.pathname === "/auth/login-failure") {
      console.log("로그인 실패");
    }

    if (
      location.pathname === "/auth/login-success" ||
      location.pathname === "/auth/login-failure"
    ) {
      window.location.href = "/";
    }
  }, [location.pathname, setAuth, decodedToken, setLocalStorage]);

  // 일반 메소드 (로그인 이벤트 핸들러)
  const handleKakaoLogin = () => {
    const kakaoClientId: string = KAKAO_CLIENT_ID;
    const kakaoRedirectUrl = `${API_BASE_URL}/auth/kakao/callback`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUrl}&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  // 네이버 로그인 로직
  const handleNaverLogin = async () => {
    const naverClientId: string = NAVER_CLIENT_ID;
    const redirectUri = `${API_BASE_URL}/auth/naver/callback`;
    const state = uuidv4();
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverClientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;

    window.location.href = naverAuthUrl;
  };

  const handleGoogleLogin = async () => {
    const googleClientId: string = GOOGLE_CLIENT_ID;
    const googleRedirectUrl: string = `${API_BASE_URL}/auth/google/callback`;
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