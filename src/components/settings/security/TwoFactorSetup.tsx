
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Copy, Check, Download } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface TwoFactorSetupProps {
  onSetupComplete: () => void;
  onCancel: () => void;
}

const TwoFactorSetup = ({ onSetupComplete, onCancel }: TwoFactorSetupProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  const setupTwoFactor = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-2fa');
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || "Failed to set up 2FA");
      }
      
      setQrCodeData(data.qrCode);
      setQrCodeUrl(data.qrUrl);
      setSecret(data.secret);
      setStep('verify');
    } catch (error: any) {
      console.error('Error setting up 2FA:', error);
      toast({
        title: "Setup failed",
        description: error.message || "Failed to set up two-factor authentication",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifySetup = async () => {
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
      const { data, error } = await supabase.functions.invoke('verify-2fa-setup', {
        body: { code: verificationCode }
      });
      
      if (error) throw error;
      
      if (data.success) {
        setBackupCodes(data.backupCodes);
        setStep('backup');
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

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setSecretCopied(true);
      toast({
        title: "Secret copied",
        description: "Secret key copied to clipboard"
      });
      setTimeout(() => setSecretCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy secret to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n');
    const blob = new Blob([`Two-Factor Authentication Backup Codes\n\n${codesText}\n\nKeep these codes safe! Each code can only be used once.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const completeSetup = () => {
    toast({
      title: "Two-factor authentication enabled",
      description: "Your account is now more secure with 2FA enabled."
    });
    onSetupComplete();
  };

  if (step === 'setup') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">Set Up Two-Factor Authentication</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your authenticator app.
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-100 h-6 w-6 flex items-center justify-center">
                <span className="text-sm font-medium">1</span>
              </div>
              <span className="text-sm">Install an authenticator app (Google Authenticator, Authy, etc.)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-100 h-6 w-6 flex items-center justify-center">
                <span className="text-sm font-medium">2</span>
              </div>
              <span className="text-sm">Scan the QR code or enter the setup key</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-100 h-6 w-6 flex items-center justify-center">
                <span className="text-sm font-medium">3</span>
              </div>
              <span className="text-sm">Enter the verification code to complete setup</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={setupTwoFactor} disabled={isLoading}>
            {isLoading ? 'Setting up...' : 'Continue Setup'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Scan this QR code with your authenticator app:
          </p>
          
          <div className="flex justify-center">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48 border border-gray-200 rounded" />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: qrCodeData.replace('data:image/svg+xml;base64,', '') }} className="w-48 h-48" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Or enter this setup key manually:</p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <code className="flex-1 text-sm font-mono break-all">{secret}</code>
              <Button
                size="sm"
                variant="outline"
                onClick={copySecret}
                className="h-8 px-2"
              >
                {secretCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Enter the 6-digit code from your authenticator app:</p>
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
          <Button onClick={verifySetup} disabled={isLoading || verificationCode.length !== 6}>
            {isLoading ? 'Verifying...' : 'Verify & Enable'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'backup') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">Save Backup Codes</h3>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800 font-medium">Important!</p>
            <p className="text-sm text-yellow-700 mt-1">
              Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device. Each code can only be used once.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-md font-mono text-sm">
            {backupCodes.map((code, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-gray-500">{index + 1}.</span>
                <span>{code}</span>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={downloadBackupCodes} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Backup Codes
          </Button>
        </div>

        <div className="flex gap-3">
          <Button onClick={completeSetup}>
            I've Saved My Backup Codes
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default TwoFactorSetup;
