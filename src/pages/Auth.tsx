
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [autoFocusFirstName, setAutoFocusFirstName] = useState(false);

  // Handle form transitions
  const handleSwitchToSignUp = () => {
    setCurrentStep('signup');
  };
  
  const handleSwitchToSignIn = () => {
    setCurrentStep('signin');
  };

  const handleForgotPassword = () => {
    setCurrentStep('forgot-password');
  };

  const handleBackToSignIn = () => {
    setCurrentStep('signin');
  };

  const handleCodeSent = (email: string) => {
    setResetEmail(email);
    setCurrentStep('reset-password');
  };

  const handleBackToForgot = () => {
    setCurrentStep('forgot-password');
  };

  const handleResetSuccess = () => {
    setCurrentStep('signin');
    setResetEmail('');
  };

  // Check for signup/signin flow on component mount
  useEffect(() => {
    const checkFlowType = () => {
      console.log('Auth: Checking flow type...');
      
      const params = new URLSearchParams(location.search);
      
      if (params.get('signup') === 'true') {
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
  }, [location.search]);

  // Redirect logic - only after auth is initialized
  useEffect(() => {
    if (!authInitialized || isLoading) return;
    
    // Redirect if user is logged in
    if (user) {
      console.log('Auth: User is logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate, isLoading, authInitialized]);

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
