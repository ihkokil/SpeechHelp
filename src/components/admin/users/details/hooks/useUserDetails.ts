
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Speech } from '../../types';

export const useUserDetails = (user: User | null, open: boolean) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(false);
  const [userJoinedDays, setUserJoinedDays] = useState<number>(0);
  const [totalActivityTime, setTotalActivityTime] = useState<number>(0);

  // Function to reset all states
  const resetState = useCallback(() => {
    console.log('Resetting user details state');
    setSpeeches([]);
    setIsLoadingSpeeches(false);
    setUserJoinedDays(0);
    setTotalActivityTime(0);
  }, []);

  // Function to fetch speech data
  const fetchUserSpeeches = useCallback(async (userId: string) => {
    if (!userId) {
      console.log('No userId provided for speech fetching');
      return;
    }
    
    setIsLoadingSpeeches(true);
    try {
      console.log('Fetching speeches for user:', userId);
      
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching user speeches:', error);
        setSpeeches([]);
      } else {
        console.log('Fetched speeches for user:', userId, 'Count:', data?.length || 0);
        console.log('Speech data:', data);
        setSpeeches(data || []);
        calculateTotalActivityTime(data || []);
      }
    } catch (error) {
      console.error('Exception fetching user speeches:', error);
      setSpeeches([]);
    } finally {
      setIsLoadingSpeeches(false);
    }
  }, []);

  // Calculate user statistics
  const calculateUserStats = useCallback((user: User) => {
    // Calculate days since user joined
    if (!user?.created_at) return;
    
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setUserJoinedDays(diffDays);
  }, []);
  
  // Calculate activity time based on speeches
  const calculateTotalActivityTime = useCallback((speeches: Speech[]) => {
    // Enhanced estimate of total activity time:
    // - Base time for each speech: 5 minutes
    // - Additional time based on content length: 1 minute per 500 chars
    // - Consider speech type (certain types take more time)
    
    const speechTypeMultipliers: Record<string, number> = {
      'wedding': 1.5,      // Wedding speeches often require more effort
      'business': 1.3,     // Business presentations need more preparation
      'tedtalk': 1.7,      // TED talks need significant preparation
      'funeral': 1.4,      // Emotional speeches take more time
      'keynote': 1.5,      // Keynotes are typically longer/more complex
      'default': 1.0       // Default multiplier
    };
    
    const totalTime = speeches.reduce((total, speech) => {
      // Base time
      let estimatedMinutes = 5;
      
      // Content length factor
      const contentLength = speech.content?.length || 0;
      estimatedMinutes += Math.floor(contentLength / 500);
      
      // Speech type multiplier
      const typeMultiplier = speechTypeMultipliers[speech.speech_type?.toLowerCase()] || speechTypeMultipliers.default;
      estimatedMinutes = Math.round(estimatedMinutes * typeMultiplier);
      
      return total + estimatedMinutes;
    }, 0);
    
    setTotalActivityTime(totalTime);
  }, []);

  // Reset states and fetch data when the drawer opens with a user
  useEffect(() => {
    let isMounted = true;
    
    if (user && open) {
      console.log('User details drawer opened for user:', user.id);
      console.log('User data:', user);
      
      if (isMounted) {
        // Reset state first
        resetState();
        
        // Calculate user stats
        calculateUserStats(user);
        
        // Fetch speeches for this user
        fetchUserSpeeches(user.id);
      }
    } else if (!open) {
      console.log('User details drawer closed, resetting state');
      // Reset state when drawer closes
      if (isMounted) {
        resetState();
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, open, fetchUserSpeeches, calculateUserStats, resetState]);

  return {
    speeches,
    isLoadingSpeeches,
    userJoinedDays,
    totalActivityTime,
    resetState
  };
};
