
import { useState, useCallback, useRef } from 'react';
import { User } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

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
      console.log('🚀 Fetching users from Supabase auth');
      
      // Fetch users from auth.users via a Supabase function
      const { data: authUsersData, error: authUsersError } = await supabase.functions.invoke('fetch-users', {
        method: 'GET'
      });
      
      if (authUsersError) {
        console.error('❌ Error fetching auth users:', authUsersError);
        setError(new Error(authUsersError.message || 'Failed to load users'));
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return [];
      }
      
      console.log('📦 Raw edge function response:', authUsersData);
      console.log('👤 First user raw data from edge function:', authUsersData?.users?.[0]);
      
      // Enhanced user mapping with proper address data handling
      const mappedUsers: User[] = authUsersData?.users?.map((authUser: any) => {
        console.log('🔄 Processing user:', authUser.id);
        console.log('📊 User subscription fields from edge function:', {
          subscription_plan: authUser.subscription_plan,
          subscription_period: authUser.subscription_period,
          subscription_amount: authUser.subscription_amount,
          subscription_status: authUser.subscription_status,
          subscription_start_date: authUser.subscription_start_date,
          subscription_end_date: authUser.subscription_end_date,
          stripe_customer_id: authUser.stripe_customer_id,
          stripe_subscription_id: authUser.stripe_subscription_id
        });
        
        // CRITICAL: Log and map address fields from edge function response
        console.log('🏠 Address fields from edge function for user', authUser.id, ':', {
          address_street_address: authUser.address_street_address,
          address_city: authUser.address_city,
          address_state: authUser.address_state,
          address_zip_code: authUser.address_zip_code,
          address_country_code: authUser.address_country_code
        });
        
        // Get the profile data from our enhanced structure
        const profile = authUser.profile || {};
        console.log('👤 Profile data for user', authUser.id, ':', profile);
        
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

        // Enhanced address data extraction from edge function response
        const rawMetadata = authUser.raw_user_meta_data || {};
        const userMetadata = authUser.user_metadata || {};
        
        console.log('🏠 Address debug for user', authUser.id, ':', {
          raw_user_meta_data_keys: Object.keys(rawMetadata),
          user_metadata_keys: Object.keys(userMetadata),
          address_fields_raw: {
            street_address: rawMetadata.street_address,
            streetAddress: rawMetadata.streetAddress,
            address: rawMetadata.address,
            city: rawMetadata.city,
            state: rawMetadata.state,
            province: rawMetadata.province,
            zip_code: rawMetadata.zip_code,
            zipCode: rawMetadata.zipCode,
            postal_code: rawMetadata.postal_code,
            country: rawMetadata.country,
            country_code: rawMetadata.country_code
          },
          address_fields_user_meta: {
            street_address: userMetadata.street_address,
            streetAddress: userMetadata.streetAddress,
            address: userMetadata.address,
            city: userMetadata.city,
            state: userMetadata.state,
            province: userMetadata.province,
            zip_code: userMetadata.zip_code,
            zipCode: userMetadata.zipCode,
            postal_code: userMetadata.postal_code,
            country: userMetadata.country,
            country_code: userMetadata.country_code
          }
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
            first_name: authUser.raw_user_meta_data?.first_name || authUser.raw_user_meta_data?.firstName || profile.first_name || authUser.first_name || '',
            last_name: authUser.raw_user_meta_data?.last_name || authUser.raw_user_meta_data?.lastName || profile.last_name || authUser.last_name || '',
            name: authUser.raw_user_meta_data?.full_name || authUser.raw_user_meta_data?.name || profile.username || authUser.email?.split('@')[0] || 'User',
            full_name: authUser.raw_user_meta_data?.full_name || authUser.raw_user_meta_data?.name || profile.username || '',
            email: authUser.email,
            phone: profilePhone || metadataPhone,
            country_code: profileCountryCode || metadataCountryCode || 'US',
            // Enhanced address mapping - prioritize edge function data over metadata
            street_address: authUser.address_street_address || authUser.user_metadata?.street_address || authUser.user_metadata?.streetAddress || rawMetadata.street_address || rawMetadata.streetAddress || rawMetadata.address || '',
            streetAddress: authUser.address_street_address || authUser.user_metadata?.streetAddress || authUser.user_metadata?.street_address || rawMetadata.streetAddress || rawMetadata.street_address || rawMetadata.address || '',
            address: authUser.address_street_address || authUser.user_metadata?.address || rawMetadata.address || rawMetadata.street_address || rawMetadata.streetAddress || '',
            city: authUser.address_city || authUser.user_metadata?.city || rawMetadata.city || '',
            state: authUser.address_state || authUser.user_metadata?.state || authUser.user_metadata?.province || rawMetadata.state || rawMetadata.province || '',
            province: authUser.address_state || authUser.user_metadata?.province || authUser.user_metadata?.state || rawMetadata.province || rawMetadata.state || '',
            zip_code: authUser.address_zip_code || authUser.user_metadata?.zip_code || authUser.user_metadata?.zipCode || rawMetadata.zip_code || rawMetadata.zipCode || rawMetadata.postal_code || '',
            zipCode: authUser.address_zip_code || authUser.user_metadata?.zipCode || authUser.user_metadata?.zip_code || rawMetadata.zipCode || rawMetadata.zip_code || rawMetadata.postal_code || '',
            postal_code: authUser.address_zip_code || authUser.user_metadata?.postal_code || authUser.user_metadata?.zip_code || rawMetadata.postal_code || rawMetadata.zip_code || rawMetadata.zipCode || '',
            country: authUser.address_country_code || authUser.user_metadata?.country || authUser.user_metadata?.countryCode || rawMetadata.country || rawMetadata.countryCode || '',
            countryCode: authUser.address_country_code || authUser.user_metadata?.countryCode || authUser.user_metadata?.country || rawMetadata.countryCode || rawMetadata.country || '',
          },
          // Include raw_user_meta_data for address information access - PRESERVE EVERYTHING
          raw_user_meta_data: authUser.raw_user_meta_data || {},
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
          first_name: profile.first_name || authUser.first_name || authUser.raw_user_meta_data?.first_name || authUser.raw_user_meta_data?.firstName || '',
          last_name: profile.last_name || authUser.last_name || authUser.raw_user_meta_data?.last_name || authUser.raw_user_meta_data?.lastName || '',
          phone: profilePhone || metadataPhone,
          country_code: profileCountryCode || metadataCountryCode || 'US',
          // CRITICAL FIX: Map address fields directly from edge function response
          address_street_address: authUser.address_street_address || '',
          address_city: authUser.address_city || '',
          address_state: authUser.address_state || '',
          address_zip_code: authUser.address_zip_code || '',
          address_country_code: authUser.address_country_code || 'US',
          // Stripe related fields
          stripe_customer_id: authUser.stripe_customer_id || null,
          stripe_subscription_id: authUser.stripe_subscription_id || null,
        };
        
        console.log('✅ Final mapped user fields for', authUser.id, ':', {
          id: user.id,
          phone: user.phone,
          country_code: user.country_code,
          user_metadata_phone: user.user_metadata?.phone,
          // CRITICAL: Log final address mapping
          address_fields_final: {
            address_street_address: user.address_street_address,
            address_city: user.address_city,
            address_state: user.address_state,
            address_zip_code: user.address_zip_code,
            address_country_code: user.address_country_code
          },
          user_metadata_address: {
            street_address: user.user_metadata?.street_address,
            streetAddress: user.user_metadata?.streetAddress,
            city: user.user_metadata?.city,
            state: user.user_metadata?.state,
            zip_code: user.user_metadata?.zip_code,
            zipCode: user.user_metadata?.zipCode,
            country: user.user_metadata?.country
          },
          raw_user_meta_data_keys: Object.keys(user.raw_user_meta_data || {})
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
          raw_user_meta_data: {},
          is_active: true,
          is_admin: true,
          admin_role: 'Super Admin',
          permissions: ['view_users', 'manage_users', 'view_speeches', 'manage_speeches', 'system_settings'],
          // Add empty address fields for admin user
          address_street_address: '',
          address_city: '',
          address_state: '',
          address_zip_code: '',
          address_country_code: 'US',
        });
      }
      
      console.log('📈 Final mapping summary:', {
        totalUsers: mappedUsers.length,
        usersWithPhone: mappedUsers.filter(u => u.phone && u.phone !== '').length,
        usersWithAddressFromColumns: mappedUsers.filter(u => 
          u.address_street_address || 
          u.address_city ||
          u.address_state ||
          u.address_zip_code
        ).length,
        usersWithAddress: mappedUsers.filter(u => 
          u.raw_user_meta_data && (
            u.raw_user_meta_data.street_address || 
            u.raw_user_meta_data.streetAddress ||
            u.raw_user_meta_data.address ||
            u.raw_user_meta_data.city ||
            u.raw_user_meta_data.state ||
            u.raw_user_meta_data.zip_code ||
            u.raw_user_meta_data.zipCode
          )
        ).length,
        usersWithUserMetadataAddress: mappedUsers.filter(u => 
          u.user_metadata && (
            u.user_metadata.street_address || 
            u.user_metadata.streetAddress ||
            u.user_metadata.address ||
            u.user_metadata.city ||
            u.user_metadata.state ||
            u.user_metadata.zip_code ||
            u.user_metadata.zipCode
          )
        ).length
      });
      
      setUsers(mappedUsers);
      return mappedUsers;
    } catch (err) {
      console.error('💥 Exception fetching users:', err);
      const error = err instanceof Error ? err : new Error('Failed to load users');
      setError(error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please check console for details.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [adminUser, toast, lastFetchTime]);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    error
  };
};
