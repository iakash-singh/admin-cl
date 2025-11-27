import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  UserPlus,
  Calendar,
  Shield,
  X,
} from "lucide-react";
import DataTable from "../shared/DataTable";
import StatCard from "../shared/StatCard";
import { mockUsers, mockAnalytics } from "../../data/mockData";
import { User as UserType } from "../../types";
import { createPortal } from "react-dom";

// Desktop-focused responsive hook (for smooth resizing on large screens)
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [query]);
  return matches;
};

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const { users } = mockAnalytics;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const isMedium = useMediaQuery("(max-width: 1200px)");

  // === Stats Cards ===
  const stats = useMemo(
    () => [
      {
        title: "Total Users",
        value: users.totalUsers.toLocaleString(),
        change: users.userGrowthRate,
        changeType: "increase",
        icon: User,
        color: "blue",
      },
      {
        title: "New Users Today",
        value: users.newUsersToday,
        icon: UserPlus,
        color: "green",
      },
      {
        title: "Conversion Rate",
        value: `${users.conversionRate}%`,
        change: 2.1,
        changeType: "increase",
        icon: Shield,
        color: "purple",
      },
      {
        title: "Retention Rate",
        value: `${users.retentionRate}%`,
        change: 1.5,
        changeType: "increase",
        icon: Calendar,
        color: "emerald",
      },
    ],
    [users]
  );

  // === Columns (Desktop-first)
  const userColumns = useMemo(() => {
    return [
      {
        key: "avatar",
        label: "User",
        render: (value: string, row: UserType) => (
          <div className="flex items-center gap-3">
            {value ? (
              <img
                src={value}
                alt={row.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{row.name}</p>
              <p className="text-xs text-gray-500">{row.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "userType",
        label: "Type",
        render: (value: string) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
              value === "admin"
                ? "bg-purple-100 text-purple-800"
                : value === "vendor"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (value: string) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
              value === "active"
                ? "bg-green-100 text-green-800"
                : value === "inactive"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        ),
      },
      { key: "totalRentals", label: "Rentals", sortable: true },
      {
        key: "totalSpent",
        label: "Total Spent",
        sortable: true,
        render: (value: number) => `$${value.toLocaleString()}`,
      },
      {
        key: "registrationDate",
        label: "Joined",
        render: (value: string) => new Date(value).toLocaleDateString(),
      },
    ];
  }, []);

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
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        {/* === Analytics Section === */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              User Growth
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">This Week</span>
                <span className="font-medium text-gray-900">
                  {users.newUsersThisWeek}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Growth Rate</span>
                <span className="font-medium text-emerald-600">
                  +{users.userGrowthRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${users.userGrowthRate}%` }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Engagement
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active Users</span>
                <span className="font-medium text-emerald-600">89.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cart Abandonment</span>
                <span className="font-medium text-red-600">
                  {users.cartAbandonmentRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: "89%" }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Recent Signups
            </h3>
            <div className="space-y-4">
              {mockUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* === Data Table === */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-x-auto"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Registered Users
          </h3>
          <DataTable
            data={mockUsers}
            columns={userColumns}
            onRowClick={(user) => setSelectedUser(user)}
          />
        </motion.div>

        {/* === Modal === */}
        {selectedUser &&
          createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    User Details
                  </h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {selectedUser.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        User Type
                      </label>
                      <p className="text-sm text-gray-900 capitalize">
                        {selectedUser.userType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Joined
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          selectedUser.registrationDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Total Spent
                      </label>
                      <p className="text-sm text-gray-900">
                        ${selectedUser.totalSpent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Location
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedUser.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      Message
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                      View Orders
                    </button>
                    <button className="px-4 py-2 text-red-600 border border-red-200 text-sm rounded-lg hover:bg-red-50">
                      Suspend
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
      </motion.div>
    </main>
  );
}
