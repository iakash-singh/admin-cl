type TopLocation = {
  city: string;
  userCount: number;
  revenue: number;
};
type TopVendorLocation = {
  location: string;
  vendorCount: number;
  userCount: number;
  
};
import { TrendingUp, Users, DollarSign, Package, MapPin, Calendar, Star, ShoppingCart } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { mockAnalytics } from '../../data/mockData';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function Analytics() {
  const {products } = mockAnalytics;
  const [userGrowth, setUserGrowth] = useState(0);
  const [usersLastWeek, setUsersLastWeek] = useState(0);
  const [usersThisWeek, setUsersThisWeek] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersToday, setNewUsersToday] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [averageRevenue, setAverageRevenue] = useState(0);
  const [topLocations, setTopLocations] = useState<TopLocation[]>([]);
  const [topVendorLocations, setTopVendorLocations] = useState<TopVendorLocation[]>([]);
    
  const fetchUserGrowth = async() =>{
    const today = new Date();
    const sevenDaysAgo = new Date();
    const fourteenDaysAgo = new Date();

    sevenDaysAgo.setDate(today.getDate() - 7);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    const { data: usersThisWeekData } = await supabase
    .from('users_info')
    .select('id')
    .gte('created_at', sevenDaysAgo.toISOString())

    const { data: usersLastWeekData } = await supabase
    .from('users_info')
    .select('id')
    .gte('created_at', fourteenDaysAgo.toISOString())
    .lt('created_at', sevenDaysAgo.toISOString())

    const usersThisWeekCount = usersThisWeekData?.length ?? 0;
    const usersLastWeekCount = usersLastWeekData?.length ?? 0;

    const growth = usersLastWeekCount === 0 ? usersThisWeekCount * 100 : ((usersThisWeekCount - usersLastWeekCount) / usersLastWeekCount) * 100;

    setUsersThisWeek(usersThisWeekCount);
    setUsersLastWeek(usersLastWeekCount);
    setUserGrowth(Number(growth.toFixed(1)));
  }

  const fetchTotalUsers = async() =>{
    const {count} = await supabase
    .from('users_info')
    .select('*', { count: 'exact', head: true });
    setTotalUsers(count ?? 0);
  }

  const fetchNewUsersToday = async() =>{
    const today = new Date();
    today.setHours(0,0,0,0);
    const { data } = await supabase
    .from('users_info')
    .select('id')
    .gte('created_at', today.toISOString())
    setNewUsersToday(data?.length ?? 0);
  }

  const fetchConversionRate = async() =>{
    const { count: orders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

    const { count: users } = await supabase
    .from('users_info')
    .select('*', { count: 'exact', head: true });

    if(!users || users === 0){
      setConversionRate(0);
  }
    setConversionRate(((orders ?? 0)/ (users ?? 1) * 100));
  } 

  const fetchVendorStats = async() =>{
    const { count } = await supabase
    .from('vendorsData')
    .select('*', { count: 'exact', head: true });
    setTotalVendors(count ?? 0);
  }

  const fetchAverageVendorRevenue = async() =>{
    const { data } = await supabase
    .from('vendorsData')
    .select('revenue');
    const totalRevenue = data?.reduce((sum, vendor) => sum + (vendor.revenue || 0), 0) ?? 0;
    const avgRevenue = data && data.length > 0 ? totalRevenue / data.length : 0;
    setAverageRevenue(Number(avgRevenue.toFixed(2)));
  }
  const fetchTopUserLocations = async() =>{
    const {data: users} = await supabase
    .from('users_info')
    .select('location')

    const {data: orders} = await supabase
    .from('orders_info')
    .select('location, amount')

    const map: Record<string, TopLocation> = {};
    
    users?.forEach((u) => {
      const loc = u.location?.trim()
      if(!loc) return;
      if(!map[loc]){
        map[loc] = { city: loc, userCount: 0, revenue: 0 };
      }
      map[loc].userCount += 1;
    })

    orders?.forEach((o) => {
      const loc = o.location?.trim()
      if(!loc) return;
      if(!map[loc]){
        map[loc] = { city: loc, userCount: 0, revenue: 0 };
      }
      map[loc].revenue += o.amount || 0;
    })

    setTopLocations(Object.values(map).sort((a,b) => b.revenue - a.revenue));

  }

  const fetchTopVendorLocations = async() =>{ 
    const {data: vendors} = await supabase
    .from('vendorsData')
    .select('location')

    const {data: users} = await supabase
    .from('users_info')
    .select('location')
    const map: Record<string, TopVendorLocation> = {};

    vendors?.forEach((v) => {
      const loc = v.location?.trim()
      if(!loc) return;
      if(!map[loc]){
        map[loc] = { location: loc, vendorCount: 0, userCount: 0 };
      }
      map[loc].vendorCount += 1;
    })

    users?.forEach((u) => {
      const loc = u.location?.trim()
      if(!loc) return;
      if(!map[loc]){
        map[loc] = { location: loc, vendorCount: 0, userCount: 0 };
      }
      map[loc].userCount += 1;
    })

    setTopVendorLocations(Object.values(map).sort((a,b) => b.vendorCount - a.vendorCount));
  }
  useEffect(() => {
    fetchUserGrowth();
    fetchTotalUsers();
    fetchNewUsersToday();
    fetchConversionRate();
    fetchVendorStats();
    fetchAverageVendorRevenue();
    fetchTopUserLocations();
    fetchTopVendorLocations();
   }, [])

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="User Growth Rate"
          value={`${userGrowth}%`}
          // change={users.userGrowthRate}
          changeType="increase"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          // change={2.1}
          changeType="increase"
          icon={ShoppingCart}
          color="blue"
        />
         <StatCard
          title="Average Revenue"
          value={`$${averageRevenue.toLocaleString()}`}
          // change={15.7}
          changeType="increase"
          icon={DollarSign}
          color="green"
        />
        {/*<StatCard
          title="Inventory Efficiency"
          value={`${vendors.inventoryEfficiency}%`}
          change={3.1}
          changeType="increase"
          icon={Package}
          color="purple"
        /> */}
      </div>

      {/* User Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Metrics</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="ml-2 text-sm font-medium text-gray-900">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">{totalUsers.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">+{userGrowth.toLocaleString()}% growth</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="ml-2 text-sm font-medium text-gray-900">New Today</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">{newUsersToday}</p>
                <p className="text-xs text-gray-500 mt-1">{usersThisWeek || 0 } this week</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-medium text-green-600">{conversionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${conversionRate.toFixed(1)}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cart Abandonment</span>
                {/* <span className="text-sm font-medium text-red-600">{users.cartAbandonmentRate}%</span> */}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                {/* <div className="bg-red-500 h-2 rounded-full" style={{ width: `${users.cartAbandonmentRate}%` }}></div> */}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retention Rate</span>
                {/* <span className="text-sm font-medium text-blue-600">{users.retentionRate}%</span> */}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                {/* <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${users.retentionRate}%` }}></div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Performance</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="ml-2 text-sm font-medium text-gray-900">Total Vendors</span>
                </div>
                <p className="text-2xl font-bold text-purple-600 mt-1">{totalVendors}</p>
                {/* <p className="text-xs text-gray-500 mt-1">{} pending</p> */}
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  <span className="ml-2 text-sm font-medium text-gray-900">Avg Revenue</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600 mt-1">${averageRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">per vendor</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Onboarding Drop-off</span>
                {/* <span className="text-sm font-medium text-red-600">{vendors.onboardingDropoff}%</span> */}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                {/* <div className="bg-red-500 h-2 rounded-full" style={{ width: `${vendors.onboardingDropoff}%` }}></div> */}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inventory Efficiency</span>
                {/* <span className="text-sm font-medium text-purple-600">{vendors.inventoryEfficiency}%</span> */}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                {/* <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${vendors.inventoryEfficiency}%` }}></div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Performance Analytics</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Most Rented Products */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Most Rented Products</h4>
            <div className="space-y-3">
              {products.mostRentedProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.totalRentals} rentals</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Wishlist, Low Rental */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">High Interest, Low Conversion</h4>
            <div className="space-y-3">
              {products.highWishlistProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.wishlistCount} wishlisted</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900">{product.totalRentals} rentals</p>
                    <p className="text-xs text-yellow-600">
                      {((product.totalRentals / product.wishlistCount) * 100).toFixed(1)}% conversion
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Least Performing */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Least Performing Products</h4>
            <div className="space-y-3">
              {products.leastPerformingProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">Last rented: {new Date(product.lastRented).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900">{product.totalRentals} rentals</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Insights</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Top User Locations</h4>
            <div className="space-y-3">
              {topLocations.slice(0, 5).map((location, index) => (
                <div key={location.city} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{location.city}</p>
                      <p className="text-xs text-gray-500">{location.userCount} users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* <p className="text-sm font-medium text-gray-900">{location.orderCount} orders</p> */}
                    <p className="text-xs text-gray-500">${location.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Vendor Distribution</h4>
            <div className="space-y-3">
              {topVendorLocations.slice(0, 5).map((location) => (
                <div key={location.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{location.location}</p>
                      <p className="text-xs text-gray-500">{location.vendorCount} vendors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {(location.userCount / location.vendorCount).toFixed(1)} users/vendor
                    </p>
                    <p className="text-xs text-gray-500">Market density</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}