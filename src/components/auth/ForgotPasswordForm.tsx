
import { useState } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
  onCodeSent: (email: string) => void;
}

const ForgotPasswordForm = ({ onBackToSignIn, onCodeSent }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      onCodeSent(email);

    } catch (error: any) {
      console.error('Password reset request error:', error);
      toast({
        title: "Error",
        description: "Failed to send reset link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Check Your Email</h1>
          <p className="text-gray-600">
            We've sent a password reset link to <span className="font-semibold">{email}</span>
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Mail className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Email sent successfully
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Click the link in your email to reset your password. The link will expire in 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="text-pink-600 hover:text-pink-800 text-sm font-semibold transition-colors"
              >
                Try a different email
              </button>
              
              <button
                type="button"
                onClick={onBackToSignIn}
                className="text-pink-600 hover:text-pink-800 font-semibold transition-colors inline-flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h1>
        <p className="text-gray-600">Enter your email to receive a password reset link</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email Address
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              placeholder="Enter your email address"
              autoFocus
            />
          </div>
        </div>

        <ButtonCustom
          type="submit"
          variant="magenta"
          className="w-full py-3 font-semibold"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Reset Link...
            </span>
          ) : (
            "Send Reset Link"
          )}
        </ButtonCustom>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToSignIn}
            className="text-pink-600 hover:text-pink-800 font-semibold transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Sign In
          </button>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
