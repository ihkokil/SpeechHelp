
import { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthOperations } from '@/hooks/use-auth-operations';
import { useSpeechOperations } from '@/hooks/use-speech-operations';
import { AuthContextType, Speech } from '@/types/speech';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { 
    user, 
    setUser, 
    session, 
    setSession, 
    isLoading, 
    setIsLoading, 
    signIn, 
    signUp, 
    signOut 
  } = useAuthOperations();

  const { 
    speeches, 
    fetchSpeeches, 
    saveSpeech, 
    updateSpeech, 
    deleteSpeech 
  } = useSpeechOperations(user);

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
      }
      
      setIsLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [fetchSpeeches]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      speeches, 
      fetchSpeeches, 
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

export type { Speech };
