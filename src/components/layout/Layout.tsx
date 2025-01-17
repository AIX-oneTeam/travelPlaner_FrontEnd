import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import MainContent from "../main/MainContent";
import "./Layout.css";
import SideBar from "../sideBar/SideBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSideBarVisible, setIsSideBarVisible] =
    React.useState<boolean>(false);

  const openSideBar = () => {
    setIsSideBarVisible(true);
  };

  const closeSideBar = () => {
    setIsSideBarVisible(false);
  };

  return (
    <div className="layout-container">
      <SideBar
        isSideBarVisible={isSideBarVisible}
        closeSideBar={closeSideBar}
      />
      <Header openSideBar={openSideBar} />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
};

export default Layout;
