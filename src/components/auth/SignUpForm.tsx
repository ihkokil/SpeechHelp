
import React, { useState } from 'react';
import AuthFormButton from './AuthFormButton';
import SocialLoginButtons from './SocialLoginButtons';
import { Mail, Lock, User } from 'lucide-react';

type SignUpFormProps = {
  onSubmit: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  loading: boolean;
  onToggleLogin: () => void;
};

const SignUpForm = ({ onSubmit, loading, onToggleLogin }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password, firstName, lastName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              placeholder="John"
            />
          </div>
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            placeholder="Doe"
          />
        </div>
      </div>

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

      <AuthFormButton loading={loading} label="Sign Up" />
      
      <SocialLoginButtons isLoading={loading} className="mt-6" />

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onToggleLogin}
          className="text-pink-600 hover:text-pink-800 text-sm font-medium"
        >
          Already have an account? Log In
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
