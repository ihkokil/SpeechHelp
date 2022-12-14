
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthForms } from '@/hooks/use-auth-forms';
import AuthFormContainer from '@/components/auth/AuthFormContainer';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

type AuthPageContentProps = {
  isResetPassword: boolean;
  isForgotPassword: boolean;
  isSignUp: boolean;
  loading: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  onResetPassword: (newPassword: string, confirmPassword: string) => Promise<void>;
  onToggleSignUp: () => void;
  onToggleForgotPassword: () => void;
  onToggleLogin: () => void;
};

const AuthPageContent: React.FC<AuthPageContentProps> = ({
  isResetPassword,
  isForgotPassword,
  isSignUp,
  loading,
  onLogin,
  onSignUp,
  onForgotPassword,
  onResetPassword,
  onToggleSignUp,
  onToggleForgotPassword,
  onToggleLogin,
}) => {
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
            onSubmit={onResetPassword}
            loading={loading}
          />
        ) : isForgotPassword ? (
          <ForgotPasswordForm 
            onSubmit={onForgotPassword}
            loading={loading}
            onToggleLogin={onToggleLogin}
          />
        ) : isSignUp ? (
          <SignUpForm 
            onSubmit={onSignUp}
            loading={loading}
            onToggleLogin={onToggleLogin}
          />
        ) : (
          <LoginForm 
            onSubmit={onLogin}
            loading={loading}
            onToggleSignUp={onToggleSignUp}
            onToggleForgotPassword={onToggleForgotPassword}
          />
        )}
      </AuthFormContainer>
    </div>
  );
};

export default AuthPageContent;
