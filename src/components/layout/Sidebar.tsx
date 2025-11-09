import React, { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false); // For mobile drawer
  const [isExpanded, setIsExpanded] = useState(false); // For desktop hover

  return (
    <>
      {/* === Mobile Header === */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-gray-800">RentAdmin</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* === Mobile Overlay === */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[50] md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* === Sidebar === */}
      <aside
        className={`
          fixed md:static z-[70] top-0 left-0 h-full bg-white border-r border-gray-200 
          transform transition-all duration-300 ease-in-out
          md:hover:w-64 ${isExpanded ? "w-64" : "w-16"} md:w-16
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          shadow-lg md:shadow-none
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* === Logo Section === */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <div
            className={`transition-all duration-300 ease-out overflow-hidden ${
              isExpanded ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
            } hidden md:block`}
          >
            <h1 className="text-lg font-bold whitespace-nowrap">RentAdmin</h1>
            <p className="text-xs text-gray-600 whitespace-nowrap">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* === Navigation === */}
        <nav className="px-4 pb-20 md:pb-4 pt-16 md:pt-0 overflow-y-auto h-full">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 flex-shrink-0 ${
                        isActive ? "text-blue-700" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`ml-3 transition-all duration-300 ease-out overflow-hidden ${
                        isExpanded ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
                      } hidden md:inline`}
                    >
                      {item.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
