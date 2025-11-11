
import { useState } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TwoFactorVerification from './TwoFactorVerification';
import { verifyEmail, verifyPassword, verify2FA, completeLogin, resendConfirmationEmail } from '@/services/authService';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
}

const SignInForm = ({ onSwitchToSignUp, onForgotPassword }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'password' | '2fa' | 'email_confirmation'>('email');
  const [userId, setUserId] = useState('');
  const [has2FA, setHas2FA] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await verifyEmail(email, toast);
    
    if (result.success && result.userExists) {
      setHas2FA(result.has2FA || false);
      setUserId(result.userId || '');
      setStep('password');
    }
    
    setLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await verifyPassword(email, password, toast);
    
    if (result.success) {
      if (has2FA) {
        setStep('2fa');
      } else {
        // Complete login for users without 2FA
        const loginResult = await completeLogin(email, password, toast);
        if (loginResult.success) {
          await refreshUser();
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
        }
      }
    } else if (result.error === "email_not_confirmed") {
      setConfirmationMessage(result.message || "Please confirm your email address before signing in.");
      setStep('email_confirmation');
    }
    
    setLoading(false);
  };

  const handle2FASuccess = async () => {
    setLoading(true);
    
    const loginResult = await completeLogin(email, password, toast);
    if (loginResult.success) {
      await refreshUser();
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    }
    
    setLoading(false);
  };

  const handle2FACancel = () => {
    setStep('password');
  };

  const handleBackToEmail = () => {
    setStep('email');
    setPassword('');
  };

  const handleResendConfirmation = async () => {
    setLoading(true);
    await resendConfirmationEmail(email, toast);
    setLoading(false);
  };

  const handleBackToPassword = () => {
    setStep('password');
  };

  if (step === '2fa') {
    return <TwoFactorVerification userId={userId} onVerificationSuccess={handle2FASuccess} onCancel={handle2FACancel} />;
  }

  if (step === 'email_confirmation') {
    return (
      <div className="text-center space-y-6">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Confirmation Required</h1>
          <p className="text-gray-600 mb-4">{confirmationMessage}</p>
          <p className="text-sm text-gray-500">
            Check your inbox for <strong>{email}</strong> and click the confirmation link.
          </p>
        </div>

        <div className="space-y-4">
          <ButtonCustom
            onClick={handleResendConfirmation}
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
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Mail className="mr-2 h-4 w-4" />
                Resend Confirmation Email
              </span>
            )}
          </ButtonCustom>

          <button
            type="button"
            onClick={handleBackToPassword}
            className="text-pink-600 hover:text-pink-800 text-sm font-semibold transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>
      
      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                Verifying Email...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Continue
                <LogIn className="ml-2 h-4 w-4" />
              </span>
            )}
          </ButtonCustom>

          <div className="text-center space-y-4">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-pink-600 hover:text-pink-800 text-sm font-semibold transition-colors block w-full"
            >
              Forgot your password?
            </button>
            
            <div>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignUp}
                  className="text-pink-600 hover:text-pink-800 font-semibold transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email-display" className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email-display"
                type="email"
                value={email}
                readOnly
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                placeholder="Enter your password"
                autoFocus
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
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
                Signing In...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </span>
            )}
          </ButtonCustom>

          <div className="text-center space-y-4">
            <button
              type="button"
              onClick={handleBackToEmail}
              className="text-pink-600 hover:text-pink-800 text-sm font-semibold transition-colors"
            >
              Use different email
            </button>
            
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-pink-600 hover:text-pink-800 text-sm font-semibold transition-colors block w-full"
            >
              Forgot your password?
            </button>
            
            <div>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignUp}
                  className="text-pink-600 hover:text-pink-800 font-semibold transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default SignInForm;
