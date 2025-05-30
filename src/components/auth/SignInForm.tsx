
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import TwoFactorVerification from './TwoFactorVerification';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

const SignInForm = ({ 
  onSwitchToSignUp, 
  onSwitchToForgotPassword 
}: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkTwoFactorEnabled = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_2fa')
        .select('is_enabled')
        .eq('user_id', userId)
        .eq('is_enabled', true)
        .maybeSingle();

      return !error && data?.is_enabled === true;
    } catch (error) {
      console.error('Error checking 2FA status:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('SignInForm: Attempting to sign in');
      
      // First, try to sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('SignInForm: Authentication error:', error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        // Check if 2FA is enabled for this user
        const has2FA = await checkTwoFactorEnabled(data.user.id);
        
        if (has2FA) {
          console.log('SignInForm: 2FA required for user');
          // Sign out immediately and show 2FA form
          await supabase.auth.signOut();
          setPendingUserId(data.user.id);
          setShowTwoFactor(true);
        } else {
          console.log('SignInForm: No 2FA required, completing sign in');
          // Complete the sign in through the context
          await signIn(email, password);
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('SignInForm: Authentication error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSuccess = async () => {
    try {
      // Now complete the actual sign in
      await signIn(email, password);
      console.log('SignInForm: 2FA verified, sign in completed');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('SignInForm: Error completing sign in after 2FA:', error);
      toast({
        title: "Login failed",
        description: "Failed to complete sign in after verification.",
        variant: "destructive"
      });
    } finally {
      setShowTwoFactor(false);
      setPendingUserId(null);
    }
  };

  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
    setPendingUserId(null);
    toast({
      title: "Login cancelled",
      description: "Two-factor authentication was cancelled.",
    });
  };

  if (showTwoFactor && pendingUserId) {
    return (
      <TwoFactorVerification
        userId={pendingUserId}
        onVerificationSuccess={handleTwoFactorSuccess}
        onCancel={handleTwoFactorCancel}
      />
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Log in to continue your speech journey</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          ) : 'Log In'}
        </ButtonCustom>
      </form>

      <div className="mt-6 text-center space-y-2">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-pink-600 hover:text-pink-800 text-sm font-medium"
        >
          Need an account? Sign Up
        </button>
        
        <button
          type="button"
          onClick={onSwitchToForgotPassword}
          className="block w-full text-pink-600 hover:text-pink-800 text-sm font-medium"
        >
          Forgot your password?
        </button>
      </div>
    </>
  );
};

export default SignInForm;
