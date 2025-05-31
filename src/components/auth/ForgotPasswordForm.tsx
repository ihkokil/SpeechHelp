
import { useState } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, just show a message that password reset is not available
      toast({
        title: "Feature not available",
        description: "Password reset functionality is currently not available. Please contact support for assistance.",
        variant: "destructive"
      });
      
      // Clear the form
      setEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
        <p className="text-gray-600">Enter your email address and we'll send you a secure link to reset your password</p>
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
            <span className="flex items-center justify-center">
              Send Reset Link
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </ButtonCustom>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="inline-flex items-center text-pink-600 hover:text-pink-800 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </button>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
