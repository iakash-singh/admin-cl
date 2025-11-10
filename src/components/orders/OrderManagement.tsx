import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import DataTable from "../shared/DataTable";
import StatCard from "../shared/StatCard";
import { supabase } from "../../supabaseClient";
import { Order } from "../../types";
import { createPortal } from "react-dom";

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // === Fetch Orders from Supabase ===
  const fetchOrders = useCallback(async () => {
    if (orders.length === 0) setLoading(true);

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterStatus !== "all") query = query.eq("status", filterStatus);
    if (searchTerm) query = query.ilike("id", `%${searchTerm}%`);

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(`Failed to fetch orders. Error: ${fetchError.message}`);
    } else {
      setOrders(data as Order[]);
    }

    setLoading(false);
  }, [orders.length, filterStatus, searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => fetchOrders(), 300);
    return () => clearTimeout(handler);
  }, [fetchOrders]);

  // === Stats Summary ===
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((acc, o) => acc + (o.total_amount || 0), 0),
    activeOrders: orders.filter((o) => o.status === "active").length,
    completedOrders: orders.filter((o) => o.status === "completed").length,
  };

  // === Table Columns ===
  const orderColumns = [
    { key: "id", label: "Order ID" },
    { key: "user_id", label: "User ID" },
    { key: "vendor_id", label: "Vendor ID" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const config: Record<
          string,
          { bg: string; text: string; icon: React.ElementType }
        > = {
          active: { bg: "bg-blue-100", text: "text-blue-800", icon: Clock },
          pending: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            icon: AlertTriangle,
          },
          completed: {
            bg: "bg-green-100",
            text: "text-green-800",
            icon: CheckCircle,
          },
          cancelled: { bg: "bg-red-100", text: "text-red-800", icon: X },
        };
        const Icon = config[value]?.icon || Clock;
        return (
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              config[value]?.bg || "bg-gray-100"
            } ${config[value]?.text || "text-gray-800"}`}
          >
            <Icon className="h-3 w-3 mr-1" />
            {value?.charAt(0).toUpperCase() + value?.slice(1)}
          </span>
        );
      },
    },
    {
      key: "total_amount",
      label: "Amount",
      render: (value: number) => `$${value?.toLocaleString()}`,
    },
    {
      key: "created_at",
      label: "Created Date",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
  ];

  // === Loading / Error UI ===
  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-700">
            Failed to Fetch Orders
          </h3>
        </div>
        <p className="text-sm text-red-600 mt-2">{error}</p>
      </div>
    );

  return (
    <main className="ml-64 min-h-screen bg-gray-50 px-8 xl:px-10 py-10 transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        {/* === Stats === */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            icon={Package}
            color="blue"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Active Orders"
            value={stats.activeOrders.toLocaleString()}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Completed Orders"
            value={stats.completedOrders.toLocaleString()}
            icon={CheckCircle}
            color="purple"
          />
        </div>

        {/* === Filters + Table === */}
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
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
        </motion.div>

        {/* === Order Details Modal === */}
        {selectedOrder &&
          createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-100 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Order #{selectedOrder.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        selectedOrder.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Order Info */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
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
                          selectedOrder.status === "active"
                            ? "bg-blue-100 text-blue-800"
                            : selectedOrder.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedOrder.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedOrder.status
                          .charAt(0)
                          .toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Info Sections */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-500">
                        Customer Information
                      </h5>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-800">
                          User ID: {selectedOrder.user_id}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-800">
                          {new Date(
                            selectedOrder.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-500">
                        Payment Details
                      </h5>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Total Amount
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          ${selectedOrder.total_amount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
      </motion.div>
    </main>
  );
}
