
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export const useAuthentication = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state once on component mount
  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log(`Auth state changed: ${event}`);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      } else if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      setIsLoading(false);
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getSession = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
    } else if (data?.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
    
    setIsLoading(false);
    return { session: data?.session, user: data?.session?.user };
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setIsLoading(false);
      throw error;
    }
    
    return { user: data.user, session: data.session };
  };

  const signUp = async (email: string, password: string, metadata?: { first_name?: string, last_name?: string }) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) {
      setIsLoading(false);
      throw error;
    }
    
    return { user: data.user, session: data.session };
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return {
    user,
    session,
    isLoading,
    getSession,
    signIn,
    signUp,
    signOut
  };
};
