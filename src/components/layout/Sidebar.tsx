import { useState } from 'react';
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
  MapPin
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', name: 'User Management', icon: Users },
  { id: 'vendors', name: 'Vendor Management', icon: Store },
  { id: 'orders', name: 'Order Management', icon: Package },
  { id: 'feedback', name: 'Feedback Management', icon: MessageSquare },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'locations', name: 'Location Insights', icon: MapPin },
  { id: 'admin', name: 'Admin Features', icon: Shield },
  { id: 'reports', name: 'Reports', icon: FileText },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white text-gray-900 transition-all duration-300 ease-out z-50 ${isExpanded ? 'w-64' : 'w-16'
        } border-r border-gray-200`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div
            className={`ml-3 transition-all duration-300 ease-out overflow-hidden ${isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
              }`}
          >
            <h1 className="text-lg font-bold whitespace-nowrap">RentAdmin</h1>
            <p className="text-xs text-gray-600 whitespace-nowrap">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className='space-y-1' >
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-out group ${isActive
                    ? 'bg-blue-100 text-blue-800 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                  />
                  <span
                    className={`ml-3 transition-all duration-300 ease-out overflow-hidden whitespace-nowrap ${isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
                      }`}
                  >
                    {item.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}