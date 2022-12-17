
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAuthForms } from '@/hooks/use-auth-forms';
import AuthPageContent from '@/components/auth/AuthPageContent';
import AuthUrlHandler from '@/components/auth/AuthUrlHandler';

const Auth = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    isSignUp,
    setIsSignUp,
    loading,
    isForgotPassword,
    setIsForgotPassword,
    isResetPassword,
    setIsResetPassword,
    handleLogin,
    handleSignUp,
    handleForgotPassword,
    handleResetPassword
  } = useAuthForms();

  // Enhanced redirection logic to ensure users get to the dashboard after authentication
  useEffect(() => {
    if (user && !isLoading && !isResetPassword) {
      console.log("Authenticated user detected, redirecting to dashboard");
      // Use immediate redirect for better user experience
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, isLoading, isResetPassword]);

  return (
    <>
      <AuthUrlHandler 
        onSetSignUp={setIsSignUp}
        onSetResetPassword={setIsResetPassword}
      />
      
      <AuthPageContent
        isResetPassword={isResetPassword}
        isForgotPassword={isForgotPassword}
        isSignUp={isSignUp}
        loading={loading}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onForgotPassword={handleForgotPassword}
        onResetPassword={handleResetPassword}
        onToggleSignUp={() => setIsSignUp(true)}
        onToggleForgotPassword={() => setIsForgotPassword(true)}
        onToggleLogin={() => {
          setIsSignUp(false);
          setIsForgotPassword(false);
        }}
      />
    </>
  );
};

export default Auth;
