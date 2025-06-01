
import { supabase } from '@/integrations/supabase/client';

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

// Helper function to get admin session
const getAdminSession = () => {
  const adminSession = sessionStorage.getItem('adminSession') || localStorage.getItem('adminSession');
  if (!adminSession) {
    return null;
  }
  
  try {
    const session = JSON.parse(adminSession);
    const now = new Date().getTime();
    
    // Check if session is still valid (24 hour expiry)
    if (session.expiresAt && session.expiresAt > now) {
      return session;
    }
    
    // Clear expired session
    sessionStorage.removeItem('adminSession');
    localStorage.removeItem('adminSession');
    return null;
  } catch (error) {
    console.error('Error parsing admin session:', error);
    return null;
  }
};

export const adminSettingsService = {
  // Save a setting to the database
  async saveSetting(key: string, value: any, category: string): Promise<{ success: boolean; error?: string }> {
    try {
      const adminSession = getAdminSession();
      if (!adminSession || !adminSession.user?.id) {
        return { success: false, error: 'No valid admin session found' };
      }

      console.log(`Attempting to save admin setting: ${key} = ${JSON.stringify(value)} (category: ${category})`);

      // Use the upsert_admin_setting function
      const { data, error } = await supabase.rpc('upsert_admin_setting', {
        setting_key_param: key,
        setting_value_param: value,
        setting_category_param: category
      });

      if (error) {
        console.error('Error saving admin setting:', error);
        return { success: false, error: error.message };
      }

      if (data && !data.success) {
        console.error('RPC function returned error:', data.error);
        return { success: false, error: data.error };
      }

      console.log(`Successfully saved admin setting: ${key}`);
      return { success: true };
    } catch (error: any) {
      console.error('Error in saveSetting:', error);
      return { success: false, error: error.message };
    }
  },

  // Get settings from the database
  async getSettings(category?: string): Promise<{ success: boolean; data?: AdminSetting[]; error?: string }> {
    try {
      const adminSession = getAdminSession();
      if (!adminSession || !adminSession.user?.id) {
        return { success: false, error: 'No valid admin session found' };
      }

      console.log(`Fetching admin settings for category: ${category || 'all'}`);

      // Use the get_admin_settings function
      const { data, error } = await supabase.rpc('get_admin_settings', {
        category_filter: category || null
      });

      if (error) {
        console.error('Error fetching admin settings:', error);
        return { success: false, error: error.message };
      }

      // Transform the data to match our interface
      const settings: AdminSetting[] = (data || []).map((row: any) => ({
        setting_key: row.setting_key,
        setting_value: row.setting_value,
        setting_category: row.setting_category,
        updated_at: row.updated_at
      }));

      console.log(`Fetched ${settings.length} admin settings`);
      return { success: true, data: settings };
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
