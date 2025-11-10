import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Settings,
  FileText,
  Download,
  Upload,
  UserCheck,
  UserX,
  AlertTriangle,
} from "lucide-react";
import StatCard from "../shared/StatCard";

export default function AdminFeatures() {
  const [activeTab, setActiveTab] = useState("permissions");

  const adminTabs = [
    { id: "permissions", name: "User Permissions", icon: Shield },
    { id: "system", name: "System Settings", icon: Settings },
    { id: "content", name: "Content Moderation", icon: AlertTriangle },
    { id: "bulk", name: "Bulk Operations", icon: Upload },
    { id: "audit", name: "Audit Logs", icon: FileText },
  ];

  // === PERMISSIONS TAB ===
  const renderPermissionsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Admin Users" value={12} icon={UserCheck} color="green" />
        <StatCard title="Suspended Accounts" value={8} icon={UserX} color="red" />
        <StatCard title="Pending Reviews" value={23} icon={AlertTriangle} color="yellow" />
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Role-Based Access Control
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Roles */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Admin Roles</h4>
            <div className="space-y-3">
              {[
                {
                  name: "Super Administrator",
                  desc: "Full system access",
                  color: "text-green-600",
                  count: 3,
                },
                {
                  name: "Content Moderator",
                  desc: "Review and moderate content",
                  color: "text-blue-600",
                  count: 5,
                },
                {
                  name: "Support Agent",
                  desc: "Customer support access",
                  color: "text-purple-600",
                  count: 8,
                },
              ].map((role) => (
                <div
                  key={role.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {role.name}
                    </p>
                    <p className="text-xs text-gray-500">{role.desc}</p>
                  </div>
                  <span className={`text-sm font-medium ${role.color}`}>
                    {role.count} users
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Permission Updates */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Recent Permission Changes
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Admin role granted
                  </p>
                  <p className="text-xs text-gray-500">
                    John Smith - Content Moderator
                  </p>
                </div>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <UserX className="h-5 w-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Account suspended
                  </p>
                  <p className="text-xs text-gray-500">User violation policy</p>
                </div>
                <span className="text-xs text-gray-500">4h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Permissions updated
                  </p>
                  <p className="text-xs text-gray-500">
                    Support agent role modified
                  </p>
                </div>
                <span className="text-xs text-gray-500">6h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // === SYSTEM TAB ===
  const renderSystemTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          System Configuration
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Platform Settings</h4>
            {[
              {
                label: "Maintenance Mode",
                desc: "Put platform in maintenance mode",
              },
              {
                label: "Auto-approve Vendors",
                desc: "Automatically approve new vendors",
              },
              {
                label: "Email Notifications",
                desc: "Send admin email notifications",
                checked: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:h-5 after:w-5 after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Right */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Configuration Values</h4>
            {[
              { label: "Commission Rate (%)", defaultValue: 15 },
              { label: "Max Upload Size (MB)", defaultValue: 10 },
              { label: "Session Timeout (minutes)", defaultValue: 30 },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue={field.defaultValue}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // === CONTENT TAB ===
  const renderContentTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Content Moderation Tools
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Automated Filters */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Automated Filters</h4>
            {[
              {
                name: "Profanity Filter",
                status: "Active",
                color: "green",
                desc: "Automatically flags inappropriate language",
              },
              {
                name: "Spam Detection",
                status: "Active",
                color: "green",
                desc: "Detects and filters spam content",
              },
              {
                name: "Image Recognition",
                status: "Beta",
                color: "yellow",
                desc: "AI-powered inappropriate image detection",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full bg-${item.color}-100 text-${item.color}-800`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Moderation Queue */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Moderation Queue</h4>
            {[
              {
                priority: "High Priority",
                color: "red",
                count: 15,
                text: "require immediate attention",
              },
              {
                priority: "Medium Priority",
                color: "yellow",
                count: 47,
                text: "pending review",
              },
              {
                priority: "Auto-approved",
                color: "blue",
                count: 203,
                text: "passed automated checks",
              },
            ].map((item) => (
              <div
                key={item.priority}
                className={`p-3 bg-${item.color}-50 border border-${item.color}-200 rounded-lg`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle
                    className={`h-4 w-4 text-${item.color}-600`}
                  />
                  <p className={`text-sm font-medium text-${item.color}-900`}>
                    {item.priority}
                  </p>
                </div>
                <p className={`text-xs text-${item.color}-700`}>
                  {item.count} items {item.text}
                </p>
                <button
                  className={`mt-2 text-xs bg-${item.color}-600 text-white px-3 py-1 rounded hover:bg-${item.color}-700`}
                >
                  {item.color === "red" ? "Review Now" : "View"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // === BULK OPERATIONS ===
  const renderBulkTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Bulk Operations
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Import / Export */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Data Import/Export</h4>
            {["Import Users", "Import Products"].map((label) => (
              <div
                key={label}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center"
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mb-3">
                  Upload CSV file with data
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Choose File
                </button>
              </div>
            ))}
          </div>

          {/* Bulk Actions */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Bulk Actions</h4>
            {[
              {
                title: "User Management",
                actions: [
                  { label: "Activate Selected", color: "green" },
                  { label: "Suspend Selected", color: "red" },
                ],
              },
              {
                title: "Vendor Approval",
                actions: [
                  { label: "Approve All", color: "green" },
                  { label: "Reject All", color: "red" },
                ],
              },
              {
                title: "Email Notifications",
                actions: [
                  { label: "Send Newsletter", color: "blue" },
                  { label: "Send Updates", color: "purple" },
                ],
              },
            ].map((section) => (
              <div
                key={section.title}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {section.title}
                </p>
                <div className="flex space-x-2">
                  {section.actions.map((action) => (
                    <button
                      key={action.label}
                      className={`text-xs bg-${action.color}-600 text-white px-3 py-1 rounded hover:bg-${action.color}-700`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // === AUDIT TAB ===
  const renderAuditTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Audit Trail</h3>
        <div className="space-y-4">
          {[
            {
              text: "User account created",
              color: "blue",
              info: "Admin: John Smith | IP: 192.168.1.1",
              time: "2 minutes ago",
            },
            {
              text: "Vendor approved",
              color: "green",
              info: "Admin: Sarah Wilson | Vendor ID: V-1234",
              time: "15 minutes ago",
            },
            {
              text: "User suspended",
              color: "red",
              info: "Admin: Mike Johnson | Reason: Policy violation",
              time: "1 hour ago",
            },
            {
              text: "System settings updated",
              color: "yellow",
              info: "Admin: Super Admin | Changed: Commission rate",
              time: "3 hours ago",
            },
          ].map((entry) => (
            <div
              key={entry.text}
              className={`flex items-center space-x-4 p-3 bg-${entry.color}-50 rounded-lg`}
            >
              <div
                className={`w-2 h-2 bg-${entry.color}-500 rounded-full`}
              ></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {entry.text}
                </p>
                <p className="text-xs text-gray-500">{entry.info}</p>
              </div>
              <span className="text-xs text-gray-500">{entry.time}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
              <Download className="h-3 w-3 mr-1 inline" />
              Export Logs
            </button>
            <button className="text-xs bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700">
              Filter Logs
            </button>
          </div>
          <span className="text-xs text-gray-500">
            Showing latest 50 entries
          </span>
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "permissions":
        return renderPermissionsTab();
      case "system":
        return renderSystemTab();
      case "content":
        return renderContentTab();
      case "bulk":
        return renderBulkTab();
      case "audit":
        return renderAuditTab();
      default:
        return renderPermissionsTab();
    }
  };

  return (
    <main className="ml-64 min-h-screen bg-gray-50 py-10 px-8 xl:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1800px] mx-auto space-y-10"
      >
        {/* === Tab Navigation === */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap xl:flex-nowrap overflow-x-auto scrollbar-hide px-6">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } flex items-center whitespace-nowrap py-4 px-3 xl:px-5 border-b-2 font-medium text-sm transition`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* === Content === */}
          <div className="p-8">{renderTabContent()}</div>
        </div>
      </motion.div>
    </main>
  );
}
