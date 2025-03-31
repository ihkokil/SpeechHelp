
import { createContext, useContext, useEffect, useState } from 'react';
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
  const fetchSpeeches = async () => {
    if (!user) {
      console.log('Cannot fetch speeches: No user logged in');
      return;
    }
    
    console.log('AuthContext: Fetching speeches for user:', user.id);
    const fetchedSpeeches = await speechService.fetchSpeeches(user.id);
    console.log(`AuthContext: Got ${fetchedSpeeches.length} speeches`);
    setSpeeches(fetchedSpeeches);
  };

  // Save a new speech
  const saveSpeech = async (title: string, content: string, speechType: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save a speech.",
        variant: "destructive"
      });
      return;
    }
    
    const newSpeech = await speechService.saveSpeech(user.id, title, content, speechType);
    // Update the speeches array with the new speech
    setSpeeches(prev => [newSpeech, ...prev]);
  };

  // Update an existing speech
  const updateSpeech = async (id: string, title: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update a speech.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSpeech = await speechService.updateSpeech(user.id, id, title, content);
    // Update the speeches array
    setSpeeches(prev => prev.map(speech => 
      speech.id === id ? updatedSpeech : speech
    ));
  };

  // Delete a speech
  const deleteSpeech = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to delete a speech.",
        variant: "destructive"
      });
      return;
    }
    
    await speechService.deleteSpeech(user.id, id);
    // Remove the speech from the speeches array
    setSpeeches(prev => prev.filter(speech => speech.id !== id));
  };

  // Auth functions wrapped to control loading state
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signIn(email, password, toast);
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
        console.log('Got existing session, setting user:', data.session.user.id);
        setSession(data.session);
        setUser(data.session.user);
        // Fetch speeches after setting the user
        try {
          const fetchedSpeeches = await speechService.fetchSpeeches(data.session.user.id);
          console.log(`Initial fetch: Got ${fetchedSpeeches.length} speeches`);
          setSpeeches(fetchedSpeeches);
        } catch (e) {
          console.error('Error fetching speeches on init:', e);
        }
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
        console.log('Auth changed, new user set:', newSession.user.id);
        try {
          const fetchedSpeeches = await speechService.fetchSpeeches(newSession.user.id);
          console.log(`Auth change: Got ${fetchedSpeeches.length} speeches`);
          setSpeeches(fetchedSpeeches);
        } catch (e) {
          console.error('Error fetching speeches on auth change:', e);
          setSpeeches([]);
        }
      } else {
        console.log('Auth changed, no user, clearing speeches');
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
