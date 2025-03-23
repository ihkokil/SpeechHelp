
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
    // Set up auth state listener FIRST (to catch all auth state changes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
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

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
      } else if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        await fetchSpeeches();
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSpeeches = async () => {
    if (!user) return;
    
    try {
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
    } catch (err) {
      console.error('Exception in fetchSpeeches:', err);
    }
  };

  const saveSpeech = async (title: string, content: string, speechType: string) => {
    if (!user) {
      throw new Error("You must be logged in to save speeches");
    }
    
    // Form validation
    if (!title.trim()) {
      throw new Error("Speech title is required");
    }
    
    if (!content.trim()) {
      throw new Error("Speech content is required");
    }
    
    if (!speechType.trim()) {
      speechType = "other"; // Default fallback
    }
    
    console.log("Inserting speech with data:", {
      user_id: user.id,
      title: title,
      content: content,
      speech_type: speechType
    });
    
    try {
      const { error } = await supabase
        .from('speeches')
        .insert({
          user_id: user.id,
          title: title,
          content: content,
          speech_type: speechType
        });
      
      if (error) {
        console.error('Error details from Supabase:', error);
        throw error;
      }
      
      toast({
        title: "Speech Saved",
        description: "Your speech has been saved to your account.",
      });
      
      await fetchSpeeches();
    } catch (err) {
      console.error('Exception in saveSpeech:', err);
      throw err;
    }
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
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
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
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
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
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
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
