
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
    "https://yotrueuqjxmgcwlbbyps.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdHJ1ZXVxanhtZ2N3bGJieXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMjIyNDEsImV4cCI6MjA1NjU5ODI0MX0.JNEPQePgfO5ven3C1mUcBvOYezKyjK_zCncPRzuYyXo",
    {
      auth: {
        persistSession: false
      }
    }
  );
};

export const adminSettingsService = {
  // Save a setting to the database using the upsert_admin_setting function
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

      // Use the admin client directly - service role should bypass RLS
      const adminClient = getAdminSupabaseClient();

      // Use the upsert_admin_setting function
      const { data, error } = await adminClient.rpc('upsert_admin_setting', {
        setting_key_param: key,
        setting_value_param: value,
        setting_category_param: category
      });

      if (error) {
        console.error('Error saving admin setting:', error);
        return { success: false, error: error.message };
      }

      const result = data as RpcResponse;
      if (!result.success) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in saveSetting:', error);
      return { success: false, error: error.message };
    }
  },

  // Get settings from the database using the get_admin_settings function
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

      // Use the admin client directly - service role should bypass RLS
      const adminClient = getAdminSupabaseClient();

      // Use the get_admin_settings function
      const { data, error } = await adminClient.rpc('get_admin_settings', {
        category_filter: category || null
      });

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
