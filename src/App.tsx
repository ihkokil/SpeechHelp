
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SpeechLab from "./pages/SpeechLab";
import WritingTips from "./pages/WritingTips";
import MySpeeches from "./pages/MySpeeches";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";

// Admin Pages
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminSpeechManagement from "./pages/AdminSpeechManagement";
import AdminBillingManagement from "./pages/AdminBillingManagement";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminUnauthorized from "./pages/AdminUnauthorized";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null; // Or a loading spinner
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Layout component for pages that need navbar
const NavbarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AdminProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<NavbarLayout><Index /></NavbarLayout>} />
                <Route path="/pricing" element={<NavbarLayout><Pricing /></NavbarLayout>} />
                <Route path="/auth" element={<NavbarLayout><Auth /></NavbarLayout>} />
                
                {/* Protected User Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/speech-lab" 
                  element={
                    <ProtectedRoute>
                      <SpeechLab />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/writing-tips" 
                  element={
                    <ProtectedRoute>
                      <WritingTips />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-speeches" 
                  element={
                    <ProtectedRoute>
                      <MySpeeches />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/help" 
                  element={
                    <ProtectedRoute>
                      <HelpSupport />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminAuth />} />
                <Route path="/admin/unauthorized" element={<AdminUnauthorized />} />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <AdminProtectedRoute requiredPermission="view_users">
                      <AdminUserManagement />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/speeches" 
                  element={
                    <AdminProtectedRoute requiredPermission="view_speeches">
                      <AdminSpeechManagement />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/billing" 
                  element={
                    <AdminProtectedRoute requiredPermission="manage_billing">
                      <AdminBillingManagement />
                    </AdminProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/analytics" 
                  element={
                    <AdminProtectedRoute requiredPermission="view_analytics">
                      <AdminAnalytics />
                    </AdminProtectedRoute>
                  } 
                />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NavbarLayout><NotFound /></NavbarLayout>} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </AdminProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
