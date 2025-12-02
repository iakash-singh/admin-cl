import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Calendar, DollarSign, User, X } from 'lucide-react';
import DataTable from '../shared/DataTable';
import StatCard from '../shared/StatCard';

import { createPortal } from 'react-dom';
import { supabase } from '../../services/supabaseClient';

type OrderRow = {
  id: number;
  created_at: string | null;
  customer: string | null;
  product: string | null;
  vendor: string | null;
  status: string | null;
  amount: number | null;
  end_date: string | null;
  location: string | null;
  payment_status: string | null;
};


export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [disputedOrders, setDisputedOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [orderSuccessRate, setOrderSuccessRate] = useState(0);
  const [marketCoverage, setMarketCoverage] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  
  const fetchOrdersTable = async () => {
    const { data, error } = await supabase
      .from('orders_info')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching orders:', error);
    } 

    const normalized = (data ?? []).map((order) => ({
      id: order.id,
      created_at: order.created_at,
      customer: order.customer,
      product: order.product,
      vendor: order.vendor,
      status: order.status,
      amount: order.amount,
      end_date: order.end_date,
      location: order.location,
      payment_status: order.payment_status,
    }));
    setOrders(normalized);
  };

  const loadStats = async () => {
    const { count: total } = await supabase
      .from('orders_info')
      .select('*', { count: 'exact',  head: true });
    setTotalOrders(total ?? 0);

    const {data: statusData} = await supabase
      .from('orders_info')
      .select('status')

    const statusCount = {
      activeOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      disputedOrders: 0,
    }

    statusData?.forEach((r) => {
      const s = r.status?.toLowerCase();
      if (s === 'active') statusCount.activeOrders += 1;
      else if (s === 'pending') statusCount.pendingOrders += 1;
      else if (s === 'completed') statusCount.completedOrders += 1;
      else if (s === 'disputed') statusCount.disputedOrders += 1;
    })

    setActiveOrders(statusCount.activeOrders);
    setPendingOrders(statusCount.pendingOrders);
    setCompletedOrders(statusCount.completedOrders);
    setDisputedOrders(statusCount.disputedOrders);

    const {data: revenueData} = await supabase
      .from('orders_info')
      .select('amount, created_at')
    let totalRev = revenueData?.reduce((sum, order) => sum + (order.amount ?? 0), 0) ?? 0;
    setTotalRevenue(totalRev);
      
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const {data: todayData} = await supabase
      .from('orders_info')
      .select('amount, created_at')
      .gte('created_at', today.toISOString());

    const todayRev = todayData?.reduce((sum, order) => sum + Number(order.amount ?? 0), 0) ?? 0;
    setTodayRevenue(todayRev);

    const avg = (revenueData?.length ?? 0) > 0 ? totalRev / (revenueData?.length ?? 1) : 0;
    setAverageOrderValue(avg);

    const successRate = statusCount.completedOrders > 0 ? (statusCount.completedOrders / (statusData?.length ?? 1)) * 100 : 0;
    setOrderSuccessRate(successRate);

    const {data: locations} = await supabase
      .from('orders_info')
      .select('location');
      
      const unique = new Set(
        (locations ?? []).map((r) => r.location?.trim()).filter(Boolean)
      );
      setMarketCoverage(unique.size);
  }

  useEffect(() => {
    fetchOrdersTable();
    loadStats();
  }, []);

  const filteredOrders = filterStatus === 'all'
  ? orders
  : orders.filter(order => order.status === filterStatus);

  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      sortable: true,
      render: (value: number) => `#${value}`
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true
    },
    {
      key: 'product',
      label: 'Product',
      sortable: true
    },
    {
      key: 'vendor',
      label: 'Vendor',
      sortable: true
    },
    {

    key: "status",
    label: "Status",
    sortable: true,
    render: (v: string) => {
      const s = (v ?? "").toLowerCase();
      const styles: any = {
        active: "bg-blue-100 text-blue-800",
        pending: "bg-yellow-100 text-yellow-800",
        completed: "bg-green-100 text-green-800",
        disputed: "bg-red-100 text-red-800",
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[s] || "bg-gray-100 text-gray-700"}`}>
          {v}
        </span>
      );
    }
  },

    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      key: 'created_at',
      label: 'Start Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'end_date',
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
          value={totalOrders.toLocaleString()}
          change={8.5}
          changeType="increase"
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Active Orders"
          value={activeOrders.toLocaleString()}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Completed Orders"
          value={completedOrders.toLocaleString()}
          change={12.3}
          changeType="increase"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
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
              <span className="text-sm font-medium text-blue-600">{activeOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-yellow-600">{pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium text-green-600">{completedOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Disputed</span>
              <span className="text-sm font-medium text-red-600">{disputedOrders}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Today</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">${todayRevenue.toLocaleString()}</p>
            {/* <p className="text-sm text-gray-500 mt-1">+12.5% from yesterday</p> */}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Order Value</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">${averageOrderValue.toPrecision(3)}</p>
            {/* <p className="text-sm text-gray-500 mt-1">+5.2% this month</p> */}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Success Rate</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">${orderSuccessRate.toFixed()}%</p>
            {/* <p className="text-sm text-gray-500 mt-1">+2.1% this month</p> */}
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
          onRowClick={(row: OrderRow) => setSelectedOrder(row)}
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
                    {/* Created on {new Date(selectedOrder.createdAt).toLocaleDateString()} */}
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
                    <p className="font-medium text-gray-900">{selectedOrder.product}</p>
                    <p className="text-sm text-gray-500">by {selectedOrder.vendor}</p>
                  </div>
                </div>
                <div className="text-right">

                  <p className="text-2xl font-bold text-gray-900">${selectedOrder.amount}</p>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${selectedOrder.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {(selectedOrder.status ?? '').charAt(0).toUpperCase() + (selectedOrder.status ?? '').slice(1)}

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
                        <p className="text-sm font-medium text-gray-900">{selectedOrder.customer}</p>
                        <p className="text-xs text-gray-500">Customer</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selectedOrder.created_at ?? '').toLocaleDateString()} - {new Date(selectedOrder.end_date ?? '').toLocaleDateString()}
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

                      <span className={`text-sm font-medium ${selectedOrder.payment_status === 'done' ? 'text-green-600' :
                        selectedOrder.payment_status === 'pending' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                        {(selectedOrder.payment_status ?? '').charAt(0).toUpperCase() + (selectedOrder.payment_status ?? '').slice(1)}

                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <span className="text-sm font-medium text-gray-900">${selectedOrder.amount}</span>
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
                      <p className="text-xs text-gray-500">{new Date(selectedOrder.created_at ?? '').toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedOrder.payment_status === 'paid' && (
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