
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileFormValues } from '../types';
import { Mail, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

const EmailField = ({ form }: EmailFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Mail className="h-4 w-4 text-gray-500" />
              </div>
              <Input 
                {...field} 
                type="email" 
                placeholder="Email"
                className="pl-10"
                disabled={!isEditing}
                data-focus-visible="true"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="h-3.5 w-3.5 text-gray-500" />
                <span className="sr-only">{isEditing ? "Cancel editing" : "Edit email"}</span>
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailField;
