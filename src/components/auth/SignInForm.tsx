import { useState } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { verifyEmail, verifyPassword, verify2FA, completeLogin } from '@/services/authService';
import TwoFactorVerification from './TwoFactorVerification';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

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
  const [showPasswordField, setShowPasswordField] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyEmail(email, toast);
      
      if (result.success && result.userExists) {
        setEmailValidated(true);
        setShowPasswordField(true);
        setUserHas2FA(result.has2FA || false);
        setPendingUserId(result.userId || null);
        console.log('Email verified, 2FA status:', result.has2FA);
      }
    } catch (error) {
      console.error('Email verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyPassword(email, password, toast);
      
      if (result.success) {
        setPasswordValidated(true);
        console.log('Password verified, user has 2FA:', userHas2FA);
        
        if (userHas2FA && pendingUserId) {
          // Show 2FA verification
          setShow2FA(true);
          console.log('Showing 2FA verification form');
        } else {
          // Complete login without 2FA
          console.log('Completing login without 2FA');
          const loginResult = await completeLogin(email, password, toast);
          if (loginResult.success) {
            toast({
              title: "Login successful",
              description: "Welcome back!",
            });
            // Let React Router handle the navigation naturally
            // The AuthContext will detect the login and redirect appropriately
          }
        }
      }
    } catch (error) {
      console.error('Password verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSuccess = async () => {
    console.log('2FA verification successful, completing login');
    
    // Complete the login after successful 2FA
    const loginResult = await completeLogin(email, password, toast);
    if (loginResult.success) {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      // Let React Router handle the navigation naturally
      // The AuthContext will detect the login and redirect appropriately
    }
  };

  const handleTwoFactorCancel = () => {
    setShow2FA(false);
    setPasswordValidated(false);
    setPassword('');
    console.log('2FA cancelled, returning to password step');
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setEmailValidated(false);
    setPasswordValidated(false);
    setShowPasswordField(false);
    setShow2FA(false);
    setUserHas2FA(false);
    setPendingUserId(null);
  };

  const handleEditEmail = () => {
    setEmailValidated(false);
    setShowPasswordField(false);
    setShow2FA(false);
    setPassword('');
    setUserHas2FA(false);
    setPendingUserId(null);
  };

  // Show 2FA verification if we're on that step
  if (show2FA && passwordValidated && pendingUserId) {
    console.log('Rendering 2FA component with userId:', pendingUserId);
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
        <p className="text-gray-600">Sign in to continue your speech journey</p>
      </div>
      
      <form className="space-y-6">
        {/* Email Field */}
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
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors ${
                emailValidated ? 'bg-gray-50 text-gray-600' : ''
              }`}
              placeholder="Enter your email address"
              readOnly={emailValidated}
              autoFocus={!emailValidated}
            />
            {emailValidated && (
              <button
                type="button"
                onClick={handleEditEmail}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-600 hover:text-pink-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
          </div>
          {!emailValidated && (
            <ButtonCustom
              type="submit"
              variant="magenta"
              className="w-full py-3 mt-4 font-semibold"
              disabled={loading || !email}
              onClick={handleEmailSubmit}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </ButtonCustom>
          )}
        </div>

        {/* Password Field - appears after email validation */}
        {showPasswordField && !show2FA && (
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
                minLength={6}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <ButtonCustom
              type="submit"
              variant="magenta"
              className="w-full py-3 mt-4 font-semibold"
              disabled={loading || !password}
              onClick={handlePasswordSubmit}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {userHas2FA ? 'Verifying...' : 'Signing in...'}
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  {userHas2FA ? 'Proceed to 2FA' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </ButtonCustom>
          </div>
        )}
      </form>

      <div className="mt-8 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
          </div>
        </div>
        
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="w-full text-pink-600 hover:text-pink-800 text-sm font-semibold py-2 transition-colors"
        >
          Create a new account
        </button>
        
        <button
          type="button"
          onClick={onSwitchToForgotPassword}
          className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium py-2 transition-colors"
        >
          Forgot your password?
        </button>
      </div>
    </>
  );
};

export default SignInForm;
