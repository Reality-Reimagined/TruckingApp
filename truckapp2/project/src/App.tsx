import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/auth/AuthProvider';
import Dashboard from './components/Dashboard';
import FindLoads from './components/loads/FindLoads';
import CrossBorderDocs from './components/documents/CrossBorderDocs';
import Settings from './components/settings/Settings';
import FleetPage from './components/fleet/FleetPage';
import LoginPage from './components/auth/LoginPage';
import Sidebar from './components/Sidebar';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div className="ml-3 text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/loads" element={<FindLoads />} />
            <Route path="/documents" element={<CrossBorderDocs />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;