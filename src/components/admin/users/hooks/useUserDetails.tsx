
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Speech } from '../types';

export const useUserDetails = (user: User | null, open: boolean) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(false);
  const [userJoinedDays, setUserJoinedDays] = useState<number>(0);
  const [totalActivityTime, setTotalActivityTime] = useState<number>(0);

  // Reset states and fetch data when the drawer opens with a user
  useEffect(() => {
    console.log('UserDetailsDrawer: drawer mount/update', { user: user?.id, open });
    
    if (user && open) {
      setSpeeches([]);
      setIsLoadingSpeeches(false);
      setUserJoinedDays(0);
      setTotalActivityTime(0);
      fetchUserSpeeches(user.id);
      calculateUserStats(user);
    }
    
    // Cleanup function
    return () => {
      console.log('UserDetailsDrawer: cleaning up');
    };
  }, [user, open]);
  
  const fetchUserSpeeches = async (userId: string) => {
    setIsLoadingSpeeches(true);
    try {
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching user speeches:', error);
      } else {
        setSpeeches(data || []);
        calculateTotalActivityTime(data || []);
      }
    } catch (error) {
      console.error('Exception fetching user speeches:', error);
    } finally {
      setIsLoadingSpeeches(false);
    }
  };

  const calculateUserStats = (user: User) => {
    // Calculate days since user joined
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setUserJoinedDays(diffDays);
  };
  
  const calculateTotalActivityTime = (speeches: Speech[]) => {
    // Estimate total activity time based on speeches (5 minutes per speech as a rough estimate)
    setTotalActivityTime(5 * speeches.length);
  };

  return {
    speeches,
    isLoadingSpeeches,
    userJoinedDays,
    totalActivityTime,
  };
};
