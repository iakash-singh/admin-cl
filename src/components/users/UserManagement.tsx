import { useState, useEffect } from 'react';

import { supabase } from "../../services/supabaseClient.ts";
import { User, UserPlus, Calendar, Shield, X } from 'lucide-react';

import DataTable from '../shared/DataTable';
import StatCard from '../shared/StatCard';
import { mockAnalytics } from '../../data/mockData';
import { User as UserType } from '../../types';
import { createPortal } from 'react-dom';

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [newUsersToday, setNewUsersToday] = useState<number | null>(null);
  const [growth, setGrowth] = useState({
    newUsersThisWeek: 0,
    userGrowthRate: "0%",
    usersLastWeek: 0,
  });
  const [engagement, setEngagement] = useState({
    cartAbandonmentRate: "0%",
    activeUserRate: "0%",
  }); 
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Functions to fetch data
  const fetchTotalUsers = async () => {
    const {count} = await supabase
      .from('Users')
      .select('*', { count: 'exact', head: true });
    setTotalUsers(count);
  }

  const fetchNewUsersToday = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const {count} = await supabase
      .from('Users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());
    setNewUsersToday(count);
  };

  const fetchGrowth = async () => {
    const today = new Date();

    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setMilliseconds(-1);

    const { count: thisWeek } = await supabase
      .from("Users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfThisWeek.toISOString());

    const { count: lastWeek } = await supabase
      .from("Users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastWeek.toISOString())
      .lte("created_at", endOfLastWeek.toISOString());

    const growthRate =
      lastWeek && lastWeek > 0
        ? (((thisWeek ?? 0) - lastWeek) / lastWeek) * 100
        : 0;

    setGrowth({
      newUsersThisWeek: thisWeek ?? 0,
      usersLastWeek: lastWeek ?? 0,
      userGrowthRate: `${growthRate.toFixed(2)}%`,
    });
  };

  const fetchEngagement = async () => {
    const { count: totalUsers } = await supabase
      .from("Users")
      .select("*", { count: "exact", head: true });

    // Active users (last 30 days orders)
    const last30 = new Date();
    last30.setDate(last30.getDate() - 30);

    const { data: activeOrders } = await supabase
      .from("orders")
      .select("user_id")
      .gte("created_at", last30.toISOString());

    const activeUserSet = new Set(activeOrders?.map((o) => o.user_id));
    const activeUserRate =
      totalUsers && totalUsers > 0
        ? ((activeUserSet.size / totalUsers) * 100).toFixed(2)
        : "0";

    // Cart abandonment (pending orders)
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const cartRate =
      totalOrders && totalOrders > 0
        ? ((pendingOrders! / totalOrders) * 100).toFixed(2)
        : "0";

    setEngagement({
      activeUserRate: `${activeUserRate}%`,
      cartAbandonmentRate: `${cartRate}%`,
    });
  };

  const fetchAllUsers = async () => {
    const { data} = await supabase
      .from('Users')
      .select(`id,
        name,
        email,
        role,
        created_at,
        status,
        users_info (
          avatar,
          rentals,
          total_spend
        )`);
      const formatted = (data ?? []).map((u)=>{
        let info: any = {}

        if(Array.isArray(u.users_info)){
          info = u.users_info[0] ?? {};
        }else if(u.users_info){
          info = u.users_info;
        }
        return{
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          created_at: u.created_at,
          status: u.status,
          avatar: info.avatar ?? null,
          rentals: info?.rentals ?? 0,
          total_spend: info?.total_spend ?? 0,
        }
          
      })
      setAllUsers(formatted);
  }

  const fetchUserDetails = async(userId: number)=>{
    const { data, error } = await supabase
      .from('Users')
      .select(`id,
        name,
        email,
        role,
        created_at,
        status,
        users_info (
          avatar,
          rentals,
          total_spend,
          location
        )`)
      .eq('id', userId)
      .single();
      if (error || !data) {
      console.error("Failed to load user details:", error);
      return;
  }
    
      const info = Array.isArray(data.users_info) ? data.users_info[0] : data.users_info ?? {};

      setSelectedUser({
        id: data.id,
        name: data.name,
        email: data.email,
        userType: data.role,
        registrationDate: data.created_at,
        status: data.status,
        avatar: info.avatar ?? null,
        totalRentals: info.rentals ?? 0,
        totalSpent: info.total_spend ?? 0,
        location: info.location ?? "-",
        lastActive: data.created_at,
      });
  }

  const { users } = mockAnalytics;

  useEffect(() => {
    fetchTotalUsers();
    fetchNewUsersToday();
    fetchGrowth();
    fetchEngagement();
    fetchAllUsers();
  },[])
  
  const userColumns = [
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
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'role',
      label: 'Type',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${value === 'admin' ? 'bg-purple-100 text-purple-800' :
            value === 'vendor' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
          }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${value === 'active' ? 'bg-green-100 text-green-800' :
            value === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
          }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'rentals',
      label: 'Rentals',
      sortable: true
    },
    {
      key: 'total_spend',
      label: 'Total Spent',
      sortable: true,
      render: (value: number | null | undefined) => `$${(value??0).toLocaleString()}`
    },
    {
      key: 'created_at',
      label: 'Joined',
      sortable: true,
      render: (value: string| null) => value ? new Date(value).toLocaleDateString() : "-"
    }
  ];

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers ?? "Loading..."}
          change={users.userGrowthRate}
          changeType="increase"
          icon={User}
          color="blue"
        />
        <StatCard
          title="New Users Today"
          value={newUsersToday ?? "Loading..."}
          icon={UserPlus}
          color="green"
        />
        <StatCard
          title="Conversion Rate"
          value={`${users.conversionRate}%`}
          change={2.1}
          changeType="increase"
          icon={Shield}
          color="purple"
        />
        <StatCard
          title="Retention Rate"
          value={`${users.retentionRate}%`}
          change={1.5}
          changeType="increase"
          icon={Calendar}
          color="green"
        />
      </div>

      {/* User Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-sm font-medium text-gray-900">{growth.newUsersThisWeek}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Week</span>
              <span className="text-sm font-medium text-gray-900">{growth.usersLastWeek}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Growth Rate</span>
              <span className="text-sm font-medium text-emerald-600">+{growth.userGrowthRate}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${growth.userGrowthRate}` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-emerald-600">{engagement.activeUserRate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cart Abandonment</span>
              <span className="text-sm font-medium text-red-600">{engagement.cartAbandonmentRate}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(engagement.activeUserRate)}` }}></div>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Signups</h3>
          <div className="space-y-3">
            {allUsers.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Users Table */}
      <DataTable
        data={Array.isArray(allUsers)? allUsers : []}
        columns={userColumns}
        onRowClick={(u)=>fetchUserDetails(u.id)}
      />

      {/* User Detail Modal */}
      {selectedUser && createPortal(
        (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X />
                  </button>
                </div>
              </div>


              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  {/* {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-16 h-16 rounded-full" />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                  )} */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h4>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${selectedUser.status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedUser.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">User Type</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedUser.userType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Registration Date</label>
                      <p className="text-sm text-gray-900">{new Date(selectedUser.registrationDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Active</label>
                      <p className="text-sm text-gray-900">{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Rentals</label>
                      <p className="text-sm text-gray-900">{selectedUser.totalRentals}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Spent</label>
                      <p className="text-sm text-gray-900">${selectedUser.totalSpent.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-sm text-gray-900">{selectedUser.location}</p>
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
          </div>
        ), document.body
      )}
    </div>
  );
}