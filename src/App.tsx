
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import MySpeeches from './pages/MySpeeches';
import SpeechLab from './pages/SpeechLab';
import WritingTips from './pages/WritingTips';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import HelpSupport from './pages/HelpSupport';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import AdminAuth from './pages/AdminAuth';
import UserManagement from './pages/admin/UserManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Create a new query client instance
const queryClient = new QueryClient();

function App() {
  // For the main application
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminAuthProvider>
          <LanguageProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth/*" element={<Auth />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/admin/auth" element={<AdminAuth />} />
                <Route path="/account" element={<Account />} />

                {/* Dashboard routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-speeches" element={<MySpeeches />} />
                <Route path="/speech-lab" element={<SpeechLab />} />
                <Route path="/writing-tips/*" element={<WritingTips />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help-support" element={<HelpSupport />} />

                {/* Admin routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/user-management" element={<UserManagement />} />

                {/* Catch-all route for 404s */}
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/not-found" replace />} />
              </Routes>

              <Toaster />
            </Router>
          </LanguageProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
