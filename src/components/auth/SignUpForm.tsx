import { useState } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { signUp } from '@/services/authService';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  autoFocus?: boolean;
}

const SignUpForm = ({ onSwitchToSignIn, autoFocus = false }: SignUpFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const { translate } = useTranslatedContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: translate('auth.errors.passwordsDontMatch'),
        description: translate('auth.errors.passwordsDontMatchDesc'),
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: translate('auth.errors.passwordTooShort'),
        description: translate('auth.errors.passwordTooShortDesc'),
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, toast, firstName, lastName);
      
      setTimeout(() => {
        onSwitchToSignIn();
      }, 2000);
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      if (error.message === 'User already registered') {
        toast({
          title: translate('auth.errors.accountExists'),
          description: translate('auth.errors.accountExistsDesc'),
          variant: "destructive"
        });
      } else if (error.message && error.message.includes('rate limit')) {
        toast({
          title: translate('auth.errors.tooManyRequests'),
          description: translate('auth.errors.tooManyRequestsDesc'),
          variant: "destructive"
        });
      } else if (error.message && error.message.includes('email rate limit exceeded')) {
        toast({
          title: translate('auth.errors.emailRateLimit'),
          description: translate('auth.errors.emailRateLimitDesc'),
          variant: "destructive"
        });
      } else {
        toast({
          title: translate('auth.errors.signUpFailed'),
          description: error.message || translate('auth.errors.signUpFailedDesc'),
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{translate('auth.signUp.title')}</h1>
        <p className="text-gray-600">{translate('auth.signUp.subtitle')}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
              {translate('auth.labels.firstName')}
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                placeholder={translate('auth.placeholders.firstName')}
                autoFocus={autoFocus}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
              {translate('auth.labels.lastName')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                placeholder={translate('auth.placeholders.lastName')}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            {translate('auth.labels.email')}
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
              placeholder={translate('auth.placeholders.email')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            {translate('auth.labels.password')}
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
              placeholder={translate('auth.placeholders.createPassword')}
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

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
            {translate('auth.labels.confirmPassword')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              placeholder={translate('auth.placeholders.confirmPassword')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
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
              {translate('auth.signUp.loading')}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <UserPlus className="mr-2 h-4 w-4" />
              {translate('auth.signUp.button')}
            </span>
          )}
        </ButtonCustom>

        <div className="text-center">
          <p className="text-gray-600">
            {translate('auth.signUp.hasAccount')}{' '}
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-pink-600 hover:text-pink-800 font-semibold transition-colors"
            >
              {translate('auth.signUp.signInHere')}
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default SignUpForm;
