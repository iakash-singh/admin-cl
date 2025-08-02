import React from 'react';
import { Users, Store, Package, DollarSign, TrendingUp, Calendar, Star, MapPin } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { mockAnalytics } from '../../data/mockData';

export default function Overview() {
  const { users, vendors, orders } = mockAnalytics;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          color="green"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          color="yellow"
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Orders</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{orders.activeOrders}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Orders</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{orders.pendingOrders}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Disputed Orders</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{orders.disputedOrders}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed Orders</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{orders.completedOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Engagement Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-sm font-medium text-emerald-600">{users.conversionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cart Abandonment</span>
              <span className="text-sm font-medium text-red-600">{users.cartAbandonmentRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">User Retention</span>
              <span className="text-sm font-medium text-blue-600">{users.retentionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Inventory Efficiency</span>
              <span className="text-sm font-medium text-purple-600">{vendors.inventoryEfficiency}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New vendor registration</p>
              <p className="text-xs text-gray-500">Party Equipment Central submitted documents</p>
            </div>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Order completed</p>
              <p className="text-xs text-gray-500">Professional Camera Kit rental finished</p>
            </div>
            <span className="text-xs text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-amber-50 rounded-lg">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Payment pending</p>
              <p className="text-xs text-gray-500">DJ Sound System order awaiting payment</p>
            </div>
            <span className="text-xs text-gray-500">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}