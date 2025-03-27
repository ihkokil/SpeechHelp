
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
import SvgUploaderDemo from "./pages/SvgUploaderDemo";
import LogoManager from "./pages/LogoManager";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";

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
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<NavbarLayout><Index /></NavbarLayout>} />
              <Route path="/pricing" element={<NavbarLayout><Pricing /></NavbarLayout>} />
              <Route path="/auth" element={<NavbarLayout><Auth /></NavbarLayout>} />
              <Route path="/svg-uploader" element={<NavbarLayout><SvgUploaderDemo /></NavbarLayout>} />
              <Route path="/logo-manager" element={<LogoManager />} />
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NavbarLayout><NotFound /></NavbarLayout>} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
