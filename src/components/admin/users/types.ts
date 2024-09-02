
export type User = {
  id: string;
  email: string;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string | null;
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
  user_metadata: {
    name?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    country_code?: string;
  };
  is_active?: boolean;
  // Admin role related fields
  is_admin?: boolean;
  admin_role?: string;
  permissions?: string[];
  // Subscription related fields
  subscription_status?: string;
  subscription_end_date?: string;
  subscription_plan?: string;
  subscription_plan?: string;
  // Stripe related fields
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
};

export interface Speech {
  id: string;
  user_id: string;
  title: string;
  content: string;
  speech_type: string;
  created_at: string;
  updated_at: string | null;
}

export type SpeechTypeStats = {
  type: string;
  count: number;
};

export type AdminRole = {
  id: string;
  name: string;
  description: string;
};

export type AdminPermission = {
  id: string;
  name: string;
  description: string;
};
