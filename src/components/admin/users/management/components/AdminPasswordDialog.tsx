
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import { User } from '../../types';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { adminAuthService } from '@/services/adminAuthService';

interface AdminPasswordDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: User) => void;
}

const AdminPasswordDialog: React.FC<AdminPasswordDialogProps> = ({
  user,
  open,
  onOpenChange,
  onConfirm
}) => {
  const { adminUser } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !adminUser) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Verify the password with the current admin's credentials
      const isPasswordValid = await adminAuthService.verifyAdminPassword(
        adminUser.username, 
        password
      );
      
      if (!isPasswordValid) {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
        return;
      }
      
      // Password is correct, proceed with admin toggle
      onConfirm(user);
      
      // Reset form and close dialog
      setPassword('');
      setError('');
      onOpenChange(false);
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Admin Access Confirmation
          </DialogTitle>
          <DialogDescription>
            {user && (
              <>
                You are about to {user.is_admin ? 'remove admin privileges from' : 'grant admin privileges to'} <strong>{user.email}</strong>.
                Please enter the admin password to confirm this action.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isLoading ? 'Confirming...' : user?.is_admin ? 'Remove Admin Access' : 'Grant Admin Access'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPasswordDialog;
