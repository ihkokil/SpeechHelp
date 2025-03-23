
import React, { useState } from 'react';
import AuthFormButton from './AuthFormButton';
import { Mail } from 'lucide-react';

type ForgotPasswordFormProps = {
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
  onToggleLogin: () => void;
};

const ForgotPasswordForm = ({ onSubmit, loading, onToggleLogin }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email);
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

      <AuthFormButton loading={loading} label="Send Reset Link" />

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onToggleLogin}
          className="text-pink-600 hover:text-pink-800 text-sm font-medium"
        >
          Back to login
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
