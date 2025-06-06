
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, AdminRole, AdminPermission } from './types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';

interface AdminPermissionsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPermissionsUpdated: (updatedUser: User) => void;
}

const AdminPermissionsDialog: React.FC<AdminPermissionsDialogProps> = ({
  user,
  open,
  onOpenChange,
  onPermissionsUpdated
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (open && user) {
      loadRolesAndPermissions();
      // Set initial values based on user
      setIsAdmin(user.is_admin || false);
      setSelectedRole(user.admin_role || '');
      setSelectedPermissions(user.permissions || []);
    }
  }, [open, user]);

  const loadRolesAndPermissions = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, these would be loaded from the database
      // For now, we'll use mock data
      const mockRoles: AdminRole[] = [
        { id: '1', name: 'Super Admin', description: 'Full access to all features' },
        { id: '2', name: 'Content Manager', description: 'Manage speeches and content' },
        { id: '3', name: 'User Manager', description: 'Manage users only' }
      ];
      
      const mockPermissions: AdminPermission[] = [
        { id: 'view_users', name: 'View Users', description: 'View user accounts' },
        { id: 'manage_users', name: 'Manage Users', description: 'Create, edit and deactivate users' },
        { id: 'view_speeches', name: 'View Speeches', description: 'View all user speeches' },
        { id: 'manage_speeches', name: 'Manage Speeches', description: 'Edit and delete speeches' },
        { id: 'view_billing', name: 'View Billing', description: 'View billing information' },
        { id: 'manage_billing', name: 'Manage Billing', description: 'Manage billing and subscriptions' },
        { id: 'system_settings', name: 'System Settings', description: 'Access system configuration' }
      ];
      
      setRoles(mockRoles);
      setPermissions(mockPermissions);
    } catch (error) {
      console.error('Error loading roles and permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load roles and permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    
    // In a real implementation, you might want to auto-select permissions based on role
    if (roleId === '1') { // Super Admin
      setSelectedPermissions(permissions.map(p => p.id));
    } else if (roleId === '2') { // Content Manager
      setSelectedPermissions(['view_speeches', 'manage_speeches', 'view_users']);
    } else if (roleId === '3') { // User Manager
      setSelectedPermissions(['view_users', 'manage_users']);
    } else {
      setSelectedPermissions([]);
    }
  };

  const handleSavePermissions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // In a real implementation, this would update the user's permissions in the database
      // For now, just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser: User = {
        ...user,
        is_admin: isAdmin,
        admin_role: selectedRole,
        permissions: selectedPermissions
      };
      
      onPermissionsUpdated(updatedUser);
      
      toast({
        title: 'Success',
        description: 'User permissions updated successfully.',
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user permissions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-amber-500" />
              Edit Admin Permissions
            </div>
          </DialogTitle>
          <DialogDescription>
            {user ? `Configure administrative access for ${user.email}` : 'Select user permissions'}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="role" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="role">Role</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="role" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is-admin" 
                    checked={isAdmin}
                    onCheckedChange={(checked) => setIsAdmin(!!checked)}
                  />
                  <Label htmlFor="is-admin" className="text-base font-medium">
                    Administrator Access
                  </Label>
                </div>
                
                {isAdmin && (
                  <div className="space-y-2">
                    <Label htmlFor="role-select">Select Role</Label>
                    <Select 
                      value={selectedRole} 
                      onValueChange={handleRoleChange}
                    >
                      <SelectTrigger id="role-select" className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No specific role</SelectItem>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedRole && selectedRole !== "none" && (
                      <p className="text-sm text-muted-foreground">
                        {roles.find(r => r.id === selectedRole)?.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="permissions" className="pt-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Select specific permissions for this user
                </p>
                
                <div className="grid gap-3">
                  {permissions.map(permission => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`permission-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => handleTogglePermission(permission.id)}
                        disabled={!isAdmin}
                      />
                      <div className="space-y-1">
                        <Label 
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-medium"
                        >
                          {permission.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSavePermissions}
            disabled={isLoading}
            className="space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Save Permissions</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPermissionsDialog;
