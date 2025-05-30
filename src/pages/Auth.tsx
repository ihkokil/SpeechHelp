
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Import the auth components
import AuthContainer from '@/components/auth/AuthContainer';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import OTPVerificationForm from '@/components/auth/OTPVerificationForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOTPVerification, setIsOTPVerification] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [autoFocusFirstName, setAutoFocusFirstName] = useState(false);

  // Check for password reset flow
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hash = location.hash;
    
    console.log('Auth: Checking URL params and hash:', { params: params.toString(), hash });
    
    // Check for recovery flow in hash - this takes priority
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      
      console.log('Auth: Hash params - type:', type, 'has access_token:', !!accessToken);
      
      if (type === 'recovery' && accessToken) {
        console.log('Auth: Password recovery flow detected - setting reset password mode');
        setIsResetPassword(true);
        setIsSignUp(false);
        setIsForgotPassword(false);
        setIsOTPVerification(false);
        return; // Don't check other conditions if this is a recovery flow
      }
    }
    
    // Check for signup/signin params only if not in recovery flow
    if (!isResetPassword) {
      if (params.get('signup') === 'true') {
        console.log('Auth: Signup flow detected');
        setIsSignUp(true);
        setAutoFocusFirstName(true);
      } else if (params.get('signin') === 'true') {
        console.log('Auth: Signin flow detected');
        setIsSignUp(false);
      }
    }
  }, [location, isResetPassword]);

  // Only redirect if user is logged in AND it's not a password reset flow
  useEffect(() => {
    if (!isLoading && user && !isResetPassword) {
      console.log('Auth: User is logged in and not in reset flow, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate, isResetPassword, isLoading]);

  // Show loading state
  if (isLoading && !isResetPassword) {
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
  if (user && !isResetPassword) {
    return null;
  }

  // Handle form transitions
  const handleSwitchToSignUp = () => {
    setIsSignUp(true);
    setIsResetPassword(false);
    setIsForgotPassword(false);
    setIsOTPVerification(false);
  };
  
  const handleSwitchToSignIn = () => {
    setIsSignUp(false);
    setIsResetPassword(false);
    setIsForgotPassword(false);
    setIsOTPVerification(false);
  };
  
  const handleSwitchToForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignUp(false);
    setIsResetPassword(false);
    setIsOTPVerification(false);
  };
  
  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
    setIsResetPassword(false);
    setIsOTPVerification(false);
    setResetEmail('');
  };

  const handleOTPSent = (email: string) => {
    setResetEmail(email);
    setIsForgotPassword(false);
    setIsOTPVerification(true);
  };

  const handleBackToForgotPassword = () => {
    setIsOTPVerification(false);
    setIsForgotPassword(true);
  };

  const handleOTPSuccess = () => {
    setIsOTPVerification(false);
    setResetEmail('');
    
    toast({
      title: "Password reset complete",
      description: "You can now sign in with your new password.",
    });
    
    // Redirect to sign in
    setTimeout(() => {
      handleSwitchToSignIn();
    }, 1000);
  };

  return (
    <AuthContainer>
      {isResetPassword ? (
        <ResetPasswordForm />
      ) : isOTPVerification ? (
        <OTPVerificationForm 
          email={resetEmail}
          onBackToForgotPassword={handleBackToForgotPassword}
          onSuccess={handleOTPSuccess}
        />
      ) : isForgotPassword ? (
        <ForgotPasswordForm 
          onBackToLogin={handleBackToLogin}
          onOTPSent={handleOTPSent}
        />
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
