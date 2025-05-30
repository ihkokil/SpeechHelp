
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface TwoFactorVerificationProps {
  userId: string;
  onVerificationSuccess: () => void;
  onCancel: () => void;
}

const TwoFactorVerification = ({ userId, onVerificationSuccess, onCancel }: TwoFactorVerificationProps) => {
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-2fa-login', {
        body: { userId, code: verificationCode }
      });
      
      if (error) throw error;
      
      if (data.success) {
        toast({
          title: "Verification successful",
          description: "Welcome back!"
        });
        onVerificationSuccess();
      } else {
        toast({
          title: "Verification failed",
          description: "Invalid verification code. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error verifying 2FA:', error);
      toast({
        title: "Verification failed",
        description: error.message || "Failed to verify two-factor authentication",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">Two-Factor Authentication</h1>
        </div>
        <p className="text-gray-600">Enter the 6-digit code from your authenticator app</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={verificationCode}
            onChange={setVerificationCode}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={verifyCode} 
          disabled={isLoading || verificationCode.length !== 6}
          className="flex-1"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TwoFactorVerification;
