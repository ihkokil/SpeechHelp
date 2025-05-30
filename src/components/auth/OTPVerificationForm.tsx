
import { useState } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';

interface OTPVerificationFormProps {
  email: string;
  onBackToForgotPassword: () => void;
  onSuccess: () => void;
}

const OTPVerificationForm = ({ 
  email, 
  onBackToForgotPassword, 
  onSuccess 
}: OTPVerificationFormProps) => {
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Verifying OTP and resetting password...');
      
      const { data, error } = await supabase.functions.invoke('verify-otp-reset-password', {
        body: {
          email: email,
          otpCode: otpCode,
          newPassword: newPassword
        }
      });

      if (error) {
        console.error('OTP verification error:', error);
        throw error;
      }

      if (data?.success) {
        console.log('Password reset successful');
        
        toast({
          title: "Password reset successful",
          description: "Your password has been updated. You can now sign in with your new password.",
        });
        
        onSuccess();
      } else {
        throw new Error(data?.error || 'Failed to reset password');
      }
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.message?.includes('Invalid or expired OTP')) {
        toast({
          title: "Invalid or expired code",
          description: "The code you entered is invalid or has expired. Please request a new one.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error resetting password",
          description: error.message || "An error occurred while resetting your password",
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Enter Verification Code</h1>
        <p className="text-gray-600">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          The code will expire in 10 minutes
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Verification Code
          </label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2 border-gray-300 focus:border-pink-500" />
                <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2 border-gray-300 focus:border-pink-500" />
                <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2 border-gray-300 focus:border-pink-500" />
                <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2 border-gray-300 focus:border-pink-500" />
                <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2 border-gray-300 focus:border-pink-500" />
                <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2 border-gray-300 focus:border-pink-500" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              placeholder="Enter new password"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
            Confirm New Password
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
              placeholder="Confirm new password"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 6 characters long
          </p>
        </div>

        <ButtonCustom
          type="submit"
          variant="magenta"
          className="w-full py-3 font-semibold"
          disabled={loading || otpCode.length !== 6}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting Password...
            </span>
          ) : (
            'Reset Password'
          )}
        </ButtonCustom>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToForgotPassword}
            className="inline-flex items-center text-pink-600 hover:text-pink-800 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Email Entry
          </button>
        </div>
      </form>
    </>
  );
};

export default OTPVerificationForm;
