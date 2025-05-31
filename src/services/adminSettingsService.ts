
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

      // For now, store settings in localStorage as a temporary solution
      // until we can properly integrate with the admin authentication system
      const settingsKey = `admin_settings_${adminSession.user.id}`;
      const existingSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
      
      existingSettings[key] = {
        setting_key: key,
        setting_value: value,
        setting_category: category,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(settingsKey, JSON.stringify(existingSettings));
      
      console.log(`Saved admin setting: ${key} = ${JSON.stringify(value)} (category: ${category})`);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error in saveSetting:', error);
      return { success: false, error: error.message };
    }
  },

  // Get settings from storage
  async getSettings(category?: string): Promise<{ success: boolean; data?: AdminSetting[]; error?: string }> {
    try {
      const adminSession = getAdminSession();
      if (!adminSession || !adminSession.user?.id) {
        return { success: false, error: 'No valid admin session found' };
      }

      const settingsKey = `admin_settings_${adminSession.user.id}`;
      const existingSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
      
      const settingsArray = Object.values(existingSettings) as AdminSetting[];
      
      // Filter by category if specified
      const filteredSettings = category 
        ? settingsArray.filter(setting => setting.setting_category === category)
        : settingsArray;

      return { success: true, data: filteredSettings };
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
