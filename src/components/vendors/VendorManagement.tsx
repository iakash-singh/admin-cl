import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Store,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Star,
  Search,
  UserCheck,
  X,
} from "lucide-react";
import DataTable from "../shared/DataTable";
import StatCard from "../shared/StatCard";
import { mockVendors } from "../../data/mockData";
import { Vendor } from "../../types";
import { createPortal } from "react-dom";

// === Reusable Verification Badge ===
const VerificationBadge = ({
  status,
}: {
  status: Vendor["verificationStatus"];
}) => {
  const statusConfig = {
    verified: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: CheckCircle,
      label: "Verified",
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: Clock,
      label: "Pending",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: XCircle,
      label: "Rejected",
    },
  };
  const config =
    statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: X,
      label: "Unknown",
    };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 py-1 px-2.5 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
};

// === Reusable Onboarding Badge ===
const OnboardingBadge = ({
  status,
}: {
  status: Vendor["onboardingStatus"];
}) => {
  const statusConfig = {
    completed: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Completed",
    },
    pending_review: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      label: "In Review",
    },
    incomplete: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Incomplete",
    },
  };
  const config =
    statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Unknown",
    };

  return (
    <span
      className={`inline-flex items-center py-1 px-2.5 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // === Filtering & Searching ===
  useEffect(() => {
    let filtered = mockVendors;
    if (filterStatus !== "all") {
      filtered = filtered.filter((v) => v.verificationStatus === filterStatus);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.businessName.toLowerCase().includes(lower) ||
          v.ownerName.toLowerCase().includes(lower)
      );
    }
    setVendors(filtered);
  }, [filterStatus, searchTerm]);

  // === Stats Summary ===
  const stats = useMemo(() => {
    const totalRevenue = mockVendors.reduce(
      (a, v) => a + (v.revenue || 0),
      0
    );
    const pending = mockVendors.filter(
      (v) => v.verificationStatus === "pending"
    ).length;
    const topRated =
      mockVendors.reduce(
        (max, v) => ((v.rating || 0) > (max.rating || 0) ? v : max),
        mockVendors[0] || {}
      ) || {};
    return {
      totalVendors: mockVendors.length,
      pendingApproval: pending,
      averageRevenue:
        mockVendors.length > 0
          ? totalRevenue / mockVendors.length
          : 0,
      topRatedVendor: topRated?.businessName || "N/A",
    };
  }, []);

  // === Table Columns ===
  const vendorColumns = [
    {
      key: "businessName",
      label: "Business & Owner",
      render: (row: Vendor) => (
        <div>
          <p className="font-semibold text-gray-900">{row.businessName}</p>
          <p className="text-xs text-gray-500">{row.ownerName}</p>
        </div>
      ),
    },
    {
      key: "verificationStatus",
      label: "Verification",
      render: (row: Vendor) => (
        <VerificationBadge status={row.verificationStatus} />
      ),
    },
    {
      key: "onboardingStatus",
      label: "Onboarding",
      render: (row: Vendor) => (
        <OnboardingBadge status={row.onboardingStatus} />
      ),
    },
    { key: "totalProducts", label: "Products", className: "text-center" },
    {
      key: "rating",
      label: "Rating",
      render: (row: Vendor) => (
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="ml-1 text-sm font-medium">
            {(row.rating || 0).toFixed(1)}
          </span>
        </div>
      ),
    },
    {
      key: "revenue",
      label: "Revenue",
      render: (row: Vendor) => `$${(row.revenue || 0).toLocaleString()}`,
    },
  ];

  return (
    <main className="ml-64 min-h-screen bg-gray-50 px-8 xl:px-10 py-10 transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        {/* === Stats Header === */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Vendors"
            value={stats.totalVendors.toLocaleString()}
            icon={Store}
            color="blue"
          />
          <StatCard
            title="Pending Approval"
            value={stats.pendingApproval.toLocaleString()}
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Avg. Revenue"
            value={`$${stats.averageRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Top Rated"
            value={stats.topRatedVendor}
            icon={UserCheck}
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendor..."
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
              <option value="all">All Verification Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <DataTable
            data={vendors}
            columns={vendorColumns}
            onRowClick={(v) => setSelectedVendor(v as Vendor)}
          />
        </motion.div>

        {/* === Vendor Modal === */}
        {selectedVendor &&
          createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedVendor.businessName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Owner: {selectedVendor.ownerName}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedVendor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Contact Info
                      </h4>
                      <p className="text-sm text-gray-800">
                        {selectedVendor.email}
                      </p>
                      <p className="text-sm text-gray-800">
                        {selectedVendor.phone}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        Statuses
                      </h4>
                      <div className="flex flex-col gap-2">
                        <VerificationBadge
                          status={selectedVendor.verificationStatus}
                        />
                        <OnboardingBadge
                          status={selectedVendor.onboardingStatus}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    {[
                      {
                        label: "Products",
                        value: selectedVendor.totalProducts,
                        color: "blue",
                      },
                      {
                        label: "Revenue",
                        value: `$${(
                          selectedVendor.revenue || 0
                        ).toLocaleString()}`,
                        color: "green",
                      },
                      {
                        label: "Orders",
                        value: selectedVendor.totalOrders,
                        color: "purple",
                      },
                      {
                        label: "Rating",
                        value: (selectedVendor.rating || 0).toFixed(1),
                        color: "amber",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`bg-${item.color}-50 p-4 rounded-xl hover:scale-105 transition-transform`}
                      >
                        <p
                          className={`text-sm font-medium text-${item.color}-800`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-2xl font-bold text-${item.color}-900 mt-1`}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    {selectedVendor.verificationStatus === "pending" && (
                      <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                        Approve Vendor
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                      Message Vendor
                    </button>
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
