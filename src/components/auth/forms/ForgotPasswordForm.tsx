
import React, { useState } from 'react';
import { resetPassword } from '@/services/authService';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email, toast);
      setEmailSent(true);
    } catch (error: any) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent password reset instructions to <span className="font-medium">{email}</span>
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center py-2 text-pink-600 hover:text-pink-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
        <p className="text-gray-600">
          Enter your email address and we'll send you instructions to reset your password
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <ButtonCustom
          type="submit"
          variant="magenta"
          className="w-full py-3 text-lg font-medium"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Instructions...
            </span>
          ) : 'Send Reset Instructions'}
        </ButtonCustom>
      </form>

      <div className="mt-6">
        <button
          type="button"
          onClick={onBackToLogin}
          className="w-full flex items-center justify-center py-2 text-pink-600 hover:text-pink-800 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </button>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
