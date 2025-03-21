
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
  const [authInitialized, setAuthInitialized] = useState(false);
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

  // Check for password reset flow on component mount
  useEffect(() => {
    const checkForPasswordReset = async () => {
      const params = new URLSearchParams(location.search);
      
      // Check URL hash for recovery tokens (this is where Supabase puts them)
      let isPasswordReset = false;
      
      if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log('Auth: Hash params detected:', { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
        
        if (type === 'recovery' && accessToken && refreshToken) {
          console.log('Auth: Password reset flow detected from hash');
          isPasswordReset = true;
          
          // Set the session manually to ensure user is logged in for password update
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error('Error setting session:', error);
            } else {
              console.log('Session set successfully for password reset');
            }
          } catch (err) {
            console.error('Error in setSession:', err);
          }
        }
      }
      
      // Also check search params as fallback
      const searchType = params.get('type');
      if (searchType === 'recovery') {
        console.log('Auth: Password reset flow detected from search params');
        isPasswordReset = true;
      }
      
      if (isPasswordReset) {
        console.log('Auth: Setting reset password state to true');
        setIsResetPassword(true);
        setIsSignUp(false);
        setIsForgotPassword(false);
        setAuthInitialized(true);
        return;
      }
      
      // Handle other flows
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
      
      setAuthInitialized(true);
    };

    checkForPasswordReset();
  }, [location.search, location.hash]);

  // Redirect logic - only after auth is initialized and not in password reset flow
  useEffect(() => {
    if (!authInitialized || isLoading) return;
    
    // Never redirect during password reset flow
    if (isResetPassword) {
      console.log('Auth: In password reset flow, not redirecting');
      return;
    }
    
    // Check if we have recovery tokens in URL
    const hasRecoveryTokens = location.hash.includes('type=recovery') && 
                              location.hash.includes('access_token') && 
                              location.hash.includes('refresh_token');
    
    if (hasRecoveryTokens) {
      console.log('Auth: Recovery tokens detected, not redirecting');
      return;
    }
    
    // Redirect if user is logged in and not in any special flow
    if (user && !isResetPassword && !isForgotPassword) {
      console.log('Auth: User is logged in and not in special flow, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate, isLoading, authInitialized, isResetPassword, isForgotPassword, location.hash]);

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

  // Check if we should show reset form
  const hasRecoveryTokens = location.hash.includes('type=recovery') && 
                            location.hash.includes('access_token') && 
                            location.hash.includes('refresh_token');
  
  const shouldShowResetForm = isResetPassword || hasRecoveryTokens;
  
  console.log('Auth: Rendering auth forms:', { 
    isResetPassword, 
    hasRecoveryTokens, 
    shouldShowResetForm,
    user: !!user,
    authInitialized 
  });

  return (
    <AuthContainer>
      {shouldShowResetForm ? (
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
