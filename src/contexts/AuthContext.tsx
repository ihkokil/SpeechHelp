
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '@/types/auth';
import { useAuthentication } from '@/hooks/use-authentication';
import { useSpeeches } from '@/hooks/use-speeches';

// Re-export Speech type from auth types
export type { Speech } from '@/types/auth';

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
  } = useAuthentication();

  const [isInitialized, setIsInitialized] = useState(false);

  const {
    speeches,
    fetchSpeeches,
    saveSpeech,
    updateSpeech,
    deleteSpeech
  } = useSpeeches(user);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          // Only attempt to fetch speeches if we have a valid session
          if (data.session.user) {
            try {
              await fetchSpeeches();
            } catch (err) {
              console.error('Failed to fetch speeches during initialization:', err);
            }
          }
        }
      } catch (err) {
        console.error('Unexpected error during session check:', err);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(`Auth state changed: ${event}`);
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        try {
          await fetchSpeeches();
        } catch (err) {
          console.error('Failed to fetch speeches after auth state change:', err);
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [fetchSpeeches, setIsLoading, setSession, setUser]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading: isLoading || !isInitialized, // Prevent UI changes until fully initialized
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
