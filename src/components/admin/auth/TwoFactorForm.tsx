
import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface TwoFactorFormProps {
  onBackToLogin: () => void;
  onError: (message: string) => void;
}

const TwoFactorForm = ({ onBackToLogin, onError }: TwoFactorFormProps) => {
  const [twoFACode, setTwoFACode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { verify2FA, isLoading } = useAdmin();
  const navigate = useNavigate();

  const handleTwoFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!twoFACode) {
      setErrorMessage('2FA code is required');
      return;
    }
    
    try {
      const success = await verify2FA(twoFACode);
      
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMessage('Invalid 2FA code. Please try again.');
        onError('Invalid 2FA code. Please try again.');
      }
    } catch (error: any) {
      console.error('2FA verification error:', error);
      setErrorMessage(error.message || 'Failed to verify 2FA code. Please try again.');
      onError(error.message || 'Failed to verify 2FA code. Please try again.');
    }
  };

  return (
    <form onSubmit={handleTwoFASubmit} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="twoFACode">Verification Code</Label>
        <Input
          id="twoFACode"
          type="text"
          value={twoFACode}
          onChange={(e) => setTwoFACode(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="text-center text-xl tracking-widest"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
        disabled={isLoading}
      >
        {isLoading ? 'Verifying...' : 'Verify'}
      </Button>
      
      <div className="text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-sm text-purple-600 hover:underline"
        >
          Back to login
        </button>
      </div>
    </form>
  );
};

export default TwoFactorForm;
