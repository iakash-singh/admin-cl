import React from "react";
import { Bell, User, ChevronDown, Menu, LogOut, Search } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { motion } from "framer-motion";

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
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-10 py-4 sticky top-0 z-40 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Left Section (Logo / Menu Button) */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuToggle}
            className="hidden xl:flex p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xl font-semibold tracking-tight text-gray-800 select-none"
          >
            RentAdmin Panel
          </motion.h1>
        </div>

        {/* Center Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2 w-[22rem] border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-5"
        >
          {/* Notification Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="relative p-2 text-gray-500 hover:text-gray-700 transition"
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </motion.button>

          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-xl transition-all">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500 -mt-0.5">Super Administrator</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </motion.div>
      </div>
    </header>
  );
}
