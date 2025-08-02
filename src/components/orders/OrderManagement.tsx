import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, AlertTriangle, Calendar, DollarSign, User } from 'lucide-react';
import DataTable from '../shared/DataTable';
import StatCard from '../shared/StatCard';
import { mockOrders, mockAnalytics } from '../../data/mockData';
import { Order } from '../../types';

export default function OrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { orders } = mockAnalytics;

  const filteredOrders = filterStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === filterStatus);

  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (value: string) => `#${value}`
    },
    {
      key: 'userName',
      label: 'Customer',
      sortable: true
    },
    {
      key: 'productName',
      label: 'Product',
      sortable: true
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const statusConfig = {
          active: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
          pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle },
          completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
          cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
          disputed: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle }
        };
        
        const config = statusConfig[value as keyof typeof statusConfig];
        const Icon = config.icon;
        
        return (
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
            <Icon className="h-3 w-3 mr-1" />
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      key: 'startDate',
      label: 'Start Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'endDate',
      label: 'End Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={orders.totalOrders.toLocaleString()}
          change={8.5}
          changeType="increase"
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Active Orders"
          value={orders.activeOrders}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Completed Orders"
          value={orders.completedOrders.toLocaleString()}
          change={12.3}
          changeType="increase"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${orders.revenueThisMonth.toLocaleString()}`}
          change={15.7}
          changeType="increase"
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active</span>
              <span className="text-sm font-medium text-blue-600">{orders.activeOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-yellow-600">{orders.pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium text-green-600">{orders.completedOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Disputed</span>
              <span className="text-sm font-medium text-red-600">{orders.disputedOrders}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Today</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">${orders.revenueToday.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">+12.5% from yesterday</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Order Value</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">$142</p>
            <p className="text-sm text-gray-500 mt-1">+5.2% this month</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Success Rate</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">94.2%</p>
            <p className="text-sm text-gray-500 mt-1">+2.1% this month</p>
          </div>
        </div>
      </div>

      {/* Order Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Orders</option>
              <option value="active">Active Orders</option>
              <option value="pending">Pending Orders</option>
              <option value="completed">Completed Orders</option>
              <option value="disputed">Disputed Orders</option>
            </select>
          </div>
        </div>
        
        <DataTable
          data={filteredOrders}
          columns={orderColumns}
          onRowClick={(order) => setSelectedOrder(order)}
        />
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Order #{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedOrder.productName}</p>
                    <p className="text-sm text-gray-500">by {selectedOrder.vendorName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${selectedOrder.totalAmount}</p>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    selectedOrder.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Customer Information</h5>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedOrder.userName}</p>
                        <p className="text-xs text-gray-500">Customer</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selectedOrder.startDate).toLocaleDateString()} - {new Date(selectedOrder.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">Rental Period</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Payment Information</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Payment Status</span>
                      <span className={`text-sm font-medium ${
                        selectedOrder.paymentStatus === 'paid' ? 'text-green-600' :
                        selectedOrder.paymentStatus === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <span className="text-sm font-medium text-gray-900">${selectedOrder.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Location</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900">Order Timeline</h5>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Created</p>
                      <p className="text-xs text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedOrder.paymentStatus === 'paid' && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Payment Confirmed</p>
                        <p className="text-xs text-gray-500">Payment received and verified</p>
                      </div>
                    </div>
                  )}
                  {selectedOrder.status === 'active' && (
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Rental Active</p>
                        <p className="text-xs text-gray-500">Item is currently with customer</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {selectedOrder.status === 'pending' && (
                  <>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      Approve Order
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Cancel Order
                    </button>
                  </>
                )}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Contact Customer
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}