import React from "react";
import Sidebar from "./Common/Sidebar/Sidebar.jsx";
import Navbar from "./Common/Navbar/Navbar.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex w-full max-h-[100vh] text-white box-border overflow-hidden bg-[rgba(0,0,0,0.5)] backdrop-blur-[50px]">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(25, 25, 25, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '0.5px'
          },
          success: {
            iconTheme: {
              primary: '#00D4FF',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4b4b',
              secondary: '#fff',
            },
          },
        }}
      />
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
        <div className="flex-1 rounded-[17.5px] overflow-auto scrollbar-none p-[15px] pt-0 box-border element relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Layout;
