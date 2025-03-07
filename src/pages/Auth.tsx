
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Import the auth components
import AuthContainer from '@/components/auth/AuthContainer';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import PasswordResetForm from '@/components/auth/PasswordResetForm';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [autoFocusFirstName, setAutoFocusFirstName] = useState(false);

  // Check for URL parameters - this needs to run first to prevent redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hash = window.location.hash;
    const hashParams = new URLSearchParams(hash.substring(1));
    
    console.log('Auth: URL change detected:', { 
      pathname: location.pathname, 
      search: location.search,
      hash: hash,
      fullUrl: window.location.href
    });
    
    // Check if this is a password reset link - prioritize URL params over hash
    const type = params.get('type') || hashParams.get('type');
    const access_token = params.get('access_token') || hashParams.get('access_token');
    const refresh_token = params.get('refresh_token') || hashParams.get('refresh_token');
    
    // Handle password reset flow FIRST - this takes priority
    if (type === 'recovery' && access_token && refresh_token) {
      console.log('Auth: Password reset flow detected');
      setIsPasswordReset(true);
      setIsSignUp(false);
      setIsForgotPassword(false);
      return; // Exit early to prevent other flows
    }
    
    // Only check other flows if it's not a password reset
    if (params.get('signup') === 'true') {
      console.log('Auth: Signup flow detected');
      setIsSignUp(true);
      setAutoFocusFirstName(true);
      setIsPasswordReset(false);
      setIsForgotPassword(false);
    } else if (params.get('signin') === 'true') {
      console.log('Auth: Signin flow detected');
      setIsSignUp(false);
      setIsPasswordReset(false);
      setIsForgotPassword(false);
    }
  }, [location]);

  // Redirect if user is logged in - but NOT during password reset
  useEffect(() => {
    // Don't redirect during password reset flow
    if (isPasswordReset) {
      console.log('Auth: Password reset in progress, not redirecting');
      return;
    }
    
    if (!isLoading && user) {
      console.log('Auth: User is logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate, isLoading, isPasswordReset]);

  // Show loading state
  if (isLoading && !isPasswordReset) {
    return (
      <AuthContainer>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </AuthContainer>
    );
  }

  // For password reset, always show the form regardless of user state
  if (isPasswordReset) {
    return (
      <AuthContainer>
        <PasswordResetForm onBackToLogin={handleBackToLogin} />
      </AuthContainer>
    );
  }

  // Don't render anything if user is logged in (will redirect)
  if (user) {
    return null;
  }

  // Handle form transitions
  const handleSwitchToSignUp = () => {
    setIsSignUp(true);
    setIsForgotPassword(false);
    setIsPasswordReset(false);
  };
  
  const handleSwitchToSignIn = () => {
    setIsSignUp(false);
    setIsForgotPassword(false);
    setIsPasswordReset(false);
  };
  
  const handleSwitchToForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignUp(false);
    setIsPasswordReset(false);
  };
  
  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
    setIsPasswordReset(false);
  };

  return (
    <AuthContainer>
      {isForgotPassword ? (
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
