
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

// Define profile type based on the profiles table
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  phone: string | null;
  country_code: string | null;
  avatar_url: string | null;
  is_active: boolean;
  is_admin: boolean;
  subscription_plan: string | null;
  subscription_status: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Unified Profile Service - Single source of truth for user profile data
 * This service ensures all profile data comes from and goes to the profiles table
 */
class ProfileService {
  /**
   * Get user profile from profiles table
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  }

  /**
   * Update user profile in profiles table and sync with auth metadata
   */
  async updateUserProfile(
    userId: string, 
    updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Update profiles table
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
      }

      // Sync relevant data to auth.users metadata for consistency
      const metadataUpdates: Record<string, any> = {};
      if (updates.first_name !== undefined) metadataUpdates.first_name = updates.first_name;
      if (updates.last_name !== undefined) metadataUpdates.last_name = updates.last_name;
      if (updates.phone !== undefined) metadataUpdates.phone = updates.phone;
      if (updates.country_code !== undefined) metadataUpdates.country_code = updates.country_code;

      // Update full_name if first or last name changed
      if (updates.first_name !== undefined || updates.last_name !== undefined) {
        const firstName = updates.first_name ?? data.first_name ?? '';
        const lastName = updates.last_name ?? data.last_name ?? '';
        metadataUpdates.full_name = `${firstName} ${lastName}`.trim();
      }

      if (Object.keys(metadataUpdates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser({
          data: metadataUpdates
        });

        if (authError) {
          console.error('Error updating auth metadata:', authError);
          // Don't fail the operation, just log the error
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in updateUserProfile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user's profile data unified from profiles table
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      return await this.getUserProfile(user.id);
    } catch (error) {
      console.error('Error getting current user profile:', error);
      return null;
    }
  }

  /**
   * Get display name for a user - prioritizes profiles table data
   */
  getDisplayName(profile: UserProfile | null, fallbackUser?: User): string {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    
    if (profile?.first_name) {
      return profile.first_name;
    }
    
    if (profile?.username) {
      return profile.username;
    }
    
    // Fallback to auth user data
    if (fallbackUser?.user_metadata?.first_name) {
      return fallbackUser.user_metadata.first_name;
    }
    
    if (fallbackUser?.email) {
      return fallbackUser.email.split('@')[0];
    }
    
    return 'User';
  }

  /**
   * Sync auth metadata to profiles table - for data migration/consistency
   */
  async syncAuthToProfile(user: User): Promise<{ success: boolean; error?: string }> {
    try {
      const metadata = user.user_metadata || {};
      
      const profileData = {
        first_name: metadata.first_name || null,
        last_name: metadata.last_name || null,
        phone: metadata.phone || null,
        country_code: metadata.country_code || 'US',
        username: metadata.full_name || 
                 (metadata.first_name && metadata.last_name ? 
                  `${metadata.first_name} ${metadata.last_name}` : 
                  user.email?.split('@')[0]) || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(
          { id: user.id, ...profileData },
          { onConflict: 'id' }
        );

      if (error) {
        console.error('Error syncing auth to profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in syncAuthToProfile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create or update user profile ensuring consistency
   */
  async createOrUpdateProfile(
    userId: string,
    profileData: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          { 
            id: userId, 
            ...profileData,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        );

      if (error) {
        console.error('Error creating/updating profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in createOrUpdateProfile:', error);
      return { success: false, error: error.message };
    }
  }
}

export const profileService = new ProfileService();
