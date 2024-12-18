
import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import AdminAuthLayout from '@/components/admin/auth/AdminAuthLayout';
import AdminAuthForm from '@/components/admin/auth/AdminAuthForm';

const AdminAuth = () => {
  const { isAuthenticated, isLoading, signIn, verify2FA, requestPasswordReset } = useAdminAuth();
  const [needs2FA, setNeeds2FA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmitLogin = async (data: { username: string; password: string }) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      console.log(`Attempting to sign in with username: ${data.username}`);
      const result = await signIn(data.username, data.password);
      console.log('Sign in result:', result);
      
      if (result.success && result.requires2FA) {
        setNeeds2FA(true);
      } else if (result.success) {
        const username = result.user?.username || data.username;
        toast({
          title: "Login successful",
          description: `Welcome back, ${username}!`,
        });
      } else if (!result.success) {
        setLoginError(result.error || 'Invalid credentials');
        toast({
          title: "Login failed",
          description: result.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred');
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const onSubmitTwoFactor = async (data: { code: string }) => {
    setIsSubmitting(true);
    
    try {
      await verify2FA(data.code);
    } catch (error) {
      console.error('Two-factor verification error:', error);
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const onSubmitForgotPassword = async (data: { email: string }) => {
    setIsSubmitting(true);
    
    try {
      const result = await requestPasswordReset(data.email);
      
      if (!result.success) {
        toast({
          title: "Password reset failed",
          description: result.error || "Unable to process your request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <AdminAuthLayout>
      <AdminAuthForm
        needs2FA={needs2FA}
        setNeeds2FA={setNeeds2FA}
        onSubmitLogin={onSubmitLogin}
        onSubmitTwoFactor={onSubmitTwoFactor}
        onSubmitForgotPassword={onSubmitForgotPassword}
        isSubmitting={isSubmitting}
        loginError={loginError}
      />
    </AdminAuthLayout>
  );
};

export default AdminAuth;
