import React from "react";
import { Bell, User, ChevronDown, Menu, LogOut, Search } from "lucide-react";
import { supabase } from "../../supabaseClient";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  // Logout function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect to login page
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Center Search (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notification Button */}
          <button
            className="relative p-2 text-gray-500 hover:text-gray-700 transition"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                Admin User
              </p>
              <p className="text-xs text-gray-500 -mt-0.5">
                Super Administrator
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition ml-3"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:inline text-sm font-medium">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
