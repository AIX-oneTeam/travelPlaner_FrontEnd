import React from "react";
import MemberStore from "../../stores/MemberStore";
import Cookies from "js-cookie";

const LoginSuccess: React.FC = () => {
  const decodedToken = MemberStore((state: any) => state.decodeToken);
  const setAuth = MemberStore((state: any) => state.setAuth);
  const setLocalStorage = MemberStore((state: any) => state.setLocalStorage);

  console.log("로그인 성공");
  // 후처리 작업
  // 쿠키에서 토큰 추출

  const accessToken = Cookies.get("jwt_token");
  const refreshToken = Cookies.get("refresh_token");
  console.log("accessToken: ", accessToken);

  if (!accessToken) {
    console.log("토큰이 없습니다.");
  }

  //   const refreshToken = document.cookie.split("refresh_token=");

  //zustand 스토어에 저장
  const tokenData = decodedToken(accessToken);
  setAuth({
    ...tokenData,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
  //로컬 스토리지에 저장
  setLocalStorage(tokenData);

  // window.location.href = "/";

  return <div>로그인 성공</div>;
};

export default LoginSuccess;
