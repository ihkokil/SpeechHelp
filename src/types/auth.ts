
import { Session, User } from "@supabase/supabase-js";

export type Speech = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  speech_type: string;
};

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  speeches: Speech[];
  fetchSpeeches: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  saveSpeech: (title: string, content: string, speechType: string) => Promise<void>;
  updateSpeech: (id: string, title: string, content: string) => Promise<void>;
  deleteSpeech: (id: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signOut: () => Promise<void>;
};
