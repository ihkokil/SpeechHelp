
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Send } from 'lucide-react';
import { User } from '../../../types';

interface PasswordManagementSectionProps {
  user: User | null;
  isPasswordResetLoading: boolean;
  onSendPasswordReset: () => void;
}

export const PasswordManagementSection: React.FC<PasswordManagementSectionProps> = ({
  user,
  isPasswordResetLoading,
  onSendPasswordReset
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Password Management</h3>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <div className="text-sm font-medium">Send Password Reset</div>
          <div className="text-sm text-muted-foreground">
            Send a password reset link to {user?.email}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSendPasswordReset}
          disabled={isPasswordResetLoading || !user?.email}
        >
          {isPasswordResetLoading ? (
            <Send className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          <span className="ml-2">
            {isPasswordResetLoading ? 'Sending...' : 'Send Reset Link'}
          </span>
        </Button>
      </div>
    </div>
  );
};
