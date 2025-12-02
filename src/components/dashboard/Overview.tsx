import { Users, Store, Package, DollarSign, Calendar } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { mockAnalytics } from '../../data/mockData';
import { supabase } from '../../services/supabaseClient.ts';
import { useEffect, useState } from 'react';

export default function Overview() {
  const { users, vendors } = mockAnalytics;

  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [NewUsersToday, setNewUsersToday] = useState<number | null>(null);
  const [totalVendors, setTotalVendors] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [revenueThisMonth, setRevenueThisMonth] = useState<number>(0);

  const [OrderStats, setOrderStats] = useState({
    activeOrders: 0,
    pendingOrders: 0,
    disputedOrders: 0,
    completedOrders: 0,
    totalOrders: 0,
  });

  
    const fetchTotalUsers = async () => {
    const {count} = await supabase
      .from('Users')
      .select('*', { count: 'exact', head: true });
    setTotalUsers(count);
  }

  const fetchNewUsersToday = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from('Users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());
    setNewUsersToday(count ?? 0);
  }

  const fetchTotalVendors = async () => {
    const { count, error } = await supabase
      .from('vendorsData')
      .select('*', { count: 'exact', head: true });
    if (error) {
      console.error('Error fetching total vendors:', error);
      return;
    }

    setTotalVendors(count ?? 0);
  };

  const fetchTotalOrders = async () => {
    const { count, error } = await supabase
      .from('orders_info')
      .select('*', { count: 'exact', head: true });
    if (error) {
      console.error('Error fetching total orders:', error);
      return;
    }
    setTotalOrders(count ?? 0);
  };
  const fetchOrderStatusStats = async () => {
    const { data, error } = await supabase
      .from('orders_info')
      .select('status');
      if (error || !data) return;

    const counts = data.reduce((acc, o) => {
      const s = (o.status || "").toLowerCase();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const total = data.length;
    setOrderStats({
      activeOrders: counts['active'] ?? 0,
      pendingOrders: counts['pending'] ?? 0,
      disputedOrders: counts['disputed'] ?? 0,
      completedOrders: counts['completed'] ?? 0,
      totalOrders: total,
    });
  }

  const fetchRevenueThisMonth = async () => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const {data} = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', start.toISOString());

    const sum = data?.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0;
    setRevenueThisMonth(sum);
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchNewUsersToday();
    fetchTotalVendors();
    fetchTotalOrders();
    fetchOrderStatusStats();
    fetchRevenueThisMonth();
  }, []);




  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers ?? "Loading.. "}
          change={users.userGrowthRate}
          changeType="increase"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Vendors"
          value={totalVendors ?? "Loading"}
          change={5.2}
          changeType="increase"
          icon={Store}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders ?? "Loading"}
          change={8.1}
          changeType="increase"
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Monthly Revenue"
          value={`${revenueThisMonth.toLocaleString()}`}
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
          value={NewUsersToday ?? "Loading"}
          icon={Calendar}

          color="blue"
        />
        {/* <StatCard
          title="Conversion Rate"
          value={`${users.conversionRate}%`}
          change={2.1}
          changeType="increase"
          icon={TrendingUp}
          color="green"
        /> */}
        
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
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(OrderStats.activeOrders / OrderStats.totalOrders)*100}` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{OrderStats.activeOrders}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Orders</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(OrderStats.pendingOrders / OrderStats.totalOrders)*100}` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{OrderStats.pendingOrders}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Disputed Orders</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(OrderStats.disputedOrders / OrderStats.totalOrders)*100}` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{OrderStats.disputedOrders}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed Orders</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(OrderStats.completedOrders / OrderStats.totalOrders)*100}` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{OrderStats.completedOrders}</span>
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