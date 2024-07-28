
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
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
import { LanguageProvider } from "./contexts/LanguageContext";
import Navbar from "./components/Navbar";

// Admin imports
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import AdminAuth from "./pages/AdminAuth";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import Test from "./pages/Test";
import Account from "./pages/Account";

// Create a new query client instance
import { QueryClient } from "@tanstack/react-query";
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

// Layout component for pages that need navbar with Auth context
const AuthNavbarLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuthProvider>
			<Navbar />
			{children}
		</AuthProvider>
	);
};

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<AuthProvider>
				<LanguageProvider>
					<AdminAuthProvider>
						<Toaster />
						<Sonner />
						<BrowserRouter>
							<Routes>
								<Route path="/" element={<AuthNavbarLayout><Index /></AuthNavbarLayout>} />
								<Route path="/test" element={<AuthNavbarLayout><Test /></AuthNavbarLayout>} />
								<Route path="/pricing" element={<AuthNavbarLayout><Pricing /></AuthNavbarLayout>} />
								<Route path="/auth" element={<AuthNavbarLayout><Auth /></AuthNavbarLayout>} />
								<Route
									path="/account"
									element={
										<Account />
									}
								/>
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
								<Route path="/admin/auth" element={<AdminAuth />} />
								<Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
								<Route path="/admin" element={<AdminLayout />}>
									<Route path="dashboard" element={<AdminDashboard />} />
									<Route path="users" element={<UserManagement />} />
									<Route path="data" element={<div className="p-4">Data Management Page (Coming Soon)</div>} />
									<Route path="analytics" element={<div className="p-4">Analytics Page (Coming Soon)</div>} />
									<Route path="logs" element={<div className="p-4">Activity Logs Page (Coming Soon)</div>} />
									<Route path="security" element={<div className="p-4">Security Settings Page (Coming Soon)</div>} />
									<Route path="settings" element={<div className="p-4">Admin Settings Page (Coming Soon)</div>} />
									<Route path="support" element={<div className="p-4">Help & Support Page (Coming Soon)</div>} />
									<Route path="profile" element={<div className="p-4">Admin Profile Page (Coming Soon)</div>} />
								</Route>

								{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
								<Route path="*" element={<AuthNavbarLayout><NotFound /></AuthNavbarLayout>} />
							</Routes>
						</BrowserRouter>
					</AdminAuthProvider>
				</LanguageProvider>
			</AuthProvider>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
