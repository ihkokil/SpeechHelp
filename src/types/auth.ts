
import { Session, User } from "@supabase/supabase-js";
import { Speech } from './speech';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  speeches: Speech[];
  fetchSpeeches: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  refreshUser: () => Promise<void>;
  saveSpeech: (title: string, content: string, speechType: string) => Promise<void>;
  updateSpeech: (id: string, title: string, content: string) => Promise<void>;
  deleteSpeech: (id: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signOut: () => Promise<void>;
};
