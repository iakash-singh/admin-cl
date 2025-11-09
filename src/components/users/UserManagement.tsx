import React, { useState, useMemo, useEffect } from 'react';
import {
  User,
  UserPlus,
  Calendar,
  Shield,
  X,
} from 'lucide-react';
import DataTable from '../shared/DataTable';
import StatCard from '../shared/StatCard';
import { mockUsers, mockAnalytics } from '../../data/mockData';
import { User as UserType } from '../../types';
import { createPortal } from 'react-dom';

// --- Custom Hook for Responsive Screen Detection ---
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const { users } = mockAnalytics;
  const isMobile = useMediaQuery('(max-width: 768px)');

  // --- Stats Cards ---
  const stats = useMemo(
    () => [
      {
        title: 'Total Users',
        value: users.totalUsers.toLocaleString(),
        change: users.userGrowthRate,
        changeType: 'increase',
        icon: User,
        color: 'blue',
      },
      {
        title: 'New Users Today',
        value: users.newUsersToday,
        icon: UserPlus,
        color: 'green',
      },
      {
        title: 'Conversion Rate',
        value: `${users.conversionRate}%`,
        change: 2.1,
        changeType: 'increase',
        icon: Shield,
        color: 'purple',
      },
      {
        title: 'Retention Rate',
        value: `${users.retentionRate}%`,
        change: 1.5,
        changeType: 'increase',
        icon: Calendar,
        color: 'green',
      },
    ],
    [users]
  );

  // --- Table Columns ---
  const userColumns = useMemo(() => {
    if (isMobile) {
      return [
        {
          key: 'avatar',
          label: 'User',
          render: (_: string, row: UserType) => (
            <div className="flex items-center gap-3">
              {row.avatar ? (
                <img
                  src={row.avatar}
                  alt={row.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {row.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{row.email}</p>
              </div>
            </div>
          ),
        },
        {
          key: 'status',
          label: 'Status',
          render: (value: string) => (
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                value === 'active'
                  ? 'bg-green-100 text-green-800'
                  : value === 'inactive'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {value}
            </span>
          ),
        },
      ];
    }

    // Desktop Columns
    return [
      {
        key: 'avatar',
        label: 'Avatar',
        render: (value: string, row: UserType) => (
          <div className="flex items-center">
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
          </div>
        ),
      },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      {
        key: 'userType',
        label: 'Type',
        render: (value: string) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
              value === 'admin'
                ? 'bg-purple-100 text-purple-800'
                : value === 'vendor'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (value: string) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
              value === 'active'
                ? 'bg-green-100 text-green-800'
                : value === 'inactive'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        key: 'totalRentals',
        label: 'Rentals',
        sortable: true,
      },
      {
        key: 'totalSpent',
        label: 'Total Spent',
        sortable: true,
        render: (value: number) => `$${value.toLocaleString()}`,
      },
      {
        key: 'registrationDate',
        label: 'Joined',
        sortable: true,
        render: (value: string) => new Date(value).toLocaleDateString(),
      },
    ];
  }, [isMobile]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8">
      {/* === Stats Cards === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* === Overview Cards === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User Growth */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">User Growth</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>This Week</span>
              <span className="font-medium text-gray-900">
                {users.newUsersThisWeek}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Growth Rate</span>
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
        </div>

        {/* Engagement */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">User Engagement</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Active Users</span>
              <span className="font-medium text-emerald-600">89.2%</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Cart Abandonment</span>
              <span className="font-medium text-red-600">
                {users.cartAbandonmentRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: '89%' }}
              />
            </div>
          </div>
        </div>

        {/* Recent Signups */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Signups</h3>
          <div className="space-y-3">
            {mockUsers.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-3 min-w-0"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === Users Table === */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
        <DataTable
          data={mockUsers}
          columns={userColumns}
          onRowClick={(user) => setSelectedUser(user)}
        />
      </div>

      {/* === User Details Modal === */}
      {selectedUser &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  User Details
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
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
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                        selectedUser.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : selectedUser.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedUser.status.charAt(0).toUpperCase() +
                        selectedUser.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
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
                        Registration Date
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          selectedUser.registrationDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Last Active
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedUser.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Total Rentals
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedUser.totalRentals}
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
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Send Message
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                    View Orders
                  </button>
                  <button className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                    Suspend
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
