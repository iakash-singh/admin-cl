import { useState } from 'react';
import { MapPin, Users, Store, Package, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '../shared/StatCard';
import DataTable from '../shared/DataTable';
import { mockLocations } from '../../data/mockData';
import { Location } from '../../types';

export default function LocationInsights() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Calculate totals
  const totalUsers = mockLocations.reduce((sum, loc) => sum + loc.userCount, 0);
  const totalVendors = mockLocations.reduce((sum, loc) => sum + loc.vendorCount, 0);
  // totalRevenue is available from mock data aggregations when needed
  const averageOrderValue = (() => {
    const locationsWithOrders = mockLocations.filter(loc => loc.orderCount > 0);
    if (locationsWithOrders.length === 0) return 0;
    const total = locationsWithOrders.reduce((sum, loc) => sum + (loc.revenue / loc.orderCount), 0);
    return total / locationsWithOrders.length;
  })();

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
          {value.toLocaleString()}
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
          {value.toLocaleString()}
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
          {value.toLocaleString()}
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
          ${value.toLocaleString()}
        </div>
      )
    },
    {
      key: 'marketDensity',
      label: 'Market Density',
      render: (_value: number, row: Location) => {
        const density = row.vendorCount > 0 ? row.userCount / row.vendorCount : null;
        return (
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
            {density === null ? 'N/A' : `${density.toFixed(1)} users/vendor`}
          </div>
        );
      }
    },
    {
      key: 'avgOrderValue',
      label: 'Avg Order Value',
      render: (_value: number, row: Location) => {
        if (row.orderCount === 0) return '-';
        const avg = row.revenue / row.orderCount;
        return `$${avg.toFixed(0)}`;
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Location Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Market Coverage" value={mockLocations.length} icon={MapPin} color="blue" />
        <StatCard
          title="Total Active Users"
          value={totalUsers.toLocaleString()}
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
          value={`$${averageOrderValue.toFixed(0)}`}
          change={5.7}
          changeType="increase"
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Market Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Markets by Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Markets by Revenue</h3>
          <div className="space-y-3">
              {[...mockLocations]
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((location, index) => (
                <div key={location.city} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{location.city}</p>
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
          </div>
        </div>

        {/* User Concentration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Concentration</h3>
          <div className="space-y-3">
              {[...mockLocations]
              .sort((a, b) => b.userCount - a.userCount)
              .slice(0, 5)
              .map((location, index) => (
                <div key={location.city} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{location.city}</p>
                    <p className="text-xs text-gray-500">{location.vendorCount} vendors</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{location.userCount}</p>
                    <p className="text-xs text-gray-500">
                      {((location.userCount / totalUsers) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Market Opportunity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Opportunity</h3>
          <div className="space-y-3">
              {[...mockLocations]
              .map(location => ({
                ...location,
                opportunity: location.userCount / location.vendorCount
              }))
              .sort((a, b) => b.opportunity - a.opportunity)
              .slice(0, 5)
              .map((location, index) => (
                <div key={location.city} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{location.city}</p>
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
      </div>

      {/* Location Data Table */}
      <DataTable
        data={mockLocations}
        columns={locationColumns}
        onRowClick={(location) => setSelectedLocation(location)}
      />

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedLocation.city}</h3>
                <p className="text-sm text-gray-500 mt-1">Market Analysis & Insights</p>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Users"
                  value={selectedLocation.userCount.toLocaleString()}
                  icon={Users}
                  color="blue"
                  small
                />
                <StatCard
                  title="Vendors"
                  value={selectedLocation.vendorCount.toLocaleString()}
                  icon={Store}
                  color="green"
                  small
                />
                <StatCard
                  title="Orders"
                  value={selectedLocation.orderCount.toLocaleString()}
                  icon={Package}
                  color="purple"
                  small
                />
                <StatCard
                  title="Revenue"
                  value={`$${selectedLocation.revenue.toLocaleString()}`}
                  icon={DollarSign}
                  color="yellow"
                  small
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
