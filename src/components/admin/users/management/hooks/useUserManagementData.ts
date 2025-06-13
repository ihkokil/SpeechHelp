
import { useState, useCallback, useEffect } from 'react';
import { useFetchUsers } from './useFetchUsers';
import { User } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserManagementData = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  // Fetch users data
  const { 
    users: fetchedUsers, 
    isLoading: isFetchLoading, 
    fetchUsers: apiFetchUsers,
    error: fetchError,
    cleanup
  } = useFetchUsers();
  
  // Update users when fetchedUsers changes
  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      console.log('Received fresh user data:', fetchedUsers.length, 'users');
      setUsers(fetchedUsers);
      setIsLoading(false);
      setRetryCount(0); // Reset retry count on success
    }
    
    if (fetchError) {
      console.error('Fetch error:', fetchError);
      
      // Auto-retry on error with exponential backoff
      if (retryCount < maxRetries) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`Retrying in ${retryDelay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          apiFetchUsers(true); // Force refresh on retry
        }, retryDelay);
      } else {
        toast({
          title: "Error",
          description: `Failed to fetch users after ${maxRetries} attempts. Please check your connection and try again.`,
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }
  }, [fetchedUsers, fetchError, retryCount, maxRetries, apiFetchUsers, toast]);
  
  // Fetch users with force refresh option
  const fetchUsers = useCallback(async (forceRefresh = false) => {
    console.log("Fetching users with force refresh:", forceRefresh);
    setIsLoading(true);
    setRetryCount(0); // Reset retry count
    
    try {
      const result = await apiFetchUsers(forceRefresh);
      if (result && result.length > 0) {
        setUsers(result);
      }
      return result;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return [];
    }
  }, [apiFetchUsers, toast]);

  // Force refresh function with better feedback
  const forceRefresh = useCallback(async () => {
    console.log("Force refreshing user data...");
    setRetryCount(0); // Reset retry count
    
    try {
      await fetchUsers(true);
      toast({
        title: "Success",
        description: "User data refreshed successfully.",
      });
    } catch (error) {
      console.error("Error during force refresh:", error);
      toast({
        title: "Error",
        description: "Failed to refresh user data. Please try again.",
        variant: "destructive"
      });
    }
  }, [fetchUsers, toast]);

  // Add new user to list
  const addUser = useCallback((newUser: User) => {
    console.log("Adding new user to list:", newUser.id);
    setUsers(prevUsers => [...prevUsers, newUser]);
  }, []);

  // Cleanup function
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    users,
    setUsers,
    isLoading: isLoading || isFetchLoading,
    fetchUsers,
    forceRefresh,
    addUser,
    error: fetchError,
    retryCount
  };
};
