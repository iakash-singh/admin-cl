import React, { useState } from 'react';
import { MessageSquare, Star, ThumbsUp, Filter, Flag, CheckCircle } from 'lucide-react';
import DataTable from '../shared/DataTable';
import StatCard from '../shared/StatCard';
import { mockFeedback } from '../../data/mockData';
import { Feedback } from '../../types';

export default function FeedbackManagement() {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [filterBy, setFilterBy] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Calculate feedback statistics
  const totalFeedback = mockFeedback.length;
  const averageRating = mockFeedback.reduce((sum, feedback) => sum + feedback.rating, 0) / totalFeedback;
  const pendingReviews = mockFeedback.filter(f => f.status === 'pending').length;
  const flaggedReviews = mockFeedback.filter(f => f.status === 'flagged').length;

  // Filter and sort feedback
  const filteredFeedback = mockFeedback
    .filter(feedback => {
      if (filterBy === 'all') return true;
      if (filterBy.startsWith('vendor-')) {
        return feedback.vendorId === filterBy.split('-')[1];
      }
      if (filterBy.startsWith('product-')) {
        return feedback.productId === filterBy.split('-')[1];
      }
      if (filterBy.startsWith('rating-')) {
        return feedback.rating === parseInt(filterBy.split('-')[1]);
      }
      return feedback.status === filterBy;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'rating-high') return b.rating - a.rating;
      if (sortBy === 'rating-low') return a.rating - b.rating;
      if (sortBy === 'helpful') return b.helpful - a.helpful;
      return 0;
    });

  const feedbackColumns = [
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
      )
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (value: string) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate">{value}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          value === 'approved' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value === 'approved' ? (
            <CheckCircle className="h-3 w-3 mr-1" />
          ) : value === 'pending' ? (
            <MessageSquare className="h-3 w-3 mr-1" />
          ) : (
            <Flag className="h-3 w-3 mr-1" />
          )}
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'helpful',
      label: 'Helpful',
      render: (value: number) => (
        <div className="flex items-center">
          <ThumbsUp className="h-4 w-4 text-blue-500" />
          <span className="ml-1 text-sm font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      {/* Feedback Statistics */}
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
          change={0.2}
          changeType="increase"
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

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = mockFeedback.filter(f => f.rating === rating).length;
            const percentage = (count / totalFeedback) * 100;
            
            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Filters and Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Feedback Management</h3>
          <div className="flex items-center space-x-3">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Feedback</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
              <option value="rating-5">5 Star Reviews</option>
              <option value="rating-4">4 Star Reviews</option>
              <option value="rating-3">3 Star Reviews</option>
              <option value="rating-2">2 Star Reviews</option>
              <option value="rating-1">1 Star Reviews</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
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

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Review Details</h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Review Header */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{selectedFeedback.userName}</h4>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      selectedFeedback.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedFeedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Product: {selectedFeedback.productName}</span>
                    <span>Vendor: {selectedFeedback.vendorName}</span>
                    <span>{new Date(selectedFeedback.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < selectedFeedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-lg font-semibold text-gray-900 ml-2">
                  {selectedFeedback.rating} out of 5
                </span>
              </div>

              {/* Comment */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 leading-relaxed">{selectedFeedback.comment}</p>
              </div>

              {/* Feedback Stats */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {selectedFeedback.helpful} people found this helpful
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Review ID: {selectedFeedback.id}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {selectedFeedback.status === 'pending' && (
                  <>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      Approve Review
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Flag Review
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