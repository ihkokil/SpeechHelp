
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CircleAlertIcon, SettingsIcon, KeyIcon, LockIcon, UserIcon } from 'lucide-react';

const AdminAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminUser, isLoading, adminLogin } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started with username:', username);
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      console.log('Attempting admin login...');
      await adminLogin(username, password);
      console.log('Admin login complete');
    } catch (err: any) {
      console.error('Error in AdminAuth handleSubmit:', err);
      setError(`Authentication failed: ${err.message || 'Unknown error'}`);
    }
  };

  // Redirect to admin dashboard if already logged in
  if (adminUser) {
    console.log('User already logged in, redirecting to dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2"></div>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <img 
                  src="/Speech Help - Logo.svg" 
                  alt="SpeechHelp Logo" 
                  className="h-12 w-auto mx-auto mb-4"
                />
                <h2 className="text-2xl font-semibold text-gray-800">Admin Access</h2>
                <p className="text-gray-500 text-sm">Secure authentication required</p>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-md flex items-center text-sm animate-fade-in">
                  <CircleAlertIcon className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-gray-50/80 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-gray-50/80 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white shadow-md transition-all hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <LockIcon className="mr-2 h-4 w-4" /> Sign In
                    </>
                  )}
                </Button>
              </form>
              
              <div className="pt-5 border-t border-gray-100 text-center">
                <Link to="/admin/setup" className="group">
                  <div className="inline-flex items-center justify-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 transition-colors">
                    <SettingsIcon className="h-4 w-4 group-hover:rotate-45 transition-transform duration-300" />
                    <span>First-time Setup</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Need to create an admin account? Use the setup page.
                  </p>
                </Link>
              </div>
              
              <div className="mt-6">
                <p className="text-xs text-center text-gray-500">
                  SpeechHelp Admin Portal • Secure access for authorized personnel only
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
