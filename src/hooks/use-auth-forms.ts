
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAuthForms = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return {
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
  };
};
