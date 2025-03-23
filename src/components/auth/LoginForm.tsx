
import React, { useState } from 'react';
import AuthFormButton from './AuthFormButton';
import { Mail, Lock } from 'lucide-react';

type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  onToggleSignUp: () => void;
  onToggleForgotPassword: () => void;
};

const LoginForm = ({ 
  onSubmit, 
  loading, 
  onToggleSignUp, 
  onToggleForgotPassword 
}: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || loading) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(email, password);
      // Redirect will be handled by the Auth component or useAuthForms
    } catch (error) {
      console.error('Login form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combined loading state to prevent double submissions
  const isButtonDisabled = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            placeholder="your@email.com"
            disabled={isButtonDisabled}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            placeholder="••••••••"
            minLength={6}
            disabled={isButtonDisabled}
          />
        </div>
      </div>

      <AuthFormButton loading={isButtonDisabled} label="Log In" />

      <div className="mt-6 text-center space-y-2">
        <button
          type="button"
          onClick={onToggleSignUp}
          className="text-pink-600 hover:text-pink-800 text-sm font-medium"
          disabled={isButtonDisabled}
        >
          Need an account? Sign Up
        </button>
        
        <button
          type="button"
          onClick={onToggleForgotPassword}
          className="block w-full text-pink-600 hover:text-pink-800 text-sm font-medium"
          disabled={isButtonDisabled}
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
