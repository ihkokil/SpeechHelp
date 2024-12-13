
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';
import { Speech } from '@/types/speech';
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
    if (!session) {
      console.log('No session available for refresh');
      return;
    }
    
    try {
      // Get fresh user data
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error refreshing user data:', userError);
        return;
      }
      
      if (userData.user) {
        // Get profile data to include subscription info
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single();

        if (!profileError && profileData) {
          // Merge profile data into user metadata
          const updatedUser = {
            ...userData.user,
            user_metadata: {
              ...userData.user.user_metadata,
              subscription_plan: profileData.subscription_plan,
              subscription_start_date: profileData.subscription_start_date,
              subscription_end_date: profileData.subscription_end_date,
              stripe_customer_id: profileData.stripe_customer_id,
              stripe_subscription_id: profileData.stripe_subscription_id,
            }
          };
          setUser(updatedUser);
          console.log('User data refreshed with subscription info:', updatedUser);
        } else {
          setUser(userData.user);
          console.log('User data refreshed (no profile found):', userData.user);
        }
      }
    } catch (error) {
      console.error('Error in refreshUserData:', error);
    }
  };

  // Fetch speeches when needed
  const fetchSpeeches = async () => {
    if (!user) {
      console.log('Cannot fetch speeches: No user is logged in');
      return [];
    }
    
    console.log('Fetching speeches for user:', user.id);
    try {
      const fetchedSpeeches = await speechService.fetchSpeeches(user.id);
      console.log(`Successfully fetched ${fetchedSpeeches.length} speeches from database`);
      setSpeeches(fetchedSpeeches);
      return fetchedSpeeches;
    } catch (error) {
      console.error('Error in fetchSpeeches:', error);
      toast({
        title: "Error fetching speeches",
        description: "Could not load your speeches. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Save a new speech
  const saveSpeech = async (title: string, content: string, speechType: string) => {
    if (!user) return;
    await speechService.saveSpeech(user.id, title, content, speechType);
    await fetchSpeeches();
  };

  // Update an existing speech
  const updateSpeech = async (id: string, title: string, content: string) => {
    if (!user) return;
    await speechService.updateSpeech(user.id, id, title, content);
    await fetchSpeeches();
  };

  // Delete a speech
  const deleteSpeech = async (id: string) => {
    if (!user) return;
    await speechService.deleteSpeech(user.id, id);
    await fetchSpeeches();
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
        setSession(data.session);
        
        // Get user with profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (profileData) {
          const userWithProfile = {
            ...data.session.user,
            user_metadata: {
              ...data.session.user.user_metadata,
              subscription_plan: profileData.subscription_plan,
              subscription_start_date: profileData.subscription_start_date,
              subscription_end_date: profileData.subscription_end_date,
              stripe_customer_id: profileData.stripe_customer_id,
              stripe_subscription_id: profileData.stripe_subscription_id,
            }
          };
          setUser(userWithProfile);
        } else {
          setUser(data.session.user);
        }
        
        await fetchSpeeches();
      }
      
      setIsLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(`Auth state changed: ${event}`);
      setSession(newSession);
      
      if (newSession?.user) {
        // Get profile data when auth state changes
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newSession.user.id)
          .single();

        if (profileData) {
          const userWithProfile = {
            ...newSession.user,
            user_metadata: {
              ...newSession.user.user_metadata,
              subscription_plan: profileData.subscription_plan,
              subscription_start_date: profileData.subscription_start_date,
              subscription_end_date: profileData.subscription_end_date,
              stripe_customer_id: profileData.stripe_customer_id,
              stripe_subscription_id: profileData.stripe_subscription_id,
            }
          };
          setUser(userWithProfile);
        } else {
          setUser(newSession.user);
        }
        
        // Defer the fetch to avoid potential auth state conflicts
        setTimeout(() => {
          fetchSpeeches();
        }, 0);
      } else {
        setUser(null);
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
