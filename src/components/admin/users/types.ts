
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
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  // Add raw_user_meta_data to access original auth metadata
  raw_user_meta_data?: {
    first_name?: string;
    last_name?: string;
    name?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    country_code?: string;
    street_address?: string;
    address?: string;
    city?: string;
    state?: string;
    province?: string;
    zip_code?: string;
    postal_code?: string;
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
