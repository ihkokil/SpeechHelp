
import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, User, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FirstAdminSetup from '@/components/admin/FirstAdminSetup';

const AdminAuth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [needsFirstTimeSetup, setNeedsFirstTimeSetup] = useState(false);
  const [checkingAdminStatus, setCheckingAdminStatus] = useState(true);
  
  const { login, verify2FA, isLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkForExistingAdmins();
  }, []);

  const checkForExistingAdmins = async () => {
    try {
      setCheckingAdminStatus(true);
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { method: 'check_admins_exist' }
      });
      
      if (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Error",
          description: "Failed to check admin configuration. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      setNeedsFirstTimeSetup(!data.adminsExist);
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      toast({
        title: "Error",
        description: "Failed to check admin configuration: " + error.message,
        variant: "destructive"
      });
    } finally {
      setCheckingAdminStatus(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!username || !password) {
      setErrorMessage('Username and password are required');
      return;
    }
    
    try {
      const result = await login(username, password);
      if (result?.requires2FA) {
        setShowTwoFA(true);
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Login failed. Please try again.');
    }
  };

  const handleTwoFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!twoFACode) {
      setErrorMessage('2FA code is required');
      return;
    }
    
    try {
      const success = await verify2FA(twoFACode);
      
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMessage('Invalid 2FA code. Please try again.');
      }
    } catch (error: any) {
      console.error('2FA verification error:', error);
      setErrorMessage(error.message || 'Failed to verify 2FA code. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Please contact the system administrator to reset your password.",
    });
  };

  const handleSetupComplete = () => {
    setNeedsFirstTimeSetup(false);
    toast({
      title: "Setup Complete",
      description: "You can now log in with your new admin credentials.",
    });
  };

  if (checkingAdminStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 p-4">
        <div className="text-center text-white">
          <Shield className="h-12 w-12 mx-auto animate-pulse mb-4" />
          <h2 className="text-xl font-semibold">Checking configuration...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 p-4">
      {needsFirstTimeSetup ? (
        <FirstAdminSetup onSetupComplete={handleSetupComplete} />
      ) : (
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">SpeechHelp Admin</h1>
            <p className="text-white/80">Secure administrative access</p>
          </div>
          
          <Card className="border-0 shadow-xl">
            {!showTwoFA ? (
              <>
                <CardHeader>
                  <CardTitle>Admin Login</CardTitle>
                  <CardDescription>
                    Enter your admin credentials to access the dashboard
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    {errorMessage && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                          className="pl-10"
                          autoComplete="username"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Password</Label>
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-xs text-purple-600 hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="pl-10"
                          autoComplete="current-password"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging in...' : 'Log In'}
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Enter the verification code from your authenticator app
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleTwoFASubmit} className="space-y-4">
                    {errorMessage && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="twoFACode">Verification Code</Label>
                      <Input
                        id="twoFACode"
                        type="text"
                        value={twoFACode}
                        onChange={(e) => setTwoFACode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="text-center text-xl tracking-widest"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </Button>
                    
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowTwoFA(false)}
                        className="text-sm text-purple-600 hover:underline"
                      >
                        Back to login
                      </button>
                    </div>
                  </form>
                </CardContent>
              </>
            )}
            
            <CardFooter className="flex justify-center text-xs text-gray-500">
              Secure access for authorized personnel only
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminAuth;
