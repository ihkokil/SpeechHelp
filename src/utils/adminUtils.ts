
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminReset = () => {
  const { toast } = useToast();

  const resetAdminUsers = async () => {
    try {
      // Call the edge function to reset admin users
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-admin-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset admin users');
      }
      
      toast({
        title: "Admin users reset",
        description: "All admin users have been deleted. You can now create a new admin account.",
      });
      
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || 'Failed to reset admin users',
        variant: "destructive"
      });
      return false;
    }
  };

  return { resetAdminUsers };
};

export const createDefaultAdmin = async () => {
  try {
    // This will create a default admin user
    const { data, error } = await supabase.rpc('create_first_admin', {
      email_input: 'admin@speechhelp.com',
      username_input: 'admin',
      password_input: 'Admin123!'
    });
    
    if (error) {
      console.error('Error creating default admin:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, message: 'Default admin created successfully' };
  } catch (err: any) {
    console.error('Error in createDefaultAdmin:', err);
    return { success: false, error: err.message };
  }
};

export const checkAdminExists = async () => {
  try {
    const { data, error } = await supabase.from('admin_users').select('id').limit(1);
    
    if (error) throw error;
    
    return data && data.length > 0;
  } catch (err: any) {
    console.error('Error checking admin existence:', err);
    return false;
  }
};
