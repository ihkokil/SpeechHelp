
import { useState, useEffect, useCallback } from 'react';
import { User } from '../../types';

export const useUserDetails = (user: User | null, open: boolean) => {
  const [userJoinedDays, setUserJoinedDays] = useState<number>(0);

  // Function to reset all states
  const resetState = useCallback(() => {
    console.log('Resetting user details state');
    setUserJoinedDays(0);
  }, []);

  // Calculate user statistics
  const calculateUserStats = useCallback((user: User) => {
    // Calculate days since user joined
    if (!user?.created_at) return;
    
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log('User joined days ago:', diffDays);
    setUserJoinedDays(diffDays);
  }, []);

  // Reset states and calculate stats when the drawer opens with a user
  useEffect(() => {
    let isMounted = true;
    
    if (user && open) {
      console.log('User details drawer opened for user:', {
        userId: user.id,
        userEmail: user.email
      });
      
      if (isMounted) {
        // Reset state first
        resetState();
        
        // Calculate user stats immediately
        calculateUserStats(user);
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
  }, [user, open, calculateUserStats, resetState]);

  return {
    userJoinedDays,
    resetState
  };
};
