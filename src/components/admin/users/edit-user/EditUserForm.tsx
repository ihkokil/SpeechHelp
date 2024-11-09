
import React from 'react';
import { Form } from '@/components/ui/form';
import { User } from '@/components/admin/users/types';
import { useEditUser } from './hooks/useEditUser';
import { EditUserFormFields } from './components/EditUserFormFields';

interface EditUserFormProps {
  user: User;
  onUserUpdated: (user: User) => void;
  onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ 
  user, 
  onUserUpdated,
  onCancel
}) => {
  const { form, isSubmitting, handleSubmit, handleSendPasswordReset } = useEditUser({
    user,
    onSuccess: onUserUpdated,
    onClose: onCancel
  });

  console.log('EditUserForm - User data:', {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    user_metadata: user.user_metadata
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <EditUserFormFields
          form={form}
          isLoading={isSubmitting}
          onSendPasswordReset={handleSendPasswordReset}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
};

export default EditUserForm;
