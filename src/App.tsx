import { BrowserRouter, Routes, Route } from "react-router-dom";

// 전역 스타일 및 공통 레이아웃 컴포넌트
import "./assets/css/common/variables.css";
import Layout from "./components/layout/Layout";

import WebTest from "./pages/main/WebTest"; // 메인화면
import LoginForm from "./pages/user/LoginForm"; // 로그인폼

function App() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<WebTest />} />
            <Route path="/loginform" element={<LoginForm />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
