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

export interface Speech {
  id: string;
  user_id: string;
  title: string;
  content: string;
  speech_type: string;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}
