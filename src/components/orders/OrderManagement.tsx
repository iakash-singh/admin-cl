import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2,
  AlertTriangle,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  Search,
  X,
  Calendar,
  User,
} from 'lucide-react';
import DataTable from '../shared/DataTable';
import StatCard from '../shared/StatCard';
import { supabase } from '../../supabaseClient';
import { Order } from '../../types';
import { createPortal } from 'react-dom';

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- Fetch Orders from Supabase ---
  const fetchOrders = useCallback(async () => {
    if (orders.length === 0) setLoading(true);

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    if (searchTerm) query = query.ilike('id', `%${searchTerm}%`);

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(`Failed to fetch orders. Error: ${fetchError.message}`);
    } else {
      setOrders(data as Order[]);
    }

    setLoading(false);
  }, [orders.length, filterStatus, searchTerm]);

  // --- Debounce Fetch ---
  useEffect(() => {
    const handler = setTimeout(() => fetchOrders(), 300);
    return () => clearTimeout(handler);
  }, [fetchOrders]);

  // --- Stats ---
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((acc, o) => acc + (o.total_amount || 0), 0),
    activeOrders: orders.filter((o) => o.status === 'active').length,
    completedOrders: orders.filter((o) => o.status === 'completed').length,
  };

  // --- Table Columns ---
  const orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'user_id', label: 'User ID' },
    { key: 'vendor_id', label: 'Vendor ID' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const config: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
          active: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
          pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle },
          completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
          cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: X },
        };
        const Icon = config[value]?.icon || Clock;
        return (
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              config[value]?.bg || 'bg-gray-100'
            } ${config[value]?.text || 'text-gray-800'}`}
          >
            <Icon className="h-3 w-3 mr-1" />
            {value?.charAt(0).toUpperCase() + value?.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'total_amount',
      label: 'Amount',
      render: (value: number) => `$${value?.toLocaleString()}`,
    },
    {
      key: 'created_at',
      label: 'Created Date',
      render: (value: string) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
    },
  ];

  // --- Loading / Error States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h3 className="ml-2 font-semibold text-red-800">Error Fetching Data</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- STATS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={Package} color="blue" />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
        <StatCard title="Active Orders" value={stats.activeOrders.toLocaleString()} icon={Clock} color="yellow" />
        <StatCard title="Completed Orders" value={stats.completedOrders.toLocaleString()} icon={CheckCircle} color="purple" />
      </div>

      {/* --- FILTER + TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <DataTable
          data={orders}
          columns={orderColumns}
          onRowClick={(order) => setSelectedOrder(order)}
        />
      </div>

      {/* --- ORDER DETAIL MODAL --- */}
      {selectedOrder &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Order #{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created on {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* ORDER INFO */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Vendor: {selectedOrder.vendor_id}
                      </p>
                      <p className="text-sm text-gray-500">
                        User: {selectedOrder.user_id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${selectedOrder.total_amount?.toLocaleString()}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        selectedOrder.status === 'active'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedOrder.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedOrder.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* CUSTOMER INFO */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900">Customer Information</h5>
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <p className="text-sm text-gray-800">User ID: {selectedOrder.user_id}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <p className="text-sm text-gray-800">
                        {new Date(selectedOrder.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* PAYMENT INFO */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-900">Payment Information</h5>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${selectedOrder.total_amount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
