
import { useState, useEffect } from 'react';
import { MapPin, Users, Store, Package, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '../shared/StatCard';
import DataTable from '../shared/DataTable';

import { mockLocations } from '../../data/mockData';
import { Location } from '../../types';

import { supabase } from '../../services/supabaseClient';

type LocationStats = {
  city: string;
  userCount: number;
  vendorCount: number;
  orderCount: number;
  revenue: number;
  marketDensity: string;     // users/vendor
  averageOrderValue: string; // $value
};

export default function LocationInsights() {
  const [selectedLocation, setSelectedLocation] = useState<LocationStats | null>(null);
  const [locations, setLocations] = useState<LocationStats[]>([]);
  const [totalusers, setTotalusers] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [marketCoverage, setMarketCoverage] = useState(0);  
  
  const fetchAllLocations = async () => {

      const { data:users } = await supabase
        .from('users_info')
        .select('id, location');

      const { data:vendors } = await supabase
        .from('vendorsData')
        .select('vendors_id, location');

      const { data:orders } = await supabase
        .from('orders')
        .select('id, location, total_amount');

      const map: Record<string, LocationStats> = {};

      users?.forEach((u)=>{
        if(!u.location) return;
        const loc = u.location.trim();
        if(!map[loc])
          map[loc] = {city: loc, userCount:0, vendorCount:0, orderCount:0, revenue:0, marketDensity:'', averageOrderValue:''};
        map[loc].userCount +=1;
      })

      vendors?.forEach((v)=>{
        if(!v.location) return;
        const loc = v.location.trim();
        if(!map[loc])
          map[loc] = {city: loc, userCount:0, vendorCount:0, orderCount:0, revenue:0, marketDensity:'', averageOrderValue:''};
        map[loc].vendorCount +=1;
      })

      orders?.forEach((o)=>{
        if(!o.location) return;
        const loc = o.location.trim();
        if(!map[loc])
          map[loc] = {city: loc, userCount:0, vendorCount:0, orderCount:0, revenue:0, marketDensity:'', averageOrderValue:''};
        map[loc].orderCount +=1;
        map[loc].revenue += Number(o.total_amount);
      })

      const finalList = Object.values(map).map((loc)=>({
        city: loc.city,
        userCount: loc.userCount ?? 0,
        vendorCount: loc.vendorCount ?? 0,
        orderCount: loc.orderCount ?? 0,
        revenue: loc.revenue ?? 0,
        marketDensity:
          loc.vendorCount > 0
            ? `${(loc.userCount / loc.vendorCount).toFixed(1)} `
            : "N/A",
        averageOrderValue:
          loc.orderCount > 0
            ? `$${(loc.revenue / loc.orderCount).toFixed(0)}`
            : "$0",

      }))
      setLocations(finalList);
      
      const totalU = finalList.reduce((a:number, b:any)=> a + b.userCount, 0);
      const totalV = finalList.reduce((a:number, b:any)=> a + b.vendorCount, 0);
      const totalR = finalList.reduce((a:number, b:any)=> a + b.revenue, 0);
      const totalO = finalList.reduce((a:number, b:any)=> a + b.orderCount, 0);
      setTotalusers(totalU);
      setTotalVendors(totalV);
      setAvgOrderValue(totalO > 0 ? totalR / totalO : 0);
      setMarketCoverage(finalList.length);
      }
    



  const handleRowClick = async (loc: any) => {
    const city = loc.city;

    const { data:users } = await supabase
        .from('users_info')
        .select('id, location')
        .ilike('location', city);

      const { data:vendors } = await supabase
        .from('vendorsData')
        .select('vendors_id, location')
        .ilike('location', city);

      const { data:orders } = await supabase
        .from('orders')
        .select('location, total_amount')
        .ilike('location', city);
        
      const userCount = users?.length ?? 0;
      const vendorCount = vendors?.length ?? 0;
      const orderCount = orders?.length ?? 0;
      const revenue = orders?.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0) ?? 0;

      setSelectedLocation({
        city,
        userCount,
        vendorCount,
        orderCount,
        revenue,
        marketDensity: vendorCount > 0 ? `${(userCount / vendorCount).toFixed(1)}` + ' users/vendor' : 'N/A',
        averageOrderValue: orderCount > 0 ? '$' + (revenue / orderCount).toFixed(0) : 'N/A',
      });
    };  


  useEffect(() => {
    fetchAllLocations();
  }, []);

  // Calculate totals
  // const totalUsers = locations.reduce((sum, loc) => sum + (loc.userCount??0), 0);
  // const totalVendors = mockLocations.reduce((sum, loc) => sum + loc.vendorCount, 0);
  // const totalRevenue = locations.reduce((sum, loc) => sum + (loc.revenue??0), 0);
  // const averageOrderValue = mockLocations.reduce((sum, loc) => sum + (loc.revenue / loc.orderCount), 0) / mockLocations.length;

  const locationColumns = [
    {
      key: 'city',
      label: 'Location',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'userCount',
      label: 'Users',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 text-blue-500 mr-1" />
          {Number(value?? 0).toLocaleString()}
        </div>
      )
    },
    {
      key: 'vendorCount',
      label: 'Vendors',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <Store className="h-4 w-4 text-green-500 mr-1" />
          {Number(value?? 0)}
        </div>
      )
    },
    {
      key: 'orderCount',
      label: 'Orders',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <Package className="h-4 w-4 text-purple-500 mr-1" />
          {Number(value?? 0).toLocaleString()}
        </div>
      )
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-green-600 mr-1" />
          ${Number(value?? 0).toLocaleString()}
        </div>
      )
    },
    {
      key: 'marketDensity',
      label: 'Market Density',
      render: (value: string) => {

        return (
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
            {value} users/vendor
          </div>
        );
      }
    },
    {
      key: 'avgOrderValue',
      label: 'Avg Order Value',
      render: (value: string) => value

    }
  ];

  return (
    <div className="space-y-6">
      {/* Location Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Market Coverage"
          value={marketCoverage}
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="Total Active Users"
          value={totalusers.toLocaleString()}
          change={8.3}
          changeType="increase"
          icon={Users}
          color="green"
        />
        <StatCard
          title="Total Vendors"
          value={totalVendors.toLocaleString()}
          change={12.1}
          changeType="increase"
          icon={Store}
          color="purple"
        />
        <StatCard
          title="Average Order Value"
          value={`$${avgOrderValue.toPrecision(4)}`}
          change={5.7}
          changeType="increase"
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Market Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Markets by Revenue</h3>
          <div className="space-y-3">
            {top_Market_by_User_Spend
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((location, index) => (
                <div key={location.city} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{location.city}</p>
                    <p className="text-xs text-gray-500">{location.orderCount} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${location.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">
                      ${(location.revenue / location.orderCount).toFixed(0)} avg
                    </p>
                  </div>
                </div>
              ))}
          </div> */}
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Concentration</h3>
          <div className="space-y-3">
            {userVendor_Concentration_by_Location
              .sort((a, b) => b.userCount - a.userCount)
              .slice(0, 5)
              .map((location, index) => (
                <div key={location.location} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{location.location}</p>
                    <p className="text-xs text-gray-500">{location.vendorCount} vendors</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{location.userCount} users</p>
                    <p className="text-xs text-gray-500">
                      {((location.userCount / totalUsers) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div> */}

        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Opportunity</h3>
          <div className="space-y-3">
            {market_Opportunity
              .map(location => ({
                ...location,
                opportunity: location.userCount / (location.totalRevenue || 1)
              }))
              .sort((a, b) => b.opportunity - a.opportunity)
              .slice(0, 5)
              .map((location, index) => (
                <div key={location.location} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{location.location}</p>
                    <p className="text-xs text-gray-500">High demand market</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{location.opportunity.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">users/vendor</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div> */}

      {/* Geographic Distribution Chart */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Market Analysis</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Market Penetration</h4>
            <div className="space-y-3">
              {market_Penetration.map((location) => {
                const penetration = (location.userCount / totalUsers) * 100;
                return (
                  <div key={location.location} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{location.location}</span>
                      <span className="text-sm text-gray-500">{penetration.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(penetration, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Revenue Distribution</h4>
            <div className="space-y-3">
              {revenue_Distribution.map((location) => {
                const safeRevenue = locations.reduce((sum, loc) => sum + (loc.revenue??0), 0); // prevent division by zero
                const percentage = safeRevenue > 0
                  ? Math.min((location.totalRevenue / safeRevenue) * 100, 100)
                  : 0;
                return (
                  <div key={location.location} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{location.location}</span>
                      <span className="text-sm text-gray-500">${location.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div> */}

      {/* Location Data Table */}
      <DataTable
        data={locations}
        columns={locationColumns}
        onRowClick={handleRowClick}
      />

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedLocation.city}</h3>
                  <p className="text-sm text-gray-500 mt-1">Market Analysis & Insights</p>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="ml-2 text-sm font-medium text-gray-900">Users</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{selectedLocation.userCount}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Store className="h-5 w-5 text-green-600" />
                    <span className="ml-2 text-sm font-medium text-gray-900">Vendors</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-1">{selectedLocation.vendorCount}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span className="ml-2 text-sm font-medium text-gray-900">Orders</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{selectedLocation.orderCount}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                    <span className="ml-2 text-sm font-medium text-gray-900">Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">${selectedLocation.revenue}</p>
                </div>
              </div>

              {/* Market Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Market Metrics</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Market Density</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedLocation.vendorCount > 0 ? (selectedLocation.userCount / selectedLocation.vendorCount).toFixed(1): 0} users/vendor
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Order Value</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${selectedLocation.orderCount > 0 ?(selectedLocation.revenue / selectedLocation.orderCount).toFixed(0): 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Market Penetration</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedLocation.userCount > 0 ?((selectedLocation.orderCount / selectedLocation.userCount) * 100).toFixed(1):0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Revenue per User</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${selectedLocation.userCount > 0 ?(selectedLocation.revenue / selectedLocation.userCount).toFixed(0):0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Growth Opportunities</h5>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800">High User Demand</p>
                      <p className="text-xs text-green-600">
                        {(selectedLocation.userCount / selectedLocation.vendorCount).toFixed(1)} users per vendor indicates strong demand
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Revenue Potential</p>
                      <p className="text-xs text-blue-600">
                        ${(selectedLocation.revenue / selectedLocation.orderCount).toFixed(0)} average order value
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-800">Market Share</p>
                      <p className="text-xs text-purple-600">
                        {/* {((selectedLocation.revenue / totalRevenue) * 100).toFixed(1)}% of total platform revenue */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  View Market Report
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Export Data
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                  Compare Markets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}