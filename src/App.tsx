import { BrowserRouter, Routes, Route } from "react-router-dom";

// 전역 스타일 및 공통 레이아웃 컴포넌트
import "./assets/css/common/variables.css";
import Layout from "./components/layout/Layout";

import Home from "./pages/main/home"; // 메인화면
import LoginForm from "./pages/user/LoginForm"; // 로그인폼
import HjWebTest from "./pages/main/HjWebTest";

import Plan from "./pages/plan/Plan";
import PlanList from "./pages/plan/PlanList";
import PlanFilter from "./pages/plan/PlanFilter";
// git 대소문자 변경용 주석
import CheckList from "./pages/checkList/CheckList";
import LoadKakaoMap from "./pages/plan/include/LoadPlanMap";
import "./firebase-config";

function App() {
  return (
    <div>
      <LoadKakaoMap />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loginform" element={<LoginForm />} />
            <Route path="/hj" element={<HjWebTest />} />
            <Route path="/plan/filter/" element={<PlanFilter />} />
            <Route path="/plans/list" element={<PlanList />} />
            <Route path="/plans/:planIdFirst?" element={<Plan />} />
            <Route path="/checkList/:planId" element={<CheckList />} />
            {/* <Route path="/plan/modify" element={<PlanModify />} /> */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
