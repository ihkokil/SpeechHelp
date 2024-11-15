
import React from 'react';
import { User } from '../../types';
import { useEditUser } from '../hooks/useEditUser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEditUserForm } from './hooks/useEditUserForm';
import { PersonalInfoSection } from './PersonalInfoSection';
import { AddressSection } from './AddressSection';
import { AccountStatusSection } from './AccountStatusSection';
import { PasswordManagementSection } from './PasswordManagementSection';
import { EditUserFormData } from './types';

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (updatedUser: User) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
  open,
  onOpenChange,
  onUserUpdated
}) => {
  const { updateUser, sendPasswordReset, isLoading, isPasswordResetLoading } = useEditUser();
  const form = useEditUserForm(user);

  const onSubmit = async (data: EditUserFormData) => {
    if (!user) return;

    try {
      const result = await updateUser(user.id, data);
      
      // Create updated user object for the callback
      const updatedUser: User = {
        ...user,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        is_active: data.isActive,
        user_metadata: {
          ...user.user_metadata,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          street_address: data.streetAddress,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          country: data.country,
        }
      };

      onUserUpdated(updatedUser);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleSendPasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      await sendPasswordReset(user.email);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and manage their account settings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoSection form={form} />
            <Separator />
            <AddressSection form={form} />
            <Separator />
            <AccountStatusSection form={form} />
            <Separator />
            <PasswordManagementSection 
              user={user}
              isPasswordResetLoading={isPasswordResetLoading}
              onSendPasswordReset={handleSendPasswordReset}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
