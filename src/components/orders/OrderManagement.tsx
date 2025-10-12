import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import DataTable from '../shared/DataTable';
import { supabase } from '../../supabaseClient';
import { Order } from '../../types';

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    // This is a simple query to get ALL columns from ONLY the 'orders' table
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false }); // Show newest orders first

    if (error) {
      console.error('CRITICAL: Error fetching orders:', error);
      setError(`Failed to fetch orders. Error: ${error.message}`);
    } else {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch the initial data
    fetchOrders();

    // Set up Realtime to re-fetch when the 'orders' table changes
    const channel = supabase.channel('realtime orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Change received!', payload);
          fetchOrders();
        }
      )
      .subscribe();

    // Cleanup the subscription when the component is no longer on screen
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Columns to display the raw data from the 'orders' table
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading orders...</p>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">All Orders (Realtime)</h3>
      <DataTable
        data={orders}
        columns={orderColumns}
        onRowClick={(order) => console.log('Selected Order:', order)}
      />
    </div>
  );
}