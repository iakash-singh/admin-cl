import React from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  FileText,
  MapPin,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "users", name: "User Management", icon: Users },
  { id: "vendors", name: "Vendor Management", icon: Store },
  { id: "orders", name: "Order Management", icon: Package },
  { id: "feedback", name: "Feedback Management", icon: MessageSquare },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "locations", name: "Location Insights", icon: MapPin },
  { id: "admin", name: "Admin Features", icon: Shield },
  { id: "reports", name: "Reports", icon: FileText },
  { id: "settings", name: "Settings", icon: Settings },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col z-50">
      {/* === Logo & Brand Section === */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 px-6 py-5 border-b border-gray-100"
      >
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
          <LayoutDashboard className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">RentAdmin</h1>
          <p className="text-xs text-gray-500 -mt-0.5">Admin Dashboard</p>
        </div>
      </motion.div>

      {/* === Navigation Section === */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.3 }}
              >
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <span className="whitespace-nowrap">{item.name}</span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* === Bottom Logout Section === */}
      <div className="border-t border-gray-200 px-6 py-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = "/login"}
          className="flex items-center gap-2 w-full text-gray-600 hover:text-red-600 transition text-sm font-medium"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </motion.button>
      </div>
    </aside>
  );
}
