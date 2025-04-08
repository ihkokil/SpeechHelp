import { useState } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
  onCodeSent: (email: string) => void;
}

const ForgotPasswordForm = ({ onBackToSignIn, onCodeSent }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First check if email exists by calling our edge function
      const { data, error: functionError } = await supabase.functions.invoke('send-password-reset', {
        body: { email }
      });

      if (functionError) {
        throw new Error('Failed to send reset email. Please try again.');
      }

      // Also use Supabase's built-in password reset for the actual email sending
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (supabaseError) {
        // Check if it's a user not found error
        if (supabaseError.message.includes('User not found') || supabaseError.message.includes('Invalid email')) {
          setError('No account found with this email address.');
          toast({
            title: "Email not found",
            description: "No account found with this email address.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        throw supabaseError;
      }

      setEmailSent(true);
      onCodeSent(email);
      toast({
        title: "Reset link sent",
        description: "Please check your email for the password reset link.",
      });

    } catch (error: any) {
      console.error('Password reset request error:', error);
      setError(error.message || 'Failed to send reset link. Please try again.');
      toast({
        title: "Error",
        description: error.message || "Failed to send reset link. Please try again.",
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
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
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
            <button
              type="button"
              onClick={() => {
                setEmailSent(false);
                setEmail('');
                setError(null);
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
      </>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h1>
        <p className="text-gray-600">Enter your email to receive a password reset link</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
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
