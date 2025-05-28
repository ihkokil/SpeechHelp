

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

      // Use the regular supabase client with admin session
      const { data, error } = await supabase.rpc('upsert_admin_setting', {
        setting_key_param: key,
        setting_value_param: value,
        setting_category_param: category
      });

      if (error) {
        console.error('Error saving admin setting:', error);
        return { success: false, error: error.message };
      }

      // Safely convert data to RpcResponse with proper type checking
      const result = data as unknown as RpcResponse;
      if (!result || typeof result !== 'object' || !('success' in result)) {
        return { success: false, error: 'Invalid response format' };
      }

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

      // Use the regular supabase client with admin session
      const { data, error } = await supabase.rpc('get_admin_settings', {
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

