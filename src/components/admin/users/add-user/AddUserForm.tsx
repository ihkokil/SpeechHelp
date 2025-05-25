
import React from 'react';
import { Form } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './hooks/useAddUserForm';
import { 
  FirstNameField, 
  LastNameField,
  EmailField, 
  PasswordField, 
  RoleField, 
  ActiveStatusField 
} from './FormFields';

interface AddUserFormProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ 
  form, 
  isSubmitting, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FirstNameField form={form} />
          <LastNameField form={form} />
        </div>
        <EmailField form={form} />
        <PasswordField form={form} />
        <RoleField form={form} />
        <ActiveStatusField form={form} />
        
        <DialogFooter className="mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Add User'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddUserForm;
