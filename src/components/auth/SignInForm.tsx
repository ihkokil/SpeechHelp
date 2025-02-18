
import { useState } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import TwoFactorVerification from './TwoFactorVerification';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

const SignInForm = ({ 
  onSwitchToSignUp, 
  onSwitchToForgotPassword 
}: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [userHas2FA, setUserHas2FA] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Email validation logic will be implemented elsewhere
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Password validation logic will be implemented elsewhere
  };

  const handleTwoFactorSuccess = async () => {
    // 2FA success logic will be implemented elsewhere
  };

  const handleTwoFactorCancel = () => {
    // 2FA cancel logic will be implemented elsewhere
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setEmailValidated(false);
    setPasswordValidated(false);
    setShowPassword(false);
    setShow2FA(false);
    setUserHas2FA(false);
    setPendingUserId(null);
  };

  const handleBackToEmail = () => {
    resetForm();
  };

  const handleEditEmail = () => {
    setEmailValidated(false);
    setShowPassword(false);
    setShow2FA(false);
    setPassword('');
    setUserHas2FA(false);
    setPendingUserId(null);
  };

  // Show 2FA verification if we're on that step
  if (show2FA && pendingUserId) {
    return (
      <div className="w-full max-w-md mx-auto">
        <TwoFactorVerification
          userId={pendingUserId}
          onVerificationSuccess={handleTwoFactorSuccess}
          onCancel={handleTwoFactorCancel}
        />
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Log in to continue your speech journey</p>
      </div>
      
      <form className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="flex items-center">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                emailValidated ? 'bg-gray-50 text-gray-600' : ''
              }`}
              placeholder="your@email.com"
              readOnly={emailValidated}
              autoFocus={!emailValidated}
            />
            {emailValidated && (
              <button
                type="button"
                onClick={handleEditEmail}
                className="ml-2 text-pink-600 hover:text-pink-800 text-sm font-medium"
              >
                Change
              </button>
            )}
          </div>
          {!emailValidated && (
            <ButtonCustom
              type="submit"
              variant="magenta"
              className="w-full py-2 mt-3"
              disabled={loading || !email}
              onClick={handleEmailSubmit}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </span>
              ) : 'Continue'}
            </ButtonCustom>
          )}
        </div>

        {/* Password Field - appears after email validation */}
        {showPassword && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              placeholder="••••••••"
              minLength={6}
              autoFocus
            />
            <ButtonCustom
              type="submit"
              variant="magenta"
              className="w-full py-2 mt-3"
              disabled={loading || !password}
              onClick={handlePasswordSubmit}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : userHas2FA ? 'Continue to 2FA' : 'Log In'}
            </ButtonCustom>
          </div>
        )}
      </form>

      <div className="mt-6 text-center space-y-2">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-pink-600 hover:text-pink-800 text-sm font-medium"
        >
          Need an account? Sign Up
        </button>
        
        <button
          type="button"
          onClick={onSwitchToForgotPassword}
          className="block w-full text-pink-600 hover:text-pink-800 text-sm font-medium"
        >
          Forgot your password?
        </button>
      </div>
    </>
  );
};

export default SignInForm;
