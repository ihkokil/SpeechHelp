
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Speech } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserDetails = (user: User | null, open: boolean) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(false);
  const [userJoinedDays, setUserJoinedDays] = useState<number>(0);
  const [totalActivityTime, setTotalActivityTime] = useState<number>(0);
  const { toast } = useToast();

  // Function to reset all states
  const resetState = useCallback(() => {
    console.log('Resetting user details state');
    setSpeeches([]);
    setIsLoadingSpeeches(false);
    setUserJoinedDays(0);
    setTotalActivityTime(0);
  }, []);

  // Enhanced function to fetch speech data with multiple approaches
  const fetchUserSpeeches = useCallback(async (userId: string) => {
    if (!userId) {
      console.log('No userId provided for speech fetching');
      return;
    }
    
    console.log('🔍 Starting comprehensive speech fetch for user:', userId);
    setIsLoadingSpeeches(true);
    
    try {
      // First, let's try the standard query
      console.log('📋 Attempt 1: Standard query to speeches table');
      
      const { data: standardData, error: standardError, count: standardCount } = await supabase
        .from('speeches')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      console.log('📊 Standard query result:', { 
        data: standardData, 
        error: standardError, 
        count: standardCount,
        dataLength: standardData?.length 
      });
      
      // Second, let's try a more flexible query to see if there are any speeches at all
      console.log('📋 Attempt 2: Checking all speeches for debugging');
      
      const { data: allSpeeches, error: allError } = await supabase
        .from('speeches')
        .select('id, user_id, title, created_at')
        .limit(10);
        
      console.log('📊 All speeches sample (first 10):', { 
        data: allSpeeches, 
        error: allError,
        userIds: allSpeeches?.map(s => s.user_id)
      });
      
      // Third, let's check if there are speeches with this exact user ID using different approaches
      console.log('📋 Attempt 3: Case-insensitive and trimmed user ID search');
      
      const { data: flexibleData, error: flexibleError } = await supabase
        .from('speeches')
        .select('*')
        .or(`user_id.eq.${userId},user_id.ilike.${userId}`)
        .order('created_at', { ascending: false });
        
      console.log('📊 Flexible query result:', { 
        data: flexibleData, 
        error: flexibleError,
        dataLength: flexibleData?.length 
      });
      
      // Use the data that returned results, prioritizing standard query
      let finalData = standardData;
      let finalError = standardError;
      
      if (!standardData?.length && flexibleData?.length) {
        console.log('⚠️ Using flexible query results as fallback');
        finalData = flexibleData;
        finalError = flexibleError;
      }
        
      if (finalError) {
        console.error('❌ Supabase error fetching user speeches:', finalError);
        toast({
          title: "Error loading speeches",
          description: `Database error: ${finalError.message}`,
          variant: "destructive"
        });
        setSpeeches([]);
      } else {
        console.log('✅ Successfully fetched speeches for user:', userId);
        console.log('📄 Final speeches data from database:', finalData);
        
        // Process speeches to ensure proper formatting
        const processedSpeeches = (finalData || []).map(speech => ({
          ...speech,
          created_at: speech.created_at || new Date().toISOString(),
          updated_at: speech.updated_at || speech.created_at || new Date().toISOString()
        }));
        
        console.log('✨ Processed speeches:', processedSpeeches);
        console.log('📈 Total speeches processed:', processedSpeeches.length);
        
        if (processedSpeeches.length === 0) {
          console.log('⚠️ No speeches found for user. This might indicate:');
          console.log('   - User has not created any speeches');
          console.log('   - Data consistency issue between auth and speeches table');
          console.log('   - User ID mismatch');
          console.log('   - RLS policy blocking access');
        }
        
        setSpeeches(processedSpeeches);
        calculateTotalActivityTime(processedSpeeches);
      }
    } catch (error) {
      console.error('💥 Exception fetching user speeches:', error);
      toast({
        title: "Error loading speeches",
        description: "An unexpected error occurred while loading speeches.",
        variant: "destructive"
      });
      setSpeeches([]);
    } finally {
      setIsLoadingSpeeches(false);
    }
  }, [toast]);

  // Calculate user statistics
  const calculateUserStats = useCallback((user: User) => {
    // Calculate days since user joined
    if (!user?.created_at) return;
    
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log('👤 User joined days ago:', diffDays, 'from date:', user.created_at);
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
    
    console.log('⏱️ Calculated total activity time:', totalTime, 'minutes for', speeches.length, 'speeches');
    setTotalActivityTime(totalTime);
  }, []);

  // Reset states and fetch data when the drawer opens with a user
  useEffect(() => {
    let isMounted = true;
    
    if (user && open) {
      console.log('🎯 User details drawer opened for user:', user.id);
      console.log('📋 User data:', {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        subscription_plan: user.subscription_plan
      });
      
      if (isMounted) {
        // Reset state first
        resetState();
        
        // Calculate user stats immediately
        calculateUserStats(user);
        
        // Fetch speeches for this user
        console.log('🚀 About to fetch speeches for user:', user.id);
        fetchUserSpeeches(user.id);
      }
    } else if (!open) {
      console.log('❌ User details drawer closed, resetting state');
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
