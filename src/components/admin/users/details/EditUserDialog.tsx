
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/components/admin/users/types';
import { supabase } from '@/integrations/supabase/client';
import { Edit } from 'lucide-react';

interface EditUserDialogProps {
  user: User;
  onUserUpdated: (updatedUser: User) => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, onUserUpdated }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    country_code: user.country_code || 'US',
    address_street_address: user.address_street_address || '',
    address_city: user.address_city || '',
    address_state: user.address_state || '',
    address_zip_code: user.address_zip_code || '',
    address_country_code: user.address_country_code || 'US',
    is_active: user.is_active !== false,
    subscription_plan: user.subscription_plan || 'free_trial',
    subscription_status: user.subscription_status || 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update user profile via edge function
      const { data, error } = await supabase.functions.invoke('admin-update-user', {
        body: {
          user_id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          country_code: formData.country_code,
          address_street_address: formData.address_street_address,
          address_city: formData.address_city,
          address_state: formData.address_state,
          address_zip_code: formData.address_zip_code,
          address_country_code: formData.address_country_code,
          is_active: formData.is_active,
          subscription_plan: formData.subscription_plan,
          subscription_status: formData.subscription_status
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        const updatedUser: User = {
          ...user,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          country_code: formData.country_code,
          address_street_address: formData.address_street_address,
          address_city: formData.address_city,
          address_state: formData.address_state,
          address_zip_code: formData.address_zip_code,
          address_country_code: formData.address_country_code,
          is_active: formData.is_active,
          subscription_plan: formData.subscription_plan,
          subscription_status: formData.subscription_status,
          user_metadata: {
            ...user.user_metadata,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            country_code: formData.country_code
          }
        };

        onUserUpdated(updatedUser);
        setOpen(false);
        toast({
          title: 'User Updated',
          description: 'User information has been updated successfully.'
        });
      } else {
        throw new Error(data.error || 'Failed to update user');
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update user information.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Information</DialogTitle>
          <DialogDescription>
            Update user profile information and settings.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="First name"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Last name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="country_code">Country Code</Label>
                <Input
                  id="country_code"
                  value={formData.country_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, country_code: e.target.value }))}
                  placeholder="US"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address Information</h3>
            <div>
              <Label htmlFor="address_street_address">Street Address</Label>
              <Input
                id="address_street_address"
                value={formData.address_street_address}
                onChange={(e) => setFormData(prev => ({ ...prev, address_street_address: e.target.value }))}
                placeholder="Street address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address_city">City</Label>
                <Input
                  id="address_city"
                  value={formData.address_city}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_city: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="address_state">State/Province</Label>
                <Input
                  id="address_state"
                  value={formData.address_state}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_state: e.target.value }))}
                  placeholder="State or province"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address_zip_code">ZIP/Postal Code</Label>
                <Input
                  id="address_zip_code"
                  value={formData.address_zip_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_zip_code: e.target.value }))}
                  placeholder="ZIP or postal code"
                />
              </div>
              <div>
                <Label htmlFor="address_country_code">Country</Label>
                <Input
                  id="address_country_code"
                  value={formData.address_country_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, address_country_code: e.target.value }))}
                  placeholder="Country code"
                />
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Status</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Account Active</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subscription_plan">Subscription Plan</Label>
                <Select value={formData.subscription_plan} onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_plan: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free_trial">Free Trial</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subscription_status">Subscription Status</Label>
                <Select value={formData.subscription_status} onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
