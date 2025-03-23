
import React, { useState } from 'react';
import AuthFormButton from './AuthFormButton';
import SocialLoginButtons from './SocialLoginButtons';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

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
          />
        </div>
      </div>

      <AuthFormButton loading={loading} label="Log In" />
      
      <SocialLoginButtons isLoading={loading} className="mt-6" />

      <div className="mt-6 text-center space-y-2">
        <button
          type="button"
          onClick={onToggleSignUp}
          className="text-pink-600 hover:text-pink-800 text-sm font-medium"
        >
          Need an account? Sign Up
        </button>
        
        <button
          type="button"
          onClick={onToggleForgotPassword}
          className="block w-full text-pink-600 hover:text-pink-800 text-sm font-medium"
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
