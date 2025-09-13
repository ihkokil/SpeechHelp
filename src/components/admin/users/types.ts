
export interface User {
  id: string;
  email: string;
  last_sign_in_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    name?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    country_code?: string;
    street_address?: string;
    streetAddress?: string;
    address?: string;
    city?: string;
    state?: string;
    province?: string;
    zip_code?: string;
    zipCode?: string;
    postal_code?: string;
    postalCode?: string;
    country?: string;
    countryCode?: string;
  };
  // Add raw_user_meta_data to access original auth metadata
  raw_user_meta_data?: {
    first_name?: string;
    firstName?: string;
    last_name?: string;
    lastName?: string;
    name?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    country_code?: string;
    street_address?: string;
    streetAddress?: string;
    address?: string;
    city?: string;
    state?: string;
    province?: string;
    stateProvince?: string;
    zip_code?: string;
    zipCode?: string;
    postal_code?: string;
    postalCode?: string;
    country?: string;
    [key: string]: any;
  };
  is_active?: boolean;
  is_admin?: boolean;
  admin_role?: string | null;
  permissions?: string[];
  // User profile fields (direct access)
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  country_code?: string;
  avatar_url?: string;
  // Dedicated address columns from profiles table
  address_street_address?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  address_country_code?: string;
  // Subscription fields
  subscription_status?: string;
  subscription_plan?: string;
  subscription_period?: string | null;
  subscription_amount?: number | null;
  subscription_start_date?: string | null;
  subscription_end_date?: string | null;
  subscription_price_id?: string | null;
  subscription_currency?: string;
  // Stripe fields
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
}

// Add these interfaces to fix the AdminPermissionsDialog import errors
export interface AdminRole {
  id: string;
  name: string;
  description?: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  description?: string;
}
