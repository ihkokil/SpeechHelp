
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AuthFormContainer from '@/components/auth/AuthFormContainer';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { signIn, signUp, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'true') {
      setIsSignUp(true);
    }

    if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      if (hashParams.get('type') === 'recovery') {
        setIsResetPassword(true);
      }
    }
  }, [location]);

  useEffect(() => {
    if (user && !isLoading && !isResetPassword) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, isLoading, isResetPassword]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    try {
      if (!firstName.trim() || !lastName.trim()) {
        toast({
          title: "Missing information",
          description: "Please provide both first and last name.",
          variant: "destructive"
        });
        return;
      }
      
      await signUp(email, password, firstName, lastName);
    } catch (error: any) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link.",
      });
      setIsForgotPassword(false);
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred during password reset",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (newPassword: string, confirmPassword: string) => {
    setLoading(true);
    try {
      if (newPassword !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully. You can now log in with your new password.",
      });

      setIsResetPassword(false);
    } catch (error: any) {
      console.error('Password update error:', error);
      toast({
        title: "Password update failed",
        description: error.message || "An error occurred during password update",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAuthFormTitle = () => {
    if (isResetPassword) return 'Reset Your Password';
    if (isForgotPassword) return 'Reset Password';
    return isSignUp ? 'Create an Account' : 'Welcome Back';
  };

  const getAuthFormDescription = () => {
    if (isResetPassword) return 'Enter your new password below';
    if (isForgotPassword) return 'Enter your email to receive a reset link';
    return isSignUp 
      ? 'Sign up to start improving your speech' 
      : 'Log in to continue your speech journey';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 p-4">
      <AuthFormContainer 
        title={getAuthFormTitle()} 
        description={getAuthFormDescription()}
      >
        {isResetPassword ? (
          <ResetPasswordForm 
            onSubmit={handleResetPassword}
            loading={loading}
          />
        ) : isForgotPassword ? (
          <ForgotPasswordForm 
            onSubmit={handleForgotPassword}
            loading={loading}
            onToggleLogin={() => setIsForgotPassword(false)}
          />
        ) : isSignUp ? (
          <SignUpForm 
            onSubmit={handleSignUp}
            loading={loading}
            onToggleLogin={() => setIsSignUp(false)}
          />
        ) : (
          <LoginForm 
            onSubmit={handleLogin}
            loading={loading}
            onToggleSignUp={() => setIsSignUp(true)}
            onToggleForgotPassword={() => setIsForgotPassword(true)}
          />
        )}
      </AuthFormContainer>
    </div>
  );
};

export default Auth;
