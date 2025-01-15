import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import MainContent from "../main/MainContent";
import "./Layout.css";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
};

export default Layout;