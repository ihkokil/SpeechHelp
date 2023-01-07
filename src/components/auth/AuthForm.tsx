
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for signup query parameter
  useState(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('signup') === 'true') {
      setIsSignUp(true);
    }

    // Check for password reset hash
    if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      if (hashParams.get('type') === 'recovery') {
        setIsResetPassword(true);
      }
    }
  });

  // Redirect authenticated users
  useState(() => {
    if (user && !isResetPassword) {
      navigate('/dashboard');
    }
  });

  const getFormTitle = () => {
    if (isResetPassword) return 'Reset Your Password';
    if (isForgotPassword) return 'Reset Password';
    return isSignUp ? 'Create an Account' : 'Welcome Back';
  };

  const getFormDescription = () => {
    if (isResetPassword) return 'Enter your new password below';
    if (isForgotPassword) return 'Enter your email to receive a reset link';
    return isSignUp
      ? 'Sign up to start improving your speech'
      : 'Log in to continue your speech journey';
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {getFormTitle()}
          </h1>
          <p className="text-gray-600">
            {getFormDescription()}
          </p>
        </div>

        {isResetPassword ? (
          <ResetPasswordForm />
        ) : isForgotPassword ? (
          <ForgotPasswordForm 
            onBackToLogin={toggleForgotPassword} 
          />
        ) : isSignUp ? (
          <SignUpForm 
            onSwitchToLogin={toggleAuthMode} 
            onForgotPassword={toggleForgotPassword} 
          />
        ) : (
          <LoginForm 
            onSwitchToSignUp={toggleAuthMode} 
            onForgotPassword={toggleForgotPassword} 
          />
        )}
      </div>
    </div>
  );
};

export default AuthForm;
