import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MessageSquare,
  Star,
  ThumbsUp,
  Flag,
  CheckCircle,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import DataTable from '../shared/DataTable';
import StatCard from '../shared/StatCard';
import { mockFeedback } from '../../data/mockData';
import { Feedback } from '../../types';

export default function FeedbackManagement() {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // --- STATS ---
  const totalFeedback = mockFeedback.length;
  const averageRating =
    totalFeedback === 0
      ? 0
      : mockFeedback.reduce((sum, feedback) => sum + feedback.rating, 0) /
        totalFeedback;
  const pendingReviews = mockFeedback.filter((f) => f.status === 'pending').length;
  const flaggedReviews = mockFeedback.filter((f) => f.status === 'flagged').length;

  // --- FILTER & SORT ---
  const filteredFeedback = useMemo(() => {
    return mockFeedback
      .filter((feedback) => {
        if (filterBy === 'all') return true;
        if (filterBy.startsWith('rating-')) {
          return feedback.rating === parseInt(filterBy.split('-')[1]);
        }
        return feedback.status === filterBy;
      })
      .sort((a, b) => {
        if (sortBy === 'recent')
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        if (sortBy === 'rating-high') return b.rating - a.rating;
        if (sortBy === 'rating-low') return a.rating - b.rating;
        if (sortBy === 'helpful') return b.helpful - a.helpful;
        return 0;
      });
  }, [filterBy, sortBy]);

  // --- ESC to close modal ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedFeedback(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // --- Chart Data ---
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: mockFeedback.filter((f) => f.rating === rating).length,
  }));

  const reviewTrend = useMemo(() => {
    const grouped: Record<string, number> = {};
    mockFeedback.forEach((f) => {
      const month = new Date(f.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      grouped[month] = (grouped[month] || 0) + 1;
    });
    return Object.entries(grouped).map(([month, count]) => ({
      month,
      count,
    }));
  }, []);

  // --- Table Columns ---
  const feedbackColumns = [
    { key: 'userName', label: 'Customer', sortable: true },
    { key: 'productName', label: 'Product', sortable: true },
    { key: 'vendorName', label: 'Vendor', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      render: (value: number) => (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < value ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (value: string) => (
        <p className="max-w-xs truncate text-sm text-gray-900">{value}</p>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            value === 'approved'
              ? 'bg-green-100 text-green-800'
              : value === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value === 'approved' ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : value === 'pending' ? (
            <MessageSquare className="h-3 w-3 mr-1" />
          ) : (
            <Flag className="h-3 w-3 mr-1" />
          )}
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'helpful',
      label: 'Helpful',
      render: (value: number) => (
        <div className="flex items-center">
          <ThumbsUp className="h-4 w-4 text-blue-500" />
          <span className="ml-1 text-sm font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* === DASHBOARD STATS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reviews"
          value={totalFeedback}
          change={15.3}
          changeType="increase"
          icon={MessageSquare}
          color="blue"
        />
        <StatCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          icon={Star}
          color="yellow"
        />
        <StatCard
          title="Pending Reviews"
          value={pendingReviews}
          icon={MessageSquare}
          color="yellow"
        />
        <StatCard
          title="Flagged Reviews"
          value={flaggedReviews}
          icon={Flag}
          color="red"
        />
      </div>

      {/* === CHARTS SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingDistribution}>
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FACC15" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Review Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Review Trend (Monthly)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={reviewTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* === FILTERS & TABLE === */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Feedback Management
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Feedback</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={`rating-${r}`}>
                  {r} Star Reviews
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        <DataTable
          data={filteredFeedback}
          columns={feedbackColumns}
          onRowClick={(feedback) => setSelectedFeedback(feedback)}
        />
      </div>

      {/* === MODAL === */}
      {selectedFeedback && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedFeedback(null);
          }}
        >
          <div
            ref={dialogRef}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-y-auto max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Review Details
              </h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {selectedFeedback.userName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Product: {selectedFeedback.productName} | Vendor:{' '}
                    {selectedFeedback.vendorName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(selectedFeedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < selectedFeedback.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <div className="bg-gray-50 p-4 rounded-lg text-gray-800 leading-relaxed">
                {selectedFeedback.comment}
              </div>

              {/* Helpful */}
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {selectedFeedback.helpful} people found this helpful
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Review ID: {selectedFeedback.id}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {selectedFeedback.status === 'pending' && (
                  <>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      Approve
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Flag
                    </button>
                  </>
                )}
                {selectedFeedback.status === 'flagged' && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Approve Review
                  </button>
                )}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Contact Customer
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                  View Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
