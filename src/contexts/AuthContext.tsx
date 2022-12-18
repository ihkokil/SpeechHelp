
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export type Speech = {
  id: string;
  title: string;
  content: string;
  speech_type: string;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  speeches: Speech[];
  fetchSpeeches: () => Promise<void>;
  saveSpeech: (title: string, content: string, speechType: string) => Promise<void>;
  updateSpeech: (id: string, title: string, content: string) => Promise<void>;
  deleteSpeech: (id: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const { toast } = useToast();

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

  const fetchSpeeches = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('speeches')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching speeches:', error);
      toast({
        title: "Error fetching speeches",
        description: error.message,
        variant: "destructive"
      });
      return;
    }
    
    setSpeeches(data || []);
  };

  const saveSpeech = async (title: string, content: string, speechType: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('speeches')
      .insert({
        user_id: user.id,
        title,
        content,
        speech_type: speechType
      });
    
    if (error) {
      console.error('Error saving speech:', error);
      toast({
        title: "Error saving speech",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    toast({
      title: "Speech Saved",
      description: "Your speech has been saved to your account.",
    });
    
    await fetchSpeeches();
  };

  const updateSpeech = async (id: string, title: string, content: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('speeches')
      .update({
        title,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error updating speech:', error);
      toast({
        title: "Error updating speech",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    toast({
      title: "Speech updated",
      description: "Your speech has been updated successfully.",
    });
    
    await fetchSpeeches();
  };

  const deleteSpeech = async (id: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('speeches')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error deleting speech:', error);
      toast({
        title: "Error deleting speech",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    toast({
      title: "Speech deleted",
      description: "Your speech has been deleted successfully.",
    });
    
    await fetchSpeeches();
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    
    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
    setIsLoading(false);
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    toast({
      title: "Sign up successful",
      description: "Welcome to SpeechHelp! Please check your email to confirm your account.",
    });
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

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
