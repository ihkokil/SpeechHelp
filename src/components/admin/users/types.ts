
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
  };
  is_active?: boolean;
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
