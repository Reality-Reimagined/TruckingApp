import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import Dashboard from './components/Dashboard';
import FindLoads from './components/loads/FindLoads';
import CrossBorderDocs from './components/documents/CrossBorderDocs';
import Settings from './components/settings/Settings';
import Sidebar from './components/Sidebar';
import AuthForm from './components/auth/AuthForm';

function App() {
  const { user, setUser, setSession } = useAuthStore();

  useEffect(() => {
    // Set up auth state listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return <AuthForm />;
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
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;