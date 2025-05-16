
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
  const [justSignedUp, setJustSignedUp] = useState(false);
  const { user } = useAuth();
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
    } else if (params.get('just_signed_up') === 'true') {
      setJustSignedUp(true);
      setIsSignUp(false);
      toast({
        title: "Sign up successful",
        description: "Please log in with your new credentials",
      });
    }

    // Check for password reset flow
    if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      if (hashParams.get('type') === 'recovery') {
        setIsResetPassword(true);
      }
    }
  }, [location, toast]);

  // Redirect if already logged in (except for reset password flow)
  useEffect(() => {
    if (user && !isResetPassword && !justSignedUp) {
      navigate('/dashboard');
    }
  }, [user, navigate, isResetPassword, justSignedUp]);

  // Handle form transitions
  const handleSwitchToSignUp = () => setIsSignUp(true);
  const handleSwitchToSignIn = () => setIsSignUp(false);
  const handleSwitchToForgotPassword = () => setIsForgotPassword(true);
  const handleBackToLogin = () => setIsForgotPassword(false);

  // Handle successful signup
  const handleSuccessfulSignUp = () => {
    navigate('/auth?just_signed_up=true');
  };

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
          onSuccessfulSignUp={handleSuccessfulSignUp}
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
