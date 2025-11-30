import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './components/dashboard/Overview';
import UserManagement from './components/users/UserManagement';
import VendorManagement from './components/vendors/VendorManagement';
import OrderManagement from './components/orders/OrderManagement';
import FeedbackManagement from './components/feedback/FeedbackManagement';
import Analytics from './components/analytics/Analytics';
import LocationInsights from './components/locations/LocationInsights';
import AdminFeatures from './components/admin/AdminFeatures';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Overview />;
      case 'users':
        return <UserManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'analytics':
        return <Analytics />;
      case 'locations':
        return <LocationInsights />;
      case 'admin':
        return <AdminFeatures />;
      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports & Documentation</h3>
            <p className="text-gray-600">Comprehensive reporting system coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600">Advanced configuration options coming soon...</p>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1">
        <Header activeSection={activeSection} />
        <main className="p-6 max-w-6xl mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;