
import { useState, useCallback, useEffect } from 'react';
import { useFetchUsers } from './useFetchUsers';
import { User } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserManagementData = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch users data
  const { 
    users: fetchedUsers, 
    isLoading: isFetchLoading, 
    fetchUsers: apiFetchUsers 
  } = useFetchUsers();
  
  // Update users when fetchedUsers changes
  useEffect(() => {
    if (fetchedUsers && fetchedUsers.length > 0) {
      setUsers(fetchedUsers);
      setIsLoading(false);
    }
  }, [fetchedUsers]);
  
  // Fetch users
  const fetchUsers = useCallback(async () => {
    console.log("Fetching users...");
    setIsLoading(true);
    try {
      await apiFetchUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
    }
  }, [apiFetchUsers, toast]);

  return {
    users,
    setUsers,
    isLoading: isLoading || isFetchLoading,
    fetchUsers
  };
};
