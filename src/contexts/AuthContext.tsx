
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
    let mounted = true;

    // Helper function to update user with profile data
    const updateUserWithProfile = async (sessionUser: User) => {
      if (!mounted) return sessionUser;
      
      console.log('updateUserWithProfile called with user:', sessionUser.id);
      
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        if (profileData && mounted) {
          const enrichedUser = {
            ...sessionUser,
            user_metadata: {
              ...sessionUser.user_metadata,
              subscription_plan: profileData.subscription_plan,
              subscription_start_date: profileData.subscription_start_date,
              subscription_end_date: profileData.subscription_end_date,
              stripe_customer_id: profileData.stripe_customer_id,
              stripe_subscription_id: profileData.stripe_subscription_id,
            }
          };
          console.log('User enriched with profile data:', enrichedUser);
          return enrichedUser;
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
      
      console.log('Returning user without profile enrichment');
      return sessionUser;
    };

    // Check for existing session
    const getSession = async () => {
      if (!mounted) return;
      
      console.log('AuthContext - Checking for existing session');
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
        } else if (data?.session) {
          console.log('AuthContext - Found existing session');
          setSession(data.session);
          
          const userWithProfile = await updateUserWithProfile(data.session.user);
          if (mounted) {
            console.log('Setting user from existing session:', userWithProfile);
            setUser(userWithProfile);
            // Defer the fetch to avoid potential auth state conflicts
            setTimeout(() => {
              if (mounted) fetchSpeeches();
            }, 0);
          }
        } else {
          console.log('AuthContext - No existing session found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      console.log(`AuthContext - Auth state changed: ${event}`);
      
      setSession(newSession);
      
      if (newSession?.user) {
        console.log('AuthContext - User authenticated, updating user data');
        
        try {
          const userWithProfile = await updateUserWithProfile(newSession.user);
          if (mounted) {
            console.log('Setting user from auth state change:', userWithProfile);
            setUser(userWithProfile);
            // Always set loading to false after setting user
            setIsLoading(false);
            // Defer the fetch to avoid potential auth state conflicts
            setTimeout(() => {
              if (mounted) fetchSpeeches();
            }, 0);
          }
        } catch (error) {
          console.error('Error updating user with profile:', error);
          if (mounted) {
            setUser(newSession.user);
            setIsLoading(false);
          }
        }
      } else {
        console.log('AuthContext - User signed out, clearing user data');
        if (mounted) {
          setUser(null);
          setSpeeches([]);
          setIsLoading(false);
        }
      }
    });

    // Initialize session check
    getSession();

    return () => {
      mounted = false;
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
