
import React from 'react';
import { Shield } from 'lucide-react';
import { User } from '../types';

interface UserPermissionsProps {
  user: User;
}

export const UserPermissions: React.FC<UserPermissionsProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
        <h3 className="font-medium flex items-center text-amber-800">
          <Shield className="h-4 w-4 mr-2" />
          Admin Permissions
        </h3>
        <p className="text-sm text-amber-700 mt-1">
          Manage this user's administrative permissions from the user management page.
        </p>
      </div>
      
      {user.is_admin ? (
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Current Admin Role</h3>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
              <span>{user.admin_role || 'No specific role'}</span>
            </div>
          </div>
          
          {user.permissions && user.permissions.length > 0 && (
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Permissions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {user.permissions.map(permission => (
                  <div key={permission} className="flex items-center text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span>{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-md p-4 text-center text-muted-foreground">
          This user does not have any administrative permissions.
        </div>
      )}
    </div>
  );
};
