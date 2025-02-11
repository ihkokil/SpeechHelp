
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

type AuthStep = 'credentials' | 'two-factor';

const SignInForm = ({ 
  onSwitchToSignUp, 
  onSwitchToForgotPassword 
}: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('credentials');
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingCredentials, setPendingCredentials] = useState<{email: string, password: string} | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkTwoFactorEnabled = async (userId: string): Promise<boolean> => {
    try {
      console.log('Checking 2FA status for user:', userId);
      
      const { data, error } = await supabase
        .from('user_2fa')
        .select('is_enabled, secret_key')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('2FA check result:', { data, error, userId });

      if (error) {
        console.error('Error checking 2FA status:', error);
        return false;
      }

      const isEnabled = data?.is_enabled === true && Boolean(data?.secret_key);
      console.log('2FA enabled status:', isEnabled);
      
      return isEnabled;
    } catch (error) {
      console.error('Exception checking 2FA status:', error);
      return false;
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('=== Starting sign in process ===');
      console.log('Email:', email);
      
      // First, attempt to sign in to validate credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Sign in failed:', signInError);
        throw signInError;
      }

      if (!signInData.user) {
        throw new Error('No user returned from sign in');
      }

      console.log('Credentials validated, checking 2FA for user:', signInData.user.id);
      
      // Check if 2FA is enabled for this user
      const has2FA = await checkTwoFactorEnabled(signInData.user.id);
      
      console.log('2FA check result:', has2FA);
      
      if (has2FA) {
        console.log('=== 2FA REQUIRED - Signing out and showing verification step ===');
        
        // Sign out the user since we need 2FA verification first
        await supabase.auth.signOut();
        
        // Store credentials for later use
        setPendingCredentials({ email, password });
        
        // Set up 2FA verification
        setPendingUserId(signInData.user.id);
        setCurrentStep('two-factor');
        
        toast({
          title: "Two-factor authentication required",
          description: "Please enter your verification code to continue.",
        });
      } else {
        console.log('=== No 2FA required - User is now logged in ===');
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Navigate to dashboard since user is already signed in
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('=== Sign in error ===', error);
      
      // Make sure to sign out in case of error
      await supabase.auth.signOut();
      
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSuccess = async () => {
    try {
      console.log('=== 2FA verification successful, completing sign in ===');
      
      if (!pendingCredentials) {
        throw new Error('No pending credentials found');
      }
      
      // Now complete the sign in process
      const { data, error } = await supabase.auth.signInWithPassword({
        email: pendingCredentials.email,
        password: pendingCredentials.password,
      });

      if (error) {
        console.error('Final sign in failed:', error);
        throw error;
      }
      
      console.log('Sign in completed successfully after 2FA');
      
      // Reset state
      setCurrentStep('credentials');
      setPendingUserId(null);
      setPendingCredentials(null);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error completing sign in after 2FA:', error);
      toast({
        title: "Login failed",
        description: "Failed to complete sign in after verification.",
        variant: "destructive"
      });
      // Reset to credentials step on error
      setCurrentStep('credentials');
      setPendingUserId(null);
      setPendingCredentials(null);
    }
  };

  const handleTwoFactorCancel = () => {
    console.log('=== 2FA verification cancelled ===');
    setCurrentStep('credentials');
    setPendingUserId(null);
    setPendingCredentials(null);
    toast({
      title: "Login cancelled",
      description: "Two-factor authentication was cancelled.",
    });
  };

  // Show 2FA verification if we're on that step
  if (currentStep === 'two-factor' && pendingUserId) {
    console.log('Rendering 2FA verification for user:', pendingUserId);
    return (
      <div className="max-w-md mx-auto">
        <TwoFactorVerification
          userId={pendingUserId}
          onVerificationSuccess={handleTwoFactorSuccess}
          onCancel={handleTwoFactorCancel}
        />
      </div>
    );
  }

  // Show credentials form
  console.log('Rendering credentials form, current step:', currentStep);
  
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Log in to continue your speech journey</p>
      </div>
      
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
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
              Verifying...
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
