
import { useState } from 'react';
import { Shield } from 'lucide-react';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import TwoFactorStatus from './TwoFactorStatus';
import TwoFactorSetup from './TwoFactorSetup';

const TwoFactorAuth = () => {
  const { isEnabled, isLoading, refetch } = useTwoFactorAuth();
  const [showSetup, setShowSetup] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Shield className="h-5 w-5 mr-2 text-pink-600" />
          <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
        </div>
        <div className="animate-pulse bg-gray-200 h-20 rounded-md"></div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <TwoFactorSetup
        onSetupComplete={() => {
          setShowSetup(false);
          refetch();
        }}
        onCancel={() => setShowSetup(false)}
      />
    );
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <Shield className="h-5 w-5 mr-2 text-pink-600" />
        <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
      </div>
      <TwoFactorStatus
        isEnabled={isEnabled}
        onStatusChange={refetch}
        onSetupClick={() => setShowSetup(true)}
      />
    </>
  );
};

export default TwoFactorAuth;
