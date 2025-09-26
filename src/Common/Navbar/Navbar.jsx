import React from "react";
import AdminImage from "/public/AdminImage.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      {/* Dashboard Title */}
      <h1
        className="uppercase smallFont font-bold tracking-wider text-2xl 
                     bg-clip-text text-transparent bg-gradient-to-r from-[#1966FF] to-[#00D4FF] drop-shadow-lg"
      >
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        {/* Add Client Button */}
        <button
          onClick={() => navigate("/addclient")}
          className="px-5 py-2 SmallFont text-white text-[13px] tracking-[1px] font-medium text-base rounded-[17.5px] 
                 bg-gradient-to-r from-[#0b4ccd] to-[#03a8c9] 
                 hover:from-[#0198b6] hover:to-[#0445c6] 
                 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none"
        >
          + Add Client
        </button>

        {/* Admin Avatar */}
        <div className="relative">
          <img
            src={AdminImage}
            alt="Admin"
            className="w-10 h-10 object-cover rounded-full border-2 border-[#1966FF] 
                       hover:scale-110 transition-transform duration-300"
          />
          {/* Optional online indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-white"></span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
