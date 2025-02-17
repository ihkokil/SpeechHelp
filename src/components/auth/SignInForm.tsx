
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

type AuthStep = 'email' | 'password' | 'two-factor';

const SignInForm = ({ 
  onSwitchToSignUp, 
  onSwitchToForgotPassword 
}: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('email');
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [userHas2FA, setUserHas2FA] = useState(false);
  const [isIn2FAFlow, setIsIn2FAFlow] = useState(false); // New flag to track 2FA flow
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkEmailExists = async (email: string) => {
    try {
      console.log('Checking if email exists:', email);
      
      // First attempt to sign in with a dummy password to see if user exists
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy-password-for-email-check'
      });

      // If error is "Invalid login credentials", email exists but password is wrong
      // If error is "User not found", email doesn't exist
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          console.log('Email exists in the system');
          return { exists: true, has2FA: false };
        } else {
          console.log('Email does not exist:', error.message);
          return { exists: false, has2FA: false };
        }
      }

      // If no error, that's unexpected with dummy password
      return { exists: true, has2FA: false };
    } catch (error) {
      console.error('Error checking email:', error);
      return { exists: false, has2FA: false };
    }
  };

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      console.log('=== Validating email ===');
      
      const { exists } = await checkEmailExists(email);
      
      if (exists) {
        console.log('Email validated, proceeding to password step');
        setCurrentStep('password');
        toast({
          title: "Email verified",
          description: "Please enter your password.",
        });
      } else {
        toast({
          title: "Email not found",
          description: "No account found with this email address.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Email validation error:', error);
      toast({
        title: "Validation failed",
        description: "Unable to verify email address.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      console.log('=== Validating password ===');
      
      // Attempt to sign in to validate credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Password validation failed:', signInError);
        toast({
          title: "Invalid password",
          description: "The password you entered is incorrect.",
          variant: "destructive"
        });
        return;
      }

      if (!signInData.user) {
        throw new Error('No user returned from sign in');
      }

      console.log('Password validated, checking 2FA for user:', signInData.user.id);
      
      // Check if 2FA is enabled for this user
      const has2FA = await checkTwoFactorEnabled(signInData.user.id);
      setUserHas2FA(has2FA);
      
      console.log('2FA check result:', has2FA);
      
      if (has2FA) {
        console.log('=== 2FA REQUIRED - Proceeding to verification step ===');
        
        // Set the 2FA flow flag BEFORE signing out
        setIsIn2FAFlow(true);
        
        // Sign out the user since we need 2FA verification first
        await supabase.auth.signOut();
        
        // Store user ID for 2FA verification
        setPendingUserId(signInData.user.id);
        
        // Switch to 2FA step
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
      console.error('=== Password validation error ===', error);
      
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
      
      // Now complete the sign in process
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Final sign in failed:', error);
        throw error;
      }
      
      console.log('Sign in completed successfully after 2FA');
      
      // Reset state
      setCurrentStep('email');
      setPendingUserId(null);
      setUserHas2FA(false);
      setIsIn2FAFlow(false);
      
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
      handleBackToEmail();
    }
  };

  const handleTwoFactorCancel = () => {
    console.log('=== 2FA verification cancelled ===');
    handleBackToEmail();
    toast({
      title: "Login cancelled",
      description: "Two-factor authentication was cancelled.",
    });
  };

  const handleBackToEmail = () => {
    // Only reset if we're not in the 2FA flow
    if (!isIn2FAFlow) {
      setCurrentStep('email');
      setPendingUserId(null);
      setUserHas2FA(false);
      setEmail('');
      setPassword('');
    }
    setIsIn2FAFlow(false);
  };

  const handleBackToPassword = () => {
    setCurrentStep('password');
    setPassword('');
  };

  console.log('=== SignInForm render ===');
  console.log('Current step:', currentStep);
  console.log('Email:', email);
  console.log('Has 2FA:', userHas2FA);
  console.log('Is in 2FA flow:', isIn2FAFlow);
  console.log('Pending user ID:', pendingUserId);

  // Show 2FA verification if we're on that step
  if (currentStep === 'two-factor' && pendingUserId) {
    console.log('=== Rendering 2FA verification component ===');
    return (
      <div className="w-full max-w-md mx-auto">
        <TwoFactorVerification
          userId={pendingUserId}
          onVerificationSuccess={handleTwoFactorSuccess}
          onCancel={handleTwoFactorCancel}
        />
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Log in to continue your speech journey</p>
      </div>
      
      {/* Email Step */}
      {currentStep === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
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
              autoFocus
            />
          </div>

          <ButtonCustom
            type="submit"
            variant="magenta"
            className="w-full py-2"
            disabled={loading || !email}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </span>
            ) : 'Continue'}
          </ButtonCustom>
        </form>
      )}

      {/* Password Step */}
      {currentStep === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-display" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center">
              <input
                id="email-display"
                type="email"
                value={email}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
              <button
                type="button"
                onClick={handleBackToEmail}
                className="ml-2 text-pink-600 hover:text-pink-800 text-sm font-medium"
              >
                Change
              </button>
            </div>
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
              autoFocus
            />
          </div>

          <ButtonCustom
            type="submit"
            variant="magenta"
            className="w-full py-2"
            disabled={loading || !password}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : userHas2FA ? 'Continue to 2FA' : 'Log In'}
          </ButtonCustom>
        </form>
      )}

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
