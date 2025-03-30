
import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Lock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onTwoFactorRequired: () => void;
  onError: (message: string) => void;
}

const LoginForm = ({ onTwoFactorRequired, onError }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login, isLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!username || !password) {
      setErrorMessage('Username and password are required');
      return;
    }
    
    try {
      const result = await login(username, password);
      
      if (result && result.requires2FA) {
        onTwoFactorRequired();
      } else if (result && result.success) {
        // If login was successful and no 2FA required, navigate to dashboard
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.message || 'Login failed. Please try again.';
      setErrorMessage(message);
      onError(message);
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Please contact the system administrator to reset your password.",
    });
  };

  return (
    <>
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
    </>
  );
};

export default LoginForm;
