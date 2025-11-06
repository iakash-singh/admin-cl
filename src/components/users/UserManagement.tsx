import React, { useState, useMemo, useEffect } from 'react';
import { User, UserPlus, Calendar, Shield } from 'lucide-react';
import DataTable from '../shared/DataTable';
import StatCard from '../shared/StatCard';
import { mockUsers, mockAnalytics } from '../../data/mockData';
import { User as UserType } from '../../types';

// A custom hook to detect screen size. Place this in a separate file, e.g., /hooks/useMediaQuery.js
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const { users } = mockAnalytics;

  // Check if the current screen is mobile-sized
  const isMobile = useMediaQuery('(max-width: 768px)');

  // RESTORED: Your original stats card data is all here.
  const stats = useMemo(
    () => [
      { title: 'Total Users', value: users.totalUsers.toLocaleString(), change: users.userGrowthRate, changeType: 'increase', icon: User, color: 'blue' },
      { title: 'New Users Today', value: users.newUsersToday, icon: UserPlus, color: 'green' },
      { title: 'Conversion Rate', value: `${users.conversionRate}%`, change: 2.1, changeType: 'increase', icon: Shield, color: 'purple' },
      { title: 'Retention Rate', value: `${users.retentionRate}%`, change: 1.5, changeType: 'increase', icon: Calendar, color: 'green' },
    ],
    [users]
  );

  const userColumns = useMemo(() => {
    // Columns for Mobile View
    if (isMobile) {
      return [
        {
          key: 'avatar',
          label: 'User',
          render: (_: string, row: UserType) => (
            <div className="flex items-center gap-3">
              {row.avatar ? (
                <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{row.name}</p>
                <p className="text-xs text-gray-500 truncate">{row.email}</p>
              </div>
            </div>
          ),
        },
        {
          key: 'status',
          label: 'Status',
          render: (value: string) => (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full capitalize ${
              value === 'active' ? 'bg-green-100 text-green-800' :
              value === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {value}
            </span>
          ),
        },
      ];
    }

    // Columns for Desktop View
    return [
      {
        key: 'avatar',
        label: 'Avatar',
        render: (value: string, row: UserType) => (
          <div className="flex items-center">
            {value ? (
              <img src={value} alt={row.name} className="w-10 h-10 rounded-full object-cover" />
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
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
            value === 'admin' ? 'bg-purple-100 text-purple-800' :
            value === 'vendor' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {value}
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (value: string) => (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
            value === 'active' ? 'bg-green-100 text-green-800' :
            value === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {value}
          </span>
        ),
      },
      { key: 'totalRentals', label: 'Rentals', sortable: true, className: 'text-center' },
      { key: 'totalSpent', label: 'Total Spent', sortable: true, render: (value: number) => `$${value.toLocaleString()}` },
      { key: 'registrationDate', label: 'Joined', sortable: true, render: (value: string) => new Date(value).toLocaleDateString() },
    ];
  }, [isMobile]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 lg:p-8">
      {/* Stats Cards - Your original, perfectly responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            color={stat.color}
            small={false}
          />
        ))}
      </div>

      {/* User Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User Growth */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 sm:p-6 w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">User Growth</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>This Week</span>
              <span className="font-medium text-gray-900">{users.newUsersThisWeek}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Growth Rate</span>
              <span className="font-medium text-emerald-600">+{users.userGrowthRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${users.userGrowthRate}%` }} />
            </div>
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 sm:p-6 w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">User Engagement</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Active Users</span>
              <span className="font-medium text-emerald-600">89.2%</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Cart Abandonment</span>
              <span className="font-medium text-red-600">{users.cartAbandonmentRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '89%' }} />
            </div>
          </div>
        </div>

        {/* Recent Signups */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 sm:p-6 w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Signups</h3>
          <div className="space-y-3">
            {mockUsers.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center space-x-3 min-w-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{new Date(user.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
        <DataTable
          data={mockUsers}
          columns={userColumns}
          onRowClick={(user) => setSelectedUser(user)}
        />
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* ... (modal code is unchanged and already responsive) ... */}
        </div>
      )}
    </div>
  );
}