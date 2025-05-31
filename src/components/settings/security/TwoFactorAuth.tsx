
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TwoFactorAuth = () => {
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const setupTwoFactor = () => {
    // In a real app, this would start the 2FA setup process
    toast({
      title: "Two-factor authentication",
      description: "Two-factor authentication setup would start here.",
    });
    setTwoFactorEnabled(true);
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <Shield className="h-5 w-5 mr-2 text-pink-600" />
        <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
      </div>
      {twoFactorEnabled ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
          <div className="rounded-full bg-green-100 p-1 mr-3">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-green-800">Two-factor authentication is enabled</h4>
            <p className="text-sm text-green-700 mt-1">
              Your account is now more secure with two-factor authentication.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
          </p>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <div className="rounded-full bg-gray-100 h-6 w-6 flex items-center justify-center mr-2">
                <span className="text-sm">1</span>
              </div>
              <span className="text-sm">Set up an authenticator app on your phone</span>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-gray-100 h-6 w-6 flex items-center justify-center mr-2">
                <span className="text-sm">2</span>
              </div>
              <span className="text-sm">Scan a QR code or enter the setup key</span>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-gray-100 h-6 w-6 flex items-center justify-center mr-2">
                <span className="text-sm">3</span>
              </div>
              <span className="text-sm">Enter the verification code to complete setup</span>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end mt-4">
        {twoFactorEnabled ? (
          <Button 
            variant="outline" 
            className="w-40 h-10" 
            onClick={() => setTwoFactorEnabled(false)}
          >
            Disable Two-Factor
          </Button>
        ) : (
          <Button 
            onClick={setupTwoFactor} 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-40 h-10"
          >
            Set Up Two-Factor
          </Button>
        )}
      </div>
    </>
  );
};

export default TwoFactorAuth;
