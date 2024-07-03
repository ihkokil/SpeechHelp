
import React from 'react';
import { Form } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './hooks/useEditUserForm';
import { 
  NameField, 
  EmailField,
  RoleField, 
  ActiveStatusField 
} from '../add-user/FormFields';

interface EditUserFormProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ 
  form, 
  isSubmitting, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameField form={form} />
        <EmailField form={form} disabled />
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
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EditUserForm;
