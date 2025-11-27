import React from "react";
import {
  Users,
  Store,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Star,
} from "lucide-react";
import StatCard from "../shared/StatCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { mockAnalytics } from "../../data/mockData";

export default function Overview() {
  const { users, vendors, orders } = mockAnalytics;

  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 14500 },
    { month: "Mar", revenue: 16200 },
    { month: "Apr", revenue: 19800 },
    { month: "May", revenue: 22400 },
    { month: "Jun", revenue: 24500 },
  ];

  const activityColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <main className="ml-64 min-h-screen bg-gray-50 px-8 xl:px-10 py-10 transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        {/* === Top Stats === */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={users.totalUsers.toLocaleString()}
            change={users.userGrowthRate}
            changeType="increase"
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Active Vendors"
            value={vendors.totalVendors}
            change={5.2}
            changeType="increase"
            icon={Store}
            color="green"
          />
          <StatCard
            title="Total Orders"
            value={orders.totalOrders.toLocaleString()}
            change={8.1}
            changeType="increase"
            icon={Package}
            color="purple"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${orders.revenueThisMonth.toLocaleString()}`}
            change={12.3}
            changeType="increase"
            icon={DollarSign}
            color="emerald"
          />
        </div>

        {/* === Revenue Trend === */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* === Secondary Stats === */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="New Users Today"
            value={users.newUsersToday}
            icon={Calendar}
            color="blue"
          />
          <StatCard
            title="Conversion Rate"
            value={`${users.conversionRate}%`}
            change={2.1}
            changeType="increase"
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Pending Approvals"
            value={vendors.pendingApproval}
            icon={Star}
            color="amber"
          />
        </div>

        {/* === Performance & Engagement === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              Order Status Overview
            </h3>
            <div className="space-y-5">
              {[
                { label: "Active Orders", color: "bg-blue-600", value: 68, count: orders.activeOrders },
                { label: "Pending Orders", color: "bg-amber-500", value: 32, count: orders.pendingOrders },
                { label: "Disputed Orders", color: "bg-red-500", value: 8, count: orders.disputedOrders },
                { label: "Completed Orders", color: "bg-emerald-500", value: 89, count: orders.completedOrders },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <div className="flex items-center">
                    <div className="w-40 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${stat.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* User Engagement */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-5">
              User Engagement
            </h3>
            <div className="space-y-4">
              {[
                { label: "Conversion Rate", value: `${users.conversionRate}%`, color: "text-green-600" },
                { label: "Cart Abandonment", value: `${users.cartAbandonmentRate}%`, color: "text-red-600" },
                { label: "User Retention", value: `${users.retentionRate}%`, color: "text-blue-600" },
                { label: "Inventory Efficiency", value: `${vendors.inventoryEfficiency}%`, color: "text-purple-600" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* === Recent Activity === */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { title: "New vendor registration", detail: "Party Equipment Central submitted documents", color: "blue", time: "2 hours ago" },
              { title: "Order completed", detail: "Professional Camera Kit rental finished", color: "green", time: "4 hours ago" },
              { title: "Payment pending", detail: "DJ Sound System order awaiting payment", color: "amber", time: "6 hours ago" },
            ].map((activity, idx) => {
              const colorClass = activityColors[activity.color] || "";
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-4 p-3 rounded-lg border ${colorClass}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.color === "blue"
                        ? "bg-blue-500"
                        : activity.color === "green"
                        ? "bg-green-500"
                        : "bg-amber-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
