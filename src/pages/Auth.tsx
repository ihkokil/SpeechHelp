
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Import the new components
import AuthContainer from '@/components/auth/AuthContainer';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isRecoveryFlowDetected, setIsRecoveryFlowDetected] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [autoFocusFirstName, setAutoFocusFirstName] = useState(false);

  // Simplified function to detect recovery flow
  const detectRecoveryFlow = () => {
    const fullUrl = window.location.href;
    console.log('Auth: Checking for recovery flow in URL:', fullUrl);
    
    // Check if URL contains recovery indicators
    const hasRecoveryType = fullUrl.includes('type=recovery');
    const hasAccessToken = fullUrl.includes('access_token=');
    
    console.log('Auth: Recovery indicators:', { hasRecoveryType, hasAccessToken });
    
    return hasRecoveryType;
  };

  // Check for password reset flow FIRST - this must happen before any other logic
  useEffect(() => {
    const isRecoveryFlow = detectRecoveryFlow();
    console.log('Auth: Initial recovery flow check:', isRecoveryFlow);
    
    if (isRecoveryFlow) {
      console.log('Auth: Recovery flow detected, setting reset password mode');
      setIsResetPassword(true);
      setIsRecoveryFlowDetected(true);
      setIsSignUp(false);
      setIsForgotPassword(false);
    } else {
      setIsRecoveryFlowDetected(false);
    }
  }, []); // Only run once on mount

  // Check for other URL parameters only if not in recovery flow
  useEffect(() => {
    if (isRecoveryFlowDetected) {
      return; // Skip if we're in recovery flow
    }

    const params = new URLSearchParams(location.search);
    
    console.log('Auth: URL change detected:', { 
      pathname: location.pathname, 
      search: location.search, 
      hash: location.hash,
      fullUrl: window.location.href
    });
    
    // Check for recovery flow again on URL changes
    if (detectRecoveryFlow()) {
      console.log('Auth: Recovery flow detected on URL change, setting reset password mode');
      setIsResetPassword(true);
      setIsRecoveryFlowDetected(true);
      setIsSignUp(false);
      setIsForgotPassword(false);
      return;
    }
    
    // Check for signup/signin params only if not in recovery flow
    if (params.get('signup') === 'true') {
      console.log('Auth: Signup flow detected');
      setIsSignUp(true);
      setAutoFocusFirstName(true);
    } else if (params.get('signin') === 'true') {
      console.log('Auth: Signin flow detected');
      setIsSignUp(false);
    }
  }, [location, isRecoveryFlowDetected]);

  // Only redirect if user is logged in AND it's not a password reset flow AND recovery flow is not detected
  useEffect(() => {
    if (!isLoading && user && !isResetPassword && !isRecoveryFlowDetected) {
      console.log('Auth: User is logged in and not in reset flow, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate, isResetPassword, isLoading, isRecoveryFlowDetected]);

  // Show loading state (but not during reset flow as it has its own loading)
  if (isLoading && !isResetPassword && !isRecoveryFlowDetected) {
    return (
      <AuthContainer>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </AuthContainer>
    );
  }

  // Don't render anything if user is logged in and not in reset flow (will redirect)
  if (user && !isResetPassword && !isRecoveryFlowDetected) {
    return null;
  }

  // Handle form transitions
  const handleSwitchToSignUp = () => {
    setIsSignUp(true);
    setIsResetPassword(false);
    setIsForgotPassword(false);
  };
  
  const handleSwitchToSignIn = () => {
    setIsSignUp(false);
    setIsResetPassword(false);
    setIsForgotPassword(false);
  };
  
  const handleSwitchToForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignUp(false);
    setIsResetPassword(false);
  };
  
  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
    setIsResetPassword(false);
  };

  return (
    <AuthContainer>
      {isResetPassword || isRecoveryFlowDetected ? (
        <ResetPasswordForm />
      ) : isForgotPassword ? (
        <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
      ) : isSignUp ? (
        <SignUpForm 
          onSwitchToSignIn={handleSwitchToSignIn} 
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
          autoFocus={autoFocusFirstName}
        />
      ) : (
        <SignInForm 
          onSwitchToSignUp={handleSwitchToSignUp} 
          onSwitchToForgotPassword={handleSwitchToForgotPassword} 
        />
      )}
    </AuthContainer>
  );
};

export default Auth;
