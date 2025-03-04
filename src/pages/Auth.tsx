
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Import the new components
import AuthContainer from '@/components/auth/AuthContainer';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [autoFocusFirstName, setAutoFocusFirstName] = useState(false);

  // Check for URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    console.log('Auth: URL change detected:', { 
      pathname: location.pathname, 
      search: location.search,
      fullUrl: window.location.href
    });
    
    if (params.get('signup') === 'true') {
      console.log('Auth: Signup flow detected');
      setIsSignUp(true);
      setAutoFocusFirstName(true);
    } else if (params.get('signin') === 'true') {
      console.log('Auth: Signin flow detected');
      setIsSignUp(false);
    }
  }, [location]);

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
    return null;
  }

  // Handle form transitions
  const handleSwitchToSignUp = () => {
    setIsSignUp(true);
    setIsForgotPassword(false);
  };
  
  const handleSwitchToSignIn = () => {
    setIsSignUp(false);
    setIsForgotPassword(false);
  };
  
  const handleSwitchToForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignUp(false);
  };
  
  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
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
