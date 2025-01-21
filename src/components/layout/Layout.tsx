import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import MainContent from "../main/MainContent";
import "./Layout.css";
import SideBar from "../sideBar/SideBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const [isSideBarVisible, setIsSideBarVisible] =
    React.useState<boolean>(false);

  const openSideBar = () => {
    setIsSideBarVisible(true);
  };

  const closeSideBar = () => {
    setIsSideBarVisible(false);
  };

  // 푸터를 숨길 경로 정의
  const hideFooterPaths = ["/plan/modify"];

  return (
    <div className="layout-container">
      <SideBar
        isSideBarVisible={isSideBarVisible}
        closeSideBar={closeSideBar}
      />
      <Header openSideBar={openSideBar} />
      <MainContent>{children}</MainContent>
      {/* 현재 경로가 hideFooterPaths에 포함되지 않은 경우에만 푸터 렌더링 */}
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default Layout;
