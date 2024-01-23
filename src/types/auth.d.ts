
import { Speech } from './speech';

export interface AuthContextType {
  user: any;
  session: any;
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
}
