
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useFetchUsers } from './useFetchUsers';
import { User } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserManagementData = (initialUsers?: User[]) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers || []);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch users data
  const { 
    users: fetchedUsers, 
    isLoading: isFetchLoading, 
    fetchUsers: apiFetchUsers,
    error: fetchError
  } = useFetchUsers();
  
  // Update users when fetchedUsers changes
  useEffect(() => {
    console.log('useUserManagementData: fetchedUsers changed:', fetchedUsers.length, 'users, loading:', isFetchLoading);
    
    if (fetchedUsers && fetchedUsers.length > 0) {
      console.log('Setting users from fetched data');
      setUsers(fetchedUsers);
      setIsLoading(false);
    } else if (!isFetchLoading && fetchedUsers.length === 0) {
      // Only set loading to false if we're not loading and got empty results
      console.log('No users found, stopping loading');
      setIsLoading(false);
    }
    
    if (fetchError) {
      console.error('Fetch error detected:', fetchError);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [fetchedUsers, isFetchLoading, fetchError, toast]);
  
  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    const lowerTerm = searchTerm.toLowerCase();
    return users.filter(user => {
      const name = user.user_metadata?.name || user.user_metadata?.full_name || '';
      const email = user.email || '';
      return (
        name.toLowerCase().includes(lowerTerm) ||
        email.toLowerCase().includes(lowerTerm)
      );
    });
  }, [users, searchTerm]);
  
  // Fetch users
  const fetchUsers = useCallback(async () => {
    console.log("useUserManagementData: Manual fetch triggered");
    setIsLoading(true);
    try {
      const result = await apiFetchUsers();
      console.log("Manual fetch completed with", result?.length || 0, "users");
    } catch (error) {
      console.error("Error in manual fetch:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [apiFetchUsers, toast]);

  // Add new user to list
  const addUser = useCallback((newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  }, []);

  // Trigger initial fetch on mount
  useEffect(() => {
    console.log('useUserManagementData: Triggering initial fetch on mount');
    fetchUsers();
  }, []);

  return {
    users,
    setUsers,
    isLoading,
    fetchUsers,
    addUser,
    error: fetchError,
    searchTerm,
    setSearchTerm,
    filteredUsers
  };
};
