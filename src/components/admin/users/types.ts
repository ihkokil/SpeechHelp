
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string | null;
  last_sign_in_at?: string | null;
  is_active?: boolean;
  is_admin?: boolean;
  admin_role?: string;
  permissions?: string[];
  subscription_status?: string;
  subscription_plan?: string | null;
  subscription_end_date?: string | null;
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  user_metadata?: {
    name?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    country_code?: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  // Direct fields from profiles table
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  // Stripe related fields
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export interface Speech {
  id: string;
  title: string;
  content: string;
  speech_type: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface SpeechTypeStats {
  type: string;
  count: number;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
}
