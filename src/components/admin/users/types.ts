
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
    email?: string; // Add email to user_metadata
  };
  is_active?: boolean;
  // Admin role related fields
  is_admin?: boolean;
  admin_role?: string;
  permissions?: string[];
};

export type Speech = {
  id: string;
  title: string;
  speech_type: string;
  created_at: string;
  content: string;
};

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
