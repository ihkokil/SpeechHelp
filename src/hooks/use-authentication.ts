
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export const useAuthentication = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(false);
    
    if (error) {
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
    setIsLoading(false);
    
    if (error) {
      throw error;
    }
    
    return { user: data.user, session: data.session };
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLoading(false);
    
    if (error) {
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
