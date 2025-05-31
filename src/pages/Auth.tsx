
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

// Import the auth components
import AuthContainer from '@/components/auth/AuthContainer';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [autoFocusFirstName, setAutoFocusFirstName] = useState(false);

  // Handle form transitions
  const handleSwitchToSignUp = () => {
    setIsSignUp(true);
    setIsForgotPassword(false);
    setIsResetPassword(false);
  };
  
  const handleSwitchToSignIn = () => {
    setIsSignUp(false);
    setIsForgotPassword(false);
    setIsResetPassword(false);
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

  // Check URL parameters for specific flows
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Check for password reset flow first
    if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      if (hashParams.get('type') === 'recovery') {
        console.log('Auth: Password reset flow detected');
        setIsResetPassword(true);
        setIsSignUp(false);
        setIsForgotPassword(false);
        return;
      }
    }
    
    if (params.get('signup') === 'true') {
      console.log('Auth: Signup flow detected');
      setIsSignUp(true);
      setAutoFocusFirstName(true);
      setIsForgotPassword(false);
      setIsResetPassword(false);
    } else if (params.get('signin') === 'true') {
      console.log('Auth: Signin flow detected');
      setIsSignUp(false);
      setIsForgotPassword(false);
      setIsResetPassword(false);
    } else {
      // Default to sign in if no specific flow detected
      console.log('Auth: No specific flow detected, defaulting to sign in');
      setIsSignUp(false);
      setIsForgotPassword(false);
      setIsResetPassword(false);
    }
  }, [location.search, location.hash]);

  // Redirect if user is logged in
  useEffect(() => {
    if (!isLoading && user) {
      console.log('Auth: User is logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <AuthContainer>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </AuthContainer>
    );
  }

  // Don't render anything if user is logged in (will redirect)
  if (user) {
    console.log('Auth: User logged in, rendering null (will redirect)');
    return null;
  }

  console.log('Auth: Rendering main auth forms');
  return (
    <AuthContainer>
      {isResetPassword ? (
        <ResetPasswordForm onBackToLogin={handleBackToLogin} />
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
