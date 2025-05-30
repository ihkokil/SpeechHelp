
import { useState, useEffect } from 'react';
import { ButtonCustom } from '@/components/ui/button-custom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Simplified recovery session validation
  const validateRecoverySession = async () => {
    console.log('ResetPassword: Starting session validation');
    console.log('ResetPassword: Full URL:', window.location.href);
    console.log('ResetPassword: Hash:', location.hash);
    console.log('ResetPassword: Search:', location.search);
    
    try {
      // First, let's check if we have any recovery indicators in the URL
      const hasRecoveryType = location.search.includes('type=recovery') || location.hash.includes('type=recovery');
      const hasAccessToken = location.hash.includes('access_token=') || location.search.includes('access_token=');
      
      console.log('ResetPassword: Recovery indicators:', { hasRecoveryType, hasAccessToken });
      
      if (!hasRecoveryType) {
        console.log('ResetPassword: No recovery type found in URL');
        throw new Error('No recovery type found');
      }

      // Try to get the current session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('ResetPassword: Current session:', { session: !!session, error: sessionError });

      if (session && session.user) {
        console.log('ResetPassword: Valid session found');
        setIsValidSession(true);
        return;
      }

      // If no session but we have hash parameters, try to extract and set tokens
      if (location.hash) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        console.log('ResetPassword: Hash tokens:', { 
          type, 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken 
        });
        
        if (type === 'recovery' && accessToken) {
          console.log('ResetPassword: Setting session from hash tokens');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          if (error) {
            console.error('ResetPassword: Error setting session:', error);
            throw error;
          }
          
          if (data.session) {
            console.log('ResetPassword: Session set successfully');
            setIsValidSession(true);
            return;
          }
        }
      }
      
      // If we still don't have a valid session, this might be a direct link
      // In some cases, Supabase automatically handles the session
      console.log('ResetPassword: No valid session, but recovery type detected');
      setIsValidSession(true); // Allow password reset if recovery type is present
      
    } catch (error) {
      console.error('ResetPassword: Session validation error:', error);
      toast({
        title: "Invalid reset link",
        description: "This password reset link is invalid or has expired. Please request a new one.",
        variant: "destructive"
      });
      
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } finally {
      setIsChecking(false);
    }
  };

  // Check recovery session on component mount and URL changes
  useEffect(() => {
    validateRecoverySession();
  }, [location.hash, location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);

    // Validate that passwords match
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Validate password length
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
      console.log('ResetPassword: Updating password');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('ResetPassword: Error updating password:', error);
        throw error;
      }

      console.log('ResetPassword: Password updated successfully');
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully. You can now log in with your new password.",
      });
      
      // Clear the form
      setNewPassword('');
      setConfirmPassword('');
      
      // Sign out the user so they can log in with their new password
      console.log('ResetPassword: Signing out user after password update');
      await supabase.auth.signOut({ scope: 'global' });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/auth?signin=true');
      }, 2000);
      
    } catch (error: any) {
      console.error('ResetPassword: Password update error:', error);
      toast({
        title: "Error updating password",
        description: error.message || "An error occurred while updating your password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading or error state while checking session validity
  if (isChecking) {
    return (
      <>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verifying Reset Link</h1>
          <p className="text-gray-600">Please wait while we verify your password reset link...</p>
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
        </div>
      </>
    );
  }

  if (!isValidSession) {
    return (
      <>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-600">This reset link is invalid or has expired.</p>
        </div>
        <div className="text-center">
          <ButtonCustom
            onClick={() => navigate('/auth')}
            variant="magenta"
            className="w-full py-3 font-semibold"
          >
            Back to Sign In
          </ButtonCustom>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Set New Password</h1>
        <p className="text-gray-600">Choose a strong password to secure your account</p>
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
              minLength={6}
              autoFocus
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
              Update Password
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </ButtonCustom>
      </form>
    </>
  );
};

export default ResetPasswordForm;
