import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import HomeImg from "/public/Icons/Home.png";
import HomeImgFilled from "/public/Icons/HomeFilled.png";
import ClientImg from "/public/Icons/Client.png";
import ClientImgFilled from "/public/Icons/ClientFilled.png";
import EmployeeImg from "/public/Icons/Employee.png";
import EmployeeImgFilled from "/public/Icons/EmployeeFilled.png";
import ExpensesImg from "/public/Icons/Expenses.png";
import ExpensesImgFilled from "/public/Icons/ExpensesFilled.png";
import IncomeImg from "/public/Icons/Income.png";
import IncomeImgFilled from "/public/Icons/IncomeFilled.png";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("home");
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "home",
      label: "Home",
      icon: HomeImg,
      iconActive: HomeImgFilled,
      route: "/",
    },
    {
      name: "client",
      label: "Client",
      icon: ClientImg,
      iconActive: ClientImgFilled,
      route: "/client",
    },
    {
      name: "employee",
      label: "Employee",
      icon: EmployeeImg,
      iconActive: EmployeeImgFilled,
      route: "/employee",
    },
    {
      name: "income",
      label: "Income",
      icon: IncomeImg,
      iconActive: IncomeImgFilled,
      route: "/income",
    },
    {
      name: "expenses",
      label: "Expenses",
      icon: ExpensesImg,
      iconActive: ExpensesImgFilled,
      route: "/expense",
    },
  ];

  const handleClick = (item) => {
    setActiveMenu(item.name);
    navigate(item.route);
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div
        onClick={() => {
          navigate("/");
          setActiveMenu("home");
        }}
        className="CapitalFont text-[30px] font-bold tracking-widest cursor-pointer flex gap-3 items-center 
                   bg-clip-text text-transparent bg-gradient-to-r from-[#1966FF] to-[#00D4FF] 
                   hover:scale-105 transition-transform duration-300 
                   drop-shadow-lg"
      >
        TECHDESK
      </div>

      {/* Menu Items */}
      <div className="w-full flex flex-col gap-6 text-[#9ba6c4] SmallFont">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`relative w-full flex items-center gap-4 cursor-pointer p-3 rounded-lg transition-all duration-300 
              ${
                activeMenu === item.name
                  ? "bg-[rgba(25,102,255,0.1)] text-white font-semibold"
                  : "hover:bg-[rgba(255,255,255,0.05)] hover:text-white font-medium"
              }`}
            onClick={() => handleClick(item)}
          >
            <img
              className="w-[25px] h-[25px] object-contain"
              src={activeMenu === item.name ? item.iconActive : item.icon}
              alt={item.label}
            />
            <p className="text-[14px] font-[400] tracking-[1px]">
              {item.label}
            </p>

            {/* Active Indicator */}
            {activeMenu === item.name && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-[#1966FF] to-[#00D4FF] rounded-r-full"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
