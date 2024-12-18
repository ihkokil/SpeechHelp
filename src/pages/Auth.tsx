
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

import AuthContainer from '@/components/auth/AuthContainer';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [autoFocusFirstName, setAutoFocusFirstName] = useState(false);

  // Check URL parameters for form state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'true') {
      setIsSignUp(true);
      setAutoFocusFirstName(true);
    } else if (params.get('signin') === 'true') {
      setIsSignUp(false);
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
      navigate('/dashboard');
    }
  }, [user, navigate, isResetPassword]);

  // Form transition handlers
  const handleSwitchToSignUp = () => setIsSignUp(true);
  const handleSwitchToSignIn = () => setIsSignUp(false);
  const handleSwitchToForgotPassword = () => setIsForgotPassword(true);
  const handleBackToLogin = () => setIsForgotPassword(false);

  return (
    <AuthContainer>
      {isResetPassword ? (
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
