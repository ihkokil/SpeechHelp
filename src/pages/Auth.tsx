
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Import the auth components
import AuthContainer from '@/components/auth/AuthContainer';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

type AuthStep = 'signin' | 'signup' | 'forgot-password' | 'reset-password';

const Auth = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('signin');
  const [authInitialized, setAuthInitialized] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [autoFocusFirstName, setAutoFocusFirstName] = useState(false);
  const { toast } = useToast();

  // Handle form transitions
  const handleSwitchToSignUp = () => {
    setCurrentStep('signup');
  };
  
  const handleSwitchToSignIn = () => {
    setCurrentStep('signin');
    setIsRecoveryFlow(false);
  };

  const handleForgotPassword = () => {
    setCurrentStep('forgot-password');
  };

  const handleBackToSignIn = () => {
    setCurrentStep('signin');
    setIsRecoveryFlow(false);
  };

  const handleCodeSent = (email: string) => {
    setResetEmail(email);
    // Don't automatically switch to reset form - wait for recovery session
    toast({
      title: "Reset link sent",
      description: "Please check your email and click the reset link to continue.",
    });
  };

  const handleBackToForgot = () => {
    setCurrentStep('forgot-password');
  };

  const handleResetSuccess = () => {
    setCurrentStep('signin');
    setResetEmail('');
    setIsRecoveryFlow(false);
  };

  // Check for signup/signin flow and password recovery on component mount
  useEffect(() => {
    const checkFlowType = async () => {
      console.log('Auth: Checking flow type...');
      
      const params = new URLSearchParams(location.search);
      const type = params.get('type');
      
      // Handle password recovery flow
      if (type === 'recovery') {
        console.log('Auth: Password recovery flow detected');
        setIsRecoveryFlow(true);
        
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Auth: Error getting session:', error);
            toast({
              title: "Error",
              description: "There was an issue with the password reset link.",
              variant: "destructive"
            });
            setCurrentStep('signin');
            setIsRecoveryFlow(false);
          } else if (data.session) {
            // User is authenticated via recovery link, show reset form
            console.log('Auth: Recovery session found, showing reset form');
            setCurrentStep('reset-password');
            // Extract email from session if available
            if (data.session.user?.email) {
              setResetEmail(data.session.user.email);
            }
          } else {
            console.log('Auth: No recovery session found');
            toast({
              title: "Invalid or expired link",
              description: "The password reset link is invalid or has expired.",
              variant: "destructive"
            });
            setCurrentStep('signin');
            setIsRecoveryFlow(false);
          }
        } catch (error) {
          console.error('Auth: Recovery flow error:', error);
          setCurrentStep('signin');
          setIsRecoveryFlow(false);
        }
      } else if (params.get('signup') === 'true') {
        console.log('Auth: Signup flow detected');
        setCurrentStep('signup');
        setAutoFocusFirstName(true);
      } else if (params.get('signin') === 'true') {
        console.log('Auth: Signin flow detected');
        setCurrentStep('signin');
      }
      
      setAuthInitialized(true);
    };

    checkFlowType();
  }, [location.search, toast]);

  // Redirect logic - only after auth is initialized and NOT in recovery flow
  useEffect(() => {
    if (!authInitialized || isLoading || isRecoveryFlow) return;
    
    // Only redirect if user is logged in and NOT in recovery flow
    if (user && currentStep !== 'reset-password') {
      console.log('Auth: User is logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate, isLoading, authInitialized, isRecoveryFlow, currentStep]);

  // Show loading state until auth is initialized
  if (isLoading || !authInitialized) {
    return (
      <AuthContainer>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </AuthContainer>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'signup':
        return (
          <SignUpForm 
            onSwitchToSignIn={handleSwitchToSignIn}
            autoFocus={autoFocusFirstName}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBackToSignIn={handleBackToSignIn}
            onCodeSent={handleCodeSent}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordForm
            email={resetEmail}
            onBackToForgot={handleBackToForgot}
            onResetSuccess={handleResetSuccess}
          />
        );
      default:
        return (
          <SignInForm 
            onSwitchToSignUp={handleSwitchToSignUp}
            onForgotPassword={handleForgotPassword}
          />
        );
    }
  };

  return (
    <AuthContainer>
      {renderCurrentStep()}
    </AuthContainer>
  );
};

export default Auth;
