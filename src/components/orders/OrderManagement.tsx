import React, { useState, useEffect, useCallback } from 'react'; // FIXED: Removed 'useMemo'
import { Loader2, AlertTriangle, Package, DollarSign, Clock, CheckCircle, Search } from 'lucide-react';
import DataTable from '../shared/DataTable';
import StatCard from '../shared/StatCard';
import { supabase } from '../../supabaseClient';
import { Order } from '../../types';

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchOrders = useCallback(async () => {
    if (orders.length === 0) {
      setLoading(true);
    }
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }
    if (searchTerm) {
      query = query.ilike('id', `%${searchTerm}%`);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(`Failed to fetch orders. Error: ${fetchError.message}`);
    } else {
      setOrders(data as Order[]);
    }
    setLoading(false);
  }, [orders.length, filterStatus, searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [fetchOrders]);

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((acc, order) => acc + (order.total_amount || 0), 0),
    activeOrders: orders.filter(o => o.status === 'active').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
  };

  const orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'user_id', label: 'User ID' },
    { key: 'vendor_id', label: 'Vendor ID' },
    { key: 'status', label: 'Status' },
    { key: 'total_amount', label: 'Amount' },
    { 
      key: 'created_at', 
      label: 'Created Date', 
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A' 
    },
  ];
  
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={Package} color="blue" />
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
        <StatCard title="Active Orders" value={stats.activeOrders.toLocaleString()} icon={Clock} color="yellow" />
        <StatCard title="Completed Orders" value={stats.completedOrders.toLocaleString()} icon={CheckCircle} color="purple" />
      </div>

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
          onRowClick={(order) => console.log('Selected Order:', order)}
        />
      </div>
    </div>
  );
}