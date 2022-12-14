
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
    isInitialized: speechesInitialized,
    fetchSpeeches,
    saveSpeech,
    updateSpeech,
    deleteSpeech
  } = useSpeeches(user);

  // Memoized function to fetch speeches with better error handling
  const fetchSpeechesStable = useCallback(async () => {
    if (user) {
      try {
        console.log("Attempting to fetch speeches from context");
        await fetchSpeeches();
      } catch (err) {
        console.error('Failed to fetch speeches from context:', err);
      }
    }
  }, [user, fetchSpeeches]);

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(`Auth state changed: ${event}`, newSession?.user?.id || 'No user');
      
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
        
        // Wait a brief moment before fetching speeches to ensure auth is complete
        if (newSession?.user && mounted) {
          setTimeout(() => {
            if (mounted) fetchSpeechesStable();
          }, 500);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setIsLoading(false);
      }
    });

    // Then check for existing session
    const getSession = async () => {
      try {
        if (!mounted) return;
        
        setIsLoading(true);
        console.log("Getting session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
        } else if (data?.session && mounted) {
          console.log("Session found, user ID:", data.session.user.id);
          setSession(data.session);
          setUser(data.session.user);
          setIsLoading(false);
        } else {
          console.log("No session found");
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error during session check:', err);
        if (mounted) {
          setIsLoading(false);
        }
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    getSession();

    return () => {
      console.log("Auth context cleanup");
      mounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [fetchSpeechesStable, setIsLoading, setSession, setUser]);

  // Prevent state changes during component unmounting
  const contextValue = {
    user, 
    session, 
    // Combine loading states to prevent flashing
    isLoading: isLoading || !isInitialized || !speechesInitialized, 
    speeches, 
    fetchSpeeches: fetchSpeechesStable, 
    saveSpeech, 
    updateSpeech, 
    deleteSpeech, 
    signIn, 
    signUp, 
    signOut 
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
