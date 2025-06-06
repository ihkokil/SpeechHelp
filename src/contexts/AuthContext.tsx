
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Speech } from '@/types/speech';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  speeches: Speech[];
  signOut: () => Promise<void>;
  fetchSpeeches: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  saveSpeech: (title: string, content: string, speechType: string) => Promise<void>;
  updateSpeech: (id: string, title: string, content: string) => Promise<void>;
  deleteSpeech: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const { toast } = useToast();

  const fetchSpeeches = async () => {
    if (!user) {
      console.info('Cannot fetch speeches: No user is logged in');
      return;
    }

    try {
      console.info('Fetching speeches for user:', user.id);
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching speeches:', error);
        return;
      }

      console.info('Successfully fetched', data?.length || 0, 'speeches from database');
      const processedSpeeches = data?.map(speech => ({
        ...speech,
        created_at: speech.created_at,
        updated_at: speech.updated_at
      })) || [];

      setSpeeches(processedSpeeches);
    } catch (error) {
      console.error('Error in fetchSpeeches:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error refreshing user:', error);
        return;
      }
      
      setUser(user);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error refreshing session:', sessionError);
        return;
      }
      
      setSession(session);
      console.log('User refreshed successfully:', user?.id);
    } catch (error) {
      console.error('Error in refreshUser:', error);
    }
  };

  const refreshUserData = async () => {
    await refreshUser();
    if (user) {
      await fetchSpeeches();
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      console.log('Attempting to sign up with email:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || '',
            last_name: lastName || '',
            full_name: firstName && lastName ? `${firstName} ${lastName}` : '',
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      console.log('User signed up successfully:', data.user?.id);
      
      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
      } else {
        toast({
          title: "Account created successfully",
          description: "Welcome to SpeechHelp!",
        });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const saveSpeech = async (title: string, content: string, speechType: string) => {
    if (!user) {
      throw new Error('User must be logged in to save speech');
    }

    try {
      const { data, error } = await supabase
        .from('speeches')
        .insert({
          user_id: user.id,
          title,
          content,
          speech_type: speechType,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('Speech saved successfully:', data.id);
      await fetchSpeeches();
    } catch (error) {
      console.error('Error saving speech:', error);
      throw error;
    }
  };

  const updateSpeech = async (id: string, title: string, content: string) => {
    try {
      const { error } = await supabase
        .from('speeches')
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      console.log('Speech updated successfully:', id);
      await fetchSpeeches();
    } catch (error) {
      console.error('Error updating speech:', error);
      throw error;
    }
  };

  const deleteSpeech = async (id: string) => {
    try {
      const { error } = await supabase
        .from('speeches')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      console.log('Speech deleted successfully:', id);
      await fetchSpeeches();
    } catch (error) {
      console.error('Error deleting speech:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('Successfully signed out');
        setUser(null);
        setSession(null);
        setSpeeches([]);
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listeners');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', session?.user?.id || 'No user');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setTimeout(() => {
              fetchSpeeches();
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          setSpeeches([]);
        }
      }
    );

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Fetch speeches when user changes (but not on initial load)
  useEffect(() => {
    if (user && !isLoading) {
      console.log('User changed, fetching speeches for:', user.id);
      fetchSpeeches();
    }
  }, [user, isLoading]);

  const value = {
    user,
    session,
    isLoading,
    speeches,
    signOut,
    fetchSpeeches,
    refreshUser,
    refreshUserData,
    signUp,
    saveSpeech,
    updateSpeech,
    deleteSpeech,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
