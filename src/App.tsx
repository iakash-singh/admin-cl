import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Layout + Dashboard sections
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Overview from "./components/dashboard/Overview";
import UserManagement from "./components/users/UserManagement";
import VendorManagement from "./components/vendors/VendorManagement";
import OrderManagement from "./components/orders/OrderManagement";
import FeedbackManagement from "./components/feedback/FeedbackManagement";
import Analytics from "./components/analytics/Analytics";
import LocationInsights from "./components/locations/LocationInsights";
import AdminFeatures from "./components/admin/AdminFeatures";
import Login from "./pages/Login";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Overview />;
      case "users":
        return <UserManagement />;
      case "vendors":
        return <VendorManagement />;
      case "orders":
        return <OrderManagement />;
      case "feedback":
        return <FeedbackManagement />;
      case "analytics":
        return <Analytics />;
      case "locations":
        return <LocationInsights />;
      case "admin":
        return <AdminFeatures />;
      case "reports":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Reports & Documentation
            </h3>
            <p className="text-gray-600">
              Comprehensive reporting system coming soon...
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              System Settings
            </h3>
            <p className="text-gray-600">
              Advanced configuration options coming soon...
            </p>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex-1">
        <Header activeSection={activeSection} />
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load active session if already logged in
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) navigate("/login");
    });

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) navigate("/");
      else navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/"
        element={session ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
