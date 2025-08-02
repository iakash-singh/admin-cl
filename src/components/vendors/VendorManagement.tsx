import React, { useState } from 'react';
import { Store, CheckCircle, Clock, XCircle, TrendingUp, Package, DollarSign, Star } from 'lucide-react';
import DataTable from '../shared/DataTable';
import StatCard from '../shared/StatCard';
import { mockVendors, mockAnalytics } from '../../data/mockData';
import { Vendor } from '../../types';

export default function VendorManagement() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const { vendors } = mockAnalytics;

  const vendorColumns = [
    {
      key: 'businessName',
      label: 'Business Name',
      sortable: true
    },
    {
      key: 'ownerName',
      label: 'Owner',
      sortable: true
    },
    {
      key: 'businessType',
      label: 'Category',
      render: (value: string) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'verificationStatus',
      label: 'Verification',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'verified' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value === 'verified' ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : value === 'pending' ? (
            <Clock className="h-3 w-3 mr-1" />
          ) : (
            <XCircle className="h-3 w-3 mr-1" />
          )}
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'onboardingStatus',
      label: 'Onboarding',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'completed' ? 'bg-green-100 text-green-800' :
          value === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value.replace('_', ' ').charAt(0).toUpperCase() + value.replace('_', ' ').slice(1)}
        </span>
      )
    },
    {
      key: 'totalProducts',
      label: 'Products',
      sortable: true
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'revenue',
      label: 'Revenue',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Vendor Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vendors"
          value={vendors.totalVendors}
          change={8.2}
          changeType="increase"
          icon={Store}
          color="blue"
        />
        <StatCard
          title="Pending Approval"
          value={vendors.pendingApproval}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Average Revenue"
          value={`$${vendors.averageRevenue.toLocaleString()}`}
          change={5.7}
          changeType="increase"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Inventory Efficiency"
          value={`${vendors.inventoryEfficiency}%`}
          change={3.1}
          changeType="increase"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Vendor Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Verified</span>
              <span className="text-sm font-medium text-emerald-600">
                {mockVendors.filter(v => v.verificationStatus === 'verified').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-yellow-600">
                {mockVendors.filter(v => v.verificationStatus === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rejected</span>
              <span className="text-sm font-medium text-red-600">
                {mockVendors.filter(v => v.verificationStatus === 'rejected').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium text-emerald-600">
                {mockVendors.filter(v => v.onboardingStatus === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Under Review</span>
              <span className="text-sm font-medium text-yellow-600">
                {mockVendors.filter(v => v.onboardingStatus === 'pending_review').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Incomplete</span>
              <span className="text-sm font-medium text-red-600">
                {mockVendors.filter(v => v.onboardingStatus === 'incomplete').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {mockVendors
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 3)
              .map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{vendor.businessName}</p>
                    <p className="text-xs text-gray-500">{vendor.businessType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${vendor.revenue.toLocaleString()}</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500 ml-1">{vendor.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <DataTable
        data={mockVendors}
        columns={vendorColumns}
        onRowClick={(vendor) => setSelectedVendor(vendor)}
      />

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Vendor Details</h3>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Store className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">{selectedVendor.businessName}</h4>
                  <p className="text-sm text-gray-500 mb-2">{selectedVendor.ownerName}</p>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      selectedVendor.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                      selectedVendor.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedVendor.verificationStatus.charAt(0).toUpperCase() + selectedVendor.verificationStatus.slice(1)}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{selectedVendor.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Business Information</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Business Type</label>
                      <p className="text-sm text-gray-900">{selectedVendor.businessType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedVendor.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{selectedVendor.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900">{selectedVendor.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Performance Metrics</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-blue-600" />
                        <span className="ml-2 text-sm font-medium text-gray-900">Products</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{selectedVendor.totalProducts}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="ml-2 text-sm font-medium text-gray-900">Revenue</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600 mt-1">${selectedVendor.revenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <span className="ml-2 text-sm font-medium text-gray-900">Orders</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600 mt-1">{selectedVendor.totalOrders}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-600" />
                        <span className="ml-2 text-sm font-medium text-gray-900">Rating</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">{selectedVendor.rating}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {selectedVendor.verificationStatus === 'pending' && (
                  <>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      Approve Vendor
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Reject Vendor
                    </button>
                  </>
                )}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  View Products
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}