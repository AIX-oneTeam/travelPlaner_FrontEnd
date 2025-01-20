import React from "react";
import styles from "./LoginForm.module.css";
import API_BASE_URL from "../../config"; // config.ts에서 API_BASE_URL을 임포트

const LoginForm = () => {
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

  const handleGoogleLogin = () => {
    console.log("Google 로그인 클릭");
    // Google 로그인 로직 추가
  };

  return (
    <div id={styles.login_container}>
      <div className={styles.login_form}>
        <div className={styles.logo_placeholder}>
          <img src="/icons/Easy_Travel.png" alt="로고" />
        </div>
        {/* 카카오 로그인 */}
        <div className={styles.kakao_login_button}>
          <img
            src="/images/kakao_login_btn.jpg"
            alt="카카오 로그인 버튼"
            onClick={handleKakaoLogin}
          />
        </div>

        {/* 네이버 로그인 */}
        <div className={styles.naver_login_button}>
          <button onClick={handleNaverLogin}>
            <img src="/images/naver_logo.jpg" alt="네이버" />
            <span>네이버 로그인</span>
          </button>
        </div>

        {/* 구글 로그인 */}
        <div className={styles.google_login_button}>
          <button onClick={handleGoogleLogin}>
            <img src="/images/google_logo.jpg" alt="구글" />
            <span>Google 계정으로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
