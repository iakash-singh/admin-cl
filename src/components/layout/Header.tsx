import React from "react";
import { Bell, User, ChevronDown, Menu } from "lucide-react"; // REMOVED: Search icon

interface HeaderProps {
  // REMOVED: activeSection prop is no longer needed
  onMenuToggle?: () => void;
}

// REMOVED: The getSectionTitle function is no longer needed
export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* REMOVED: Section Title and Subtitle used to be here */}
          {/* We can add a company logo here later if you want */}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* REMOVED: Search Box used to be here */}

          {/* Notification Button */}
          <button
            className="relative p-2 text-gray-500 hover:text-gray-700 transition"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                Admin User
              </p>
              <p className="text-xs text-gray-500 -mt-0.5">
                Super Administrator
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}