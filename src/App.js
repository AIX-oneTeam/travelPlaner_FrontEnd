import { BrowserRouter, Routes, Route } from "react-router-dom";

// 전역 스타일 및 공통 레이아웃 컴포넌트
import "./assets/css/common/reset.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import WebTest from "./pages/main/WebTest"; // 메인화면면
import LoginForm from "./pages/user/LoginForm"; // 로그인폼

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<WebTest />} />
          <Route path="/loginform" element={<LoginForm />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
