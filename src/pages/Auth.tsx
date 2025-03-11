
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if the URL contains signup=true or if hash contains type=recovery
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'true') {
      setIsSignUp(true);
    }

    // Check for password reset flow
    if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      if (hashParams.get('type') === 'recovery') {
        setIsResetPassword(true);
      }
    }
  }, [location]);

  // Redirect if already logged in (except for reset password flow)
  useEffect(() => {
    if (user && !isResetPassword) {
      navigate('/');
    }
  }, [user, navigate, isResetPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isResetPassword) {
        // Handle reset password form submission
        if (newPassword !== confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please make sure your passwords match.",
            variant: "destructive"
          });
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) throw error;

        toast({
          title: "Password updated",
          description: "Your password has been updated successfully. You can now log in with your new password.",
        });

        // Reset state and redirect to login
        setIsResetPassword(false);
        setNewPassword('');
        setConfirmPassword('');
        
      } else if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Reset link sent",
          description: "Check your email for the password reset link.",
        });
        setIsForgotPassword(false);
      } else if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isResetPassword 
              ? 'Reset Your Password'
              : isForgotPassword 
                ? 'Reset Password'
                : isSignUp 
                  ? 'Create an Account' 
                  : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isResetPassword
              ? 'Enter your new password below'
              : isForgotPassword
                ? 'Enter your email to receive a reset link'
                : isSignUp 
                  ? 'Sign up to start improving your speech' 
                  : 'Log in to continue your speech journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isResetPassword && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                placeholder="your@email.com"
              />
            </div>
          )}

          {!isForgotPassword && !isResetPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          )}

          {isResetPassword && (
            <>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </>
          )}

          <ButtonCustom
            type="submit"
            variant="magenta"
            className="w-full py-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isResetPassword 
                ? 'Update Password'
                : isForgotPassword 
                  ? 'Send Reset Link' 
                  : (isSignUp ? 'Sign Up' : 'Log In')
            )}
          </ButtonCustom>
        </form>

        <div className="mt-6 text-center space-y-2">
          {!isResetPassword && !isForgotPassword && (
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-pink-600 hover:text-pink-800 text-sm font-medium"
            >
              {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
            </button>
          )}
          
          {!isResetPassword && (
            <button
              type="button"
              onClick={() => setIsForgotPassword(!isForgotPassword)}
              className="block w-full text-pink-600 hover:text-pink-800 text-sm font-medium"
            >
              {isForgotPassword 
                ? 'Back to login' 
                : 'Forgot your password?'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
