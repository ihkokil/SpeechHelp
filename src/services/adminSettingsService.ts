
import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';

export interface AdminSetting {
  setting_key: string;
  setting_value: any;
  setting_category: string;
  updated_at: string;
}

interface RpcResponse {
  success: boolean;
  error?: string;
  setting_key?: string;
  setting_value?: any;
}

// Create a separate client for admin operations using service role
const getAdminSupabaseClient = () => {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false
      }
    }
  );
};

export const adminSettingsService = {
  // Save a setting to the database
  async saveSetting(key: string, value: any, category: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get the current admin session
      const adminSession = sessionStorage.getItem('adminSession') || localStorage.getItem('adminSession');
      if (!adminSession) {
        return { success: false, error: 'No admin session found' };
      }

      const session = JSON.parse(adminSession);
      const adminUserId = session.user?.id;

      if (!adminUserId) {
        return { success: false, error: 'Invalid admin session' };
      }

      // Use the admin client and set the admin user ID context
      const adminClient = getAdminSupabaseClient();
      
      // Insert directly into the admin_settings table instead of using RPC
      const { data, error } = await adminClient
        .from('admin_settings')
        .upsert({
          admin_user_id: adminUserId,
          setting_key: key,
          setting_value: value,
          setting_category: category,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'admin_user_id,setting_key'
        });

      if (error) {
        console.error('Error saving admin setting:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in saveSetting:', error);
      return { success: false, error: error.message };
    }
  },

  // Get settings from the database
  async getSettings(category?: string): Promise<{ success: boolean; data?: AdminSetting[]; error?: string }> {
    try {
      // Get the current admin session
      const adminSession = sessionStorage.getItem('adminSession') || localStorage.getItem('adminSession');
      if (!adminSession) {
        return { success: false, error: 'No admin session found' };
      }

      const session = JSON.parse(adminSession);
      const adminUserId = session.user?.id;

      if (!adminUserId) {
        return { success: false, error: 'Invalid admin session' };
      }

      // Use the admin client
      const adminClient = getAdminSupabaseClient();
      
      // Query the admin_settings table directly
      let query = adminClient
        .from('admin_settings')
        .select('setting_key, setting_value, setting_category, updated_at')
        .eq('admin_user_id', adminUserId);

      if (category) {
        query = query.eq('setting_category', category);
      }

      const { data, error } = await query.order('setting_category, setting_key');

      if (error) {
        console.error('Error fetching admin settings:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Error in getSettings:', error);
      return { success: false, error: error.message };
    }
  },

  // Get a specific setting value
  async getSetting(key: string): Promise<any> {
    const result = await this.getSettings();
    if (result.success && result.data) {
      const setting = result.data.find(s => s.setting_key === key);
      return setting?.setting_value;
    }
    return null;
  }
};
