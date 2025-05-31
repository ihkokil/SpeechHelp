
import { useState } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface ResetPasswordFormProps {
  onBackToLogin: () => void;
}

const ResetPasswordForm = ({ onBackToLogin }: ResetPasswordFormProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;

      toast({
        title: "Password updated successfully",
        description: "Your password has been updated. You can now log in with your new password.",
      });

      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to sign in after successful password reset
      setTimeout(() => {
        navigate('/auth?signin=true');
      }, 2000);
    } catch (error: any) {
      console.error('Password update error:', error);
      toast({
        title: "Error updating password",
        description: error.message || "An error occurred while updating your password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-pink-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Set New Password</h1>
        <p className="text-gray-600">Enter your new password below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
              autoFocus
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
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
              Updating Password...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Update Password
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

export default ResetPasswordForm;
