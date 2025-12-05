import { Bell, Search, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../SupabaseClient/supabaseClient"; // adjust path if folder name different

interface HeaderProps {
  activeSection: string;
}

export default function Header({ activeSection }: HeaderProps) {
  const navigate = useNavigate();

  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard Overview",
      users: "User Management",
      vendors: "Vendor Management",
      orders: "Order Management",
      feedback: "Feedback Management",
      analytics: "Analytics Dashboard",
      locations: "Location Insights",
      admin: "Administrative Features",
      reports: "Reports & Documentation",
      settings: "System Settings",
    };
    return titles[section] || "Dashboard";
  };

  const handleLogout = async () => {
    try {
      // sign out from supabase
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error logging out", err);
    }

    // clear local storage user
    localStorage.removeItem("user");

    // go to login page
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {getSectionTitle(activeSection)}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your rental platform with comprehensive administrative tools
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Super Administrator</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
