
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType, Speech } from '@/types/auth';
import { signIn, signUp, signOut } from '@/services/authService';
import { useSpeechService } from '@/services/speechService';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const speechesFetchedRef = useRef(false);
  
  const { toast } = useToast();
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
  const fetchSpeeches = useCallback(async () => {
    if (!user) {
      console.log('Cannot fetch speeches: No user logged in');
      return [];
    }
    
    if (speechesFetchedRef.current) {
      console.log('Speeches already fetched, using cached data');
      return speeches;
    }
    
    console.log('AuthContext: Fetching speeches for user:', user.id);
    try {
      const fetchedSpeeches = await speechService.fetchSpeeches(user.id);
      console.log(`AuthContext: Got ${fetchedSpeeches.length} speeches`);
      setSpeeches(fetchedSpeeches);
      speechesFetchedRef.current = true;
      return fetchedSpeeches;
    } catch (error) {
      console.error('Error fetching speeches:', error);
      toast({
        title: "Error fetching speeches",
        description: "Could not retrieve your speeches. Please try again later.",
        variant: "destructive"
      });
      return [];
    }
  }, [user, speechService, toast, speeches]);

  // Save a new speech
  const saveSpeech = async (title: string, content: string, speechType: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save a speech.",
        variant: "destructive"
      });
      throw new Error("User not authenticated");
    }
    
    try {
      const newSpeech = await speechService.saveSpeech(user.id, title, content, speechType);
      // Update the speeches array with the new speech
      setSpeeches(prev => [newSpeech, ...prev]);
      return newSpeech;
    } catch (error) {
      console.error('Error saving speech:', error);
      toast({
        title: "Error saving speech",
        description: "Could not save your speech. Please try again later.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Update an existing speech
  const updateSpeech = async (id: string, title: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update a speech.",
        variant: "destructive"
      });
      throw new Error("User not authenticated");
    }
    
    try {
      const updatedSpeech = await speechService.updateSpeech(user.id, id, title, content);
      // Update the speeches array
      setSpeeches(prev => prev.map(speech => 
        speech.id === id ? updatedSpeech : speech
      ));
      return updatedSpeech;
    } catch (error) {
      console.error('Error updating speech:', error);
      toast({
        title: "Error updating speech",
        description: "Could not update your speech. Please try again later.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Delete a speech
  const deleteSpeech = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to delete a speech.",
        variant: "destructive"
      });
      throw new Error("User not authenticated");
    }
    
    try {
      await speechService.deleteSpeech(user.id, id);
      // Remove the speech from the speeches array
      setSpeeches(prev => prev.filter(speech => speech.id !== id));
    } catch (error) {
      console.error('Error deleting speech:', error);
      toast({
        title: "Error deleting speech",
        description: "Could not delete your speech. Please try again later.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Auth functions wrapped to control loading state
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signIn(email, password, toast);
      // Reset speeches fetch state on sign in
      speechesFetchedRef.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    try {
      await signUp(email, password, toast, firstName, lastName);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(toast);
      // Clear speeches on sign out
      setSpeeches([]);
      setUser(null);
      setSession(null);
      // Reset speeches fetch state
      speechesFetchedRef.current = false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthContext initializing');
    let unsubscribe: (() => void) | undefined;
    
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // First set up auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log(`Auth state changed: ${event}`);
          
          // Update session state
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Reset speeches fetch state on auth change
          if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
            speechesFetchedRef.current = false;
          }
          
          setIsLoading(false);
        }
      );
      
      // Then check for existing session
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        console.log('Got existing session, setting user:', data.session.user.id);
        setSession(data.session);
        setUser(data.session.user);
      }
      
      setIsInitialized(true);
      setIsLoading(false);
      
      unsubscribe = () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
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
      signIn: handleSignIn, 
      signUp: handleSignUp, 
      signOut: handleSignOut 
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
