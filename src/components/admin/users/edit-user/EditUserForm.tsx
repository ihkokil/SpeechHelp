
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { User } from '@/components/admin/users/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import EmailField from '@/components/settings/profile/components/EmailField';
import NameFields from '@/components/settings/profile/components/NameFields';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Define form schema
const formSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  email: z.string().email().optional(),
  isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserFormProps {
  user: User;
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ 
  user, 
  onSubmit, 
  isLoading = false,
  onCancel 
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.user_metadata?.name || '',
      role: user.admin_role || '',
      email: user.email || '',
      isActive: user.is_active !== false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameFields 
          form={form} 
          isNameSingle={true}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <EmailField 
              field={field}
              disabled={isLoading}
            />
          )}
        />
        
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <Switch 
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
                id="user-active-status"
              />
            )}
          />
          <Label htmlFor="user-active-status">User is active</Label>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update User'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditUserForm;
