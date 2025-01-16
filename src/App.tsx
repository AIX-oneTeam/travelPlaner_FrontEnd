import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 전역 스타일 및 공통 레이아웃 컴포넌트
import "./assets/css/common/variables.css";
import Layout from "./components/layout/Layout";

import Home from "./pages/main/home"; // 메인화면
import LoginForm from "./pages/user/LoginForm"; // 로그인폼
import HjWebTest from "./pages/main/HjWebTest";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loginform" element={<LoginForm />} />
            <Route path="/hj" element={<HjWebTest />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
