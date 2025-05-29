
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
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [autoFocusFirstName, setAutoFocusFirstName] = useState(false);

  // Check if the URL contains signup=true or signin=true or hash contains type=recovery
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
    if (!isLoading && user && !isResetPassword) {
      console.log('Auth: User is already logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate, isResetPassword, isLoading]);

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
  if (user && !isResetPassword) {
    return null;
  }

  // Handle form transitions
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
