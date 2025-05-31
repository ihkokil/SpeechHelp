
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface TwoFactorStatusProps {
  isEnabled: boolean;
  onStatusChange: () => void;
  onSetupClick: () => void;
}

const TwoFactorStatus = ({ isEnabled, onStatusChange, onSetupClick }: TwoFactorStatusProps) => {
  const { toast } = useToast();
  const [isDisabling, setIsDisabling] = useState(false);

  const disableTwoFactor = async () => {
    setIsDisabling(true);
    try {
      const { error } = await supabase.functions.invoke('disable-2fa');
      
      if (error) throw error;
      
      toast({
        title: "Two-factor authentication disabled",
        description: "Your account no longer requires a second factor for login."
      });
      
      onStatusChange();
    } catch (error: any) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: "Disable failed",
        description: error.message || "Failed to disable two-factor authentication",
        variant: "destructive"
      });
    } finally {
      setIsDisabling(false);
    }
  };

  if (isEnabled) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
          <div className="rounded-full bg-green-100 p-1 mr-3">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-green-800">Two-factor authentication is enabled</h4>
            <p className="text-sm text-green-700 mt-1">
              Your account is protected with two-factor authentication.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                Disable Two-Factor
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Disable Two-Factor Authentication
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to disable two-factor authentication? This will make your account less secure.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={disableTwoFactor}
                  disabled={isDisabling}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDisabling ? 'Disabling...' : 'Disable 2FA'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <Button onClick={onSetupClick} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        Set Up Two-Factor Authentication
      </Button>
    </div>
  );
};

export default TwoFactorStatus;
