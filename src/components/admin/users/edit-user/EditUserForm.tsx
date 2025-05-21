
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
import { Mail } from 'lucide-react';
import { formatPhoneNumber } from '@/components/settings/profile/utils/phoneUtils';
import { Input } from '@/components/ui/input';

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, 'Display name is required'),
  role: z.string().optional(),
  email: z.string().email(),
  isActive: z.boolean().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserFormProps {
  user: User;
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  onSendPasswordReset?: (email: string) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ 
  user, 
  onSubmit, 
  isLoading = false,
  onCancel,
  onSendPasswordReset
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.user_metadata?.name || user.user_metadata?.full_name || '',
      role: user.admin_role || '',
      email: user.email || '',
      isActive: user.is_active !== false,
      phone: user.user_metadata?.phone || '',
    },
  });

  const handleSendPasswordReset = () => {
    if (onSendPasswordReset && user.email) {
      onSendPasswordReset(user.email);
    }
  };

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

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Phone number"
                value={field.value || ''}
                onChange={field.onChange}
                disabled={isLoading}
                className="w-full"
              />
            </div>
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

        <Button
          type="button"
          variant="outline"
          onClick={handleSendPasswordReset}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2"
        >
          <Mail className="h-4 w-4" />
          Send Password Reset Link
        </Button>
        
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
