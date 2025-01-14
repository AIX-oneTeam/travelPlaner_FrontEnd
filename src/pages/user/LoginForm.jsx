import React, { useState } from "react";
import "../../assets/css/user/LoginForm.css";

const LoginForm = () => {
  // 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // 로그인 버튼 클릭 이벤트
  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Email: ${email}, Password: ${password}, Remember Me: ${rememberMe}`);
  };

  return (
    <div className="div">
      {/* 로그인 폼 */}
      <div className="form">
        <div className="div2">이메일</div>
        <input
          type="email"
          className="rectangle-11"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@google.com"
        />
        <div className="div3">비밀번호</div>
        <input
          type="password"
          className="rectangle-13"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="*******"
        />
        <div className="div5">
          로그인하고 나만의 여행을
          <br />
          시작해 보세요
        </div>
        <div className="div7">아이디·비밀번호 찾기</div>
        <label className="div9">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          로그인 유지
        </label>
        <button className="rectangle-15" onClick={handleLogin}>
          로그인
        </button>
      </div>

      {/* 소셜 로그인 섹션 */}
      <div className="div10">
        <img
          className="_89-a-68-d-1-e-3674-a-1"
          src="_89-a-68-d-1-e-3674-a-10.png"
          alt="소셜 로그인 아이콘"
        />
        <div className="div11">또는</div>
        <div className="line-1"></div>
        <div className="line-2"></div>
      </div>
    </div>
  );
};

export default LoginForm;