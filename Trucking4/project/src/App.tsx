import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import Dashboard from './components/Dashboard';
import FindLoads from './components/loads/FindLoads';
import PostLoad from './components/loads/PostLoad';
import CrossBorderDocs from './components/documents/CrossBorderDocs';
import Settings from './components/settings/Settings';
import MessagesPage from './components/messages/MessagesPage';
import Sidebar from './components/Sidebar';
import AuthForm from './components/auth/AuthForm';
import SupportDialog from './components/support/SupportDialog';

const queryClient = new QueryClient();

function App() {
  const { user, setUser, setSession } = useAuthStore();
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
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
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/loads" element={<FindLoads />} />
              <Route path="/loads/post" element={<PostLoad />} />
              <Route path="/documents" element={<CrossBorderDocs />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <SupportDialog isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;


// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useAuthStore } from './store/authStore';
// import { supabase } from './lib/supabase';
// import Dashboard from './components/Dashboard';
// import FindLoads from './components/loads/FindLoads';
// import PostLoad from './components/loads/PostLoad';
// import CrossBorderDocs from './components/documents/CrossBorderDocs';
// import Settings from './components/settings/Settings';
// import Sidebar from './components/Sidebar';
// import AuthForm from './components/auth/AuthForm';
// import SupportDialog from './components/support/SupportDialog';

// function App() {
//   const { user, setUser, setSession } = useAuthStore();
//   const [supportOpen, setSupportOpen] = useState(false);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   if (!user) {
//     return <AuthForm />;
//   }

//   return (
//     <Router>
//       <div className="flex h-screen bg-gray-50">
//         <Sidebar />
//         <main className="flex-1 overflow-y-auto">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/loads" element={<FindLoads />} />
//             <Route path="/loads/post" element={<PostLoad />} />
//             <Route path="/documents" element={<CrossBorderDocs />} />
//             <Route path="/settings" element={<Settings />} />
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </main>
//         <SupportDialog isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
//       </div>
//     </Router>
//   );
// }

// export default App;