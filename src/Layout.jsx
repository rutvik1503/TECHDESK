import React from "react";
import Sidebar from "./Common/Sidebar/Sidebar.jsx";
import Navbar from "./Common/Navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex w-full max-h-[100vh] text-white box-border overflow-hidden bg-[rgba(0,0,0,0.5)] backdrop-blur-[50px]">
      {/* Fixed Sidebar */}
      <div
        className="fixed top-0 left-0 h-screen w-[17.5%] p-5 z-50 overflow-y-auto scrollbar-none"
      >
        <Sidebar />
      </div>

      {/* Main Content Container */}
      <div className="flex-1 ml-[calc(17.5%-12.5px)] flex flex-col min-h-screen box-border">
        {/* Navbar */}
        <div className="w-full h-[100px] p-[15px] z-40  box-border">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 rounded-[17.5px] overflow-auto scrollbar-none p-[15px] pt-0 box-border element">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
