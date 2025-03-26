
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PasswordChangeForm from './security/PasswordChangeForm';
import TwoFactorAuth from './security/TwoFactorAuth';
import DangerZone from './security/DangerZone';

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TwoFactorAuth />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DangerZone />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
