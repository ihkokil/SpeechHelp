
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType, Speech } from '@/types/auth';
import { useAuthService } from '@/services/authService';
import { useSpeechService } from '@/services/speechService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  
  const authService = useAuthService();
  const speechService = useSpeechService();

  // Refresh user data from Supabase
  const refreshUserData = async () => {
    if (!session) return;
    
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error refreshing user data:', error);
      return;
    }
    
    if (data.user) {
      setUser(data.user);
    }
  };

  // Fetch speeches when needed
  const fetchSpeeches = async () => {
    if (!user) return;
    const fetchedSpeeches = await speechService.fetchSpeeches(user.id);
    setSpeeches(fetchedSpeeches);
  };

  // Save a new speech
  const saveSpeech = async (title: string, content: string, speechType: string) => {
    if (!user) return;
    await speechService.saveSpeech(user.id, title, content, speechType);
    await fetchSpeeches();
  };

  // Update an existing speech
  const updateSpeech = async (id: string, title: string, content: string) => {
    if (!user) return;
    await speechService.updateSpeech(user.id, id, title, content);
    await fetchSpeeches();
  };

  // Delete a speech
  const deleteSpeech = async (id: string) => {
    if (!user) return;
    await speechService.deleteSpeech(user.id, id);
    await fetchSpeeches();
  };

  // Auth functions wrapped to control loading state
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.signIn(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    try {
      await authService.signUp(email, password, firstName, lastName);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        await fetchSpeeches();
      }
      
      setIsLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(`Auth state changed: ${event}`);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        await fetchSpeeches();
      } else {
        setSpeeches([]);
      }
      
      setIsLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      speeches, 
      fetchSpeeches,
      refreshUserData,
      saveSpeech, 
      updateSpeech, 
      deleteSpeech, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
