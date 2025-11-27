import React, { useState } from 'react';
import { Shield, Settings, FileText, Download, Upload, Users, UserCheck, UserX, AlertTriangle, Search } from 'lucide-react';
import StatCard from '../shared/StatCard';

export default function AdminFeatures() {
  const [activeTab, setActiveTab] = useState('permissions');

  const adminTabs = [
    { id: 'permissions', name: 'User Permissions', icon: Shield },
    { id: 'system', name: 'System Settings', icon: Settings },
    { id: 'content', name: 'Content Moderation', icon: AlertTriangle },
    { id: 'bulk', name: 'Bulk Operations', icon: Upload },
    { id: 'audit', name: 'Audit Logs', icon: FileText }
  ];

  const renderPermissionsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Admin Users"
          value={12}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Suspended Accounts"
          value={8}
          icon={UserX}
          color="red"
        />
        <StatCard
          title="Pending Reviews"
          value={23}
          icon={AlertTriangle}
          color="yellow"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role-Based Access Control</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Admin Roles</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Super Administrator</p>
                    <p className="text-xs text-gray-500">Full system access</p>
                  </div>
                  <span className="text-sm text-green-600 font-medium">3 users</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Content Moderator</p>
                    <p className="text-xs text-gray-500">Review and moderate content</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">5 users</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Support Agent</p>
                    <p className="text-xs text-gray-500">Customer support access</p>
                  </div>
                  <span className="text-sm text-purple-600 font-medium">8 users</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recent Permission Changes</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Admin role granted</p>
                    <p className="text-xs text-gray-500">John Smith - Content Moderator</p>
                  </div>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <UserX className="h-5 w-5 text-red-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Account suspended</p>
                    <p className="text-xs text-gray-500">User violation policy</p>
                  </div>
                  <span className="text-xs text-gray-500">4h ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Permissions updated</p>
                    <p className="text-xs text-gray-500">Support agent role modified</p>
                  </div>
                  <span className="text-xs text-gray-500">6h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Platform Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Put platform in maintenance mode</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Auto-approve Vendors</p>
                  <p className="text-xs text-gray-500">Automatically approve new vendors</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-500">Send admin email notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Configuration Values</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Upload Size (MB)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Moderation Tools</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Automated Filters</h4>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">Profanity Filter</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                <p className="text-xs text-gray-500">Automatically flags inappropriate language</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">Spam Detection</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                </div>
                <p className="text-xs text-gray-500">Detects and filters spam content</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">Image Recognition</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Beta</span>
                </div>
                <p className="text-xs text-gray-500">AI-powered inappropriate image detection</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Moderation Queue</h4>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-sm font-medium text-red-900">High Priority</p>
                </div>
                <p className="text-xs text-red-700">15 items require immediate attention</p>
                <button className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                  Review Now
                </button>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-900">Medium Priority</p>
                </div>
                <p className="text-xs text-yellow-700">47 items pending review</p>
                <button className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">
                  Review
                </button>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Search className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">Auto-approved</p>
                </div>
                <p className="text-xs text-blue-700">203 items passed automated checks</p>
                <button className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBulkTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Operations</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Data Import/Export</h4>
            <div className="space-y-3">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Import Users</p>
                <p className="text-xs text-gray-500 mb-3">Upload CSV file with user data</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Choose File
                </button>
              </div>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Import Products</p>
                <p className="text-xs text-gray-500 mb-3">Upload CSV file with product data</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Choose File
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Bulk Actions</h4>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">User Management</p>
                <div className="flex space-x-2">
                  <button className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                    Activate Selected
                  </button>
                  <button className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Suspend Selected
                  </button>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Vendor Approval</p>
                <div className="flex space-x-2">
                  <button className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                    Approve All
                  </button>
                  <button className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    Reject All
                  </button>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Email Notifications</p>
                <div className="flex space-x-2">
                  <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    Send Newsletter
                  </button>
                  <button className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700">
                    Send Updates
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuditTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">User account created</p>
              <p className="text-xs text-gray-500">Admin: John Smith | IP: 192.168.1.1</p>
            </div>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Vendor approved</p>
              <p className="text-xs text-gray-500">Admin: Sarah Wilson | Vendor ID: V-1234</p>
            </div>
            <span className="text-xs text-gray-500">15 minutes ago</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">User suspended</p>
              <p className="text-xs text-gray-500">Admin: Mike Johnson | Reason: Policy violation</p>
            </div>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">System settings updated</p>
              <p className="text-xs text-gray-500">Admin: Super Admin | Changed: Commission rate</p>
            </div>
            <span className="text-xs text-gray-500">3 hours ago</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
              <Download className="h-3 w-3 mr-1 inline" />
              Export Logs
            </button>
            <button className="text-xs bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700">
              Filter Logs
            </button>
          </div>
          <span className="text-xs text-gray-500">Showing latest 50 entries</span>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'permissions':
        return renderPermissionsTab();
      case 'system':
        return renderSystemTab();
      case 'content':
        return renderContentTab();
      case 'bulk':
        return renderBulkTab();
      case 'audit':
        return renderAuditTab();
      default:
        return renderPermissionsTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}