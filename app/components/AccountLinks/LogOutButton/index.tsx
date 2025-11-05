'use client'

import { Logout } from "@/action/log-out";
import { LogOut } from "lucide-react"; 

const LogOutButton = () => {
  const handleClick = () => {
    Logout();
  };

  return (
    <button 
      onClick={handleClick}
      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium 
                 text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300
                 transition-colors whitespace-nowrap flex items-center gap-1.5"
    >
      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">Log Out</span>
      <span className="sm:hidden">Out</span>
    </button>
  );
};

export default LogOutButton;