
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CircleAlertIcon, SettingsIcon } from 'lucide-react';

const AdminAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminUser, isLoading, adminLogin } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      await adminLogin(username, password);
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  // Redirect to admin dashboard if already logged in
  if (adminUser) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f1eeff] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <img 
                src="/Speech Help - Logo.svg" 
                alt="SpeechHelp Logo" 
                className="h-10"
              />
            </div>
            <h1 className="text-xl font-medium text-[#9c4dcc] mt-2">Admin Portal</h1>
          </div>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-semibold text-gray-800">Admin Access</h2>
                <p className="text-gray-500 text-sm">Sign in to access the admin dashboard</p>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center text-sm">
                  <CircleAlertIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-50"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              
              <div className="pt-4 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <SettingsIcon className="h-4 w-4" />
                  <span>First-time Setup</span>
                </div>
                <Link to="/admin/setup" className="mt-2 block px-4 py-2 text-center text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 text-sm">
                  Create Default Admin Account
                </Link>
                <p className="text-xs text-gray-500 mt-3">
                  Use this option only for the initial setup of your admin portal.
                </p>
              </div>
              
              <p className="text-xs text-center text-gray-400">
                Secure access for authorized personnel only
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
