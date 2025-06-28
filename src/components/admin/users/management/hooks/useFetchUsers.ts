
import { useState, useCallback, useRef } from 'react';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();
  const { translate } = useTranslatedContent();

  const fetchUsers = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTime < 1000) {
      console.log('Debouncing fetch request');
      return []; // Debounce fetch requests
    }
    
    setLastFetchTime(now);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users from Supabase auth');
      
      // Fetch users from auth.users via a Supabase function
      const { data: authUsersData, error: authUsersError } = await supabase.functions.invoke('fetch-users', {
        method: 'GET'
      });
      
      if (authUsersError) {
        console.error('Error fetching auth users:', authUsersError);
        setError(new Error(authUsersError.message || translate('admin.messages.loadUsersError')));
        toast({
          title: translate('common.error'),
          description: translate('admin.messages.loadUsersError'),
          variant: 'destructive',
        });
        setIsLoading(false);
        return [];
      }
      
      console.log('Raw edge function response:', authUsersData);
      console.log('First user raw data from edge function:', authUsersData?.users?.[0]);
      
      // Map users with their profiles, ensuring all subscription fields are properly retrieved
      const mappedUsers: User[] = authUsersData?.users?.map((authUser: any) => {
        console.log('Processing user:', authUser.id);
        console.log('User subscription fields from edge function:', {
          subscription_plan: authUser.subscription_plan,
          subscription_period: authUser.subscription_period,
          subscription_amount: authUser.subscription_amount,
          subscription_status: authUser.subscription_status,
          subscription_start_date: authUser.subscription_start_date,
          subscription_end_date: authUser.subscription_end_date,
          stripe_customer_id: authUser.stripe_customer_id,
          stripe_subscription_id: authUser.stripe_subscription_id
        });
        
        // Get the profile data from our enhanced structure
        const profile = authUser.profile || {};
        console.log('Profile data for user', authUser.id, ':', profile);
        
        // Debug phone number extraction
        const profilePhone = profile.phone || authUser.phone || '';
        const metadataPhone = authUser.raw_user_meta_data?.phone || '';
        const profileCountryCode = profile.country_code || authUser.country_code || '';
        const metadataCountryCode = authUser.raw_user_meta_data?.country_code || '';
        
        console.log('📞 Phone debug for user', authUser.id, ':', {
          profilePhone,
          metadataPhone,
          profileCountryCode,
          metadataCountryCode,
          finalPhone: profilePhone || metadataPhone,
          finalCountryCode: profileCountryCode || metadataCountryCode || 'US'
        });
        
        const user: User = {
          id: authUser.id,
          email: authUser.email || 'No email',
          last_sign_in_at: authUser.last_sign_in_at,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at || null,
          app_metadata: {
            provider: authUser.app_metadata?.provider || 'email',
            providers: authUser.app_metadata?.providers || ['email'],
          },
          user_metadata: {
            first_name: authUser.raw_user_meta_data?.first_name || profile.first_name || authUser.first_name || '',
            last_name: authUser.raw_user_meta_data?.last_name || profile.last_name || authUser.last_name || '',
            name: authUser.raw_user_meta_data?.full_name || authUser.raw_user_meta_data?.name || profile.username || authUser.email?.split('@')[0] || 'User',
            full_name: authUser.raw_user_meta_data?.full_name || authUser.raw_user_meta_data?.name || profile.username || '',
            email: authUser.email,
            phone: profilePhone || metadataPhone,
            country_code: profileCountryCode || metadataCountryCode || 'US',
            street_address: authUser.raw_user_meta_data?.street_address || '',
            city: authUser.raw_user_meta_data?.city || '',
            state: authUser.raw_user_meta_data?.state || '',
            zip_code: authUser.raw_user_meta_data?.zip_code || '',
            country: authUser.raw_user_meta_data?.country || '',
          },
          is_active: authUser.is_active !== false,
          // Ensure admin status comes from the profile
          is_admin: authUser.is_admin === true,
          admin_role: authUser.admin_role || null,
          permissions: authUser.permissions || [],
          // Map all subscription fields with extensive debugging
          subscription_status: authUser.subscription_status || 'inactive',
          subscription_plan: authUser.subscription_plan || 'free_trial',
          subscription_period: authUser.subscription_period || null,
          subscription_amount: authUser.subscription_amount || null,
          subscription_start_date: authUser.subscription_start_date || null,
          subscription_end_date: authUser.subscription_end_date || null,
          subscription_price_id: authUser.subscription_price_id || null,
          subscription_currency: authUser.subscription_currency || 'usd',
          // Add direct fields from profiles table for easier access - prioritize profiles table data
          first_name: profile.first_name || authUser.first_name || authUser.raw_user_meta_data?.first_name || '',
          last_name: profile.last_name || authUser.last_name || authUser.raw_user_meta_data?.last_name || '',
          phone: profilePhone || metadataPhone,
          country_code: profileCountryCode || metadataCountryCode || 'US',
          // Stripe related fields
          stripe_customer_id: authUser.stripe_customer_id || null,
          stripe_subscription_id: authUser.stripe_subscription_id || null,
        };
        
        console.log('Final mapped user phone fields for', authUser.id, ':', {
          id: user.id,
          phone: user.phone,
          country_code: user.country_code,
          user_metadata_phone: user.user_metadata?.phone
        });
        
        return user;
      }) || [];
      
      // Add admin user if it doesn't exist and current user is admin
      const adminExists = mappedUsers.some(user => user.is_admin);
      if (!adminExists && adminUser) {
        mappedUsers.push({
          id: 'admin-id',
          email: adminUser.email || 'admin@speechhelp.ai',
          last_sign_in_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: {
            provider: 'email',
          },
          user_metadata: {
            name: adminUser.username,
            full_name: 'Admin User',
          },
          is_active: true,
          is_admin: true,
          admin_role: 'Super Admin',
          permissions: ['view_users', 'manage_users', 'view_speeches', 'manage_speeches', 'system_settings'],
        });
      }
      
      console.log('Final mapped users count:', mappedUsers.length);
      console.log('Sample user with phone data:', mappedUsers.find(u => u.phone && u.phone !== ''));
      setUsers(mappedUsers);
      return mappedUsers;
    } catch (err) {
      console.error('Exception fetching users:', err);
      const error = err instanceof Error ? err : new Error(translate('admin.messages.loadUsersError'));
      setError(error);
      toast({
        title: translate('common.error'),
        description: translate('admin.messages.loadUsersErrorDetails'),
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [adminUser, toast, lastFetchTime, translate]);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    error
  };
};
