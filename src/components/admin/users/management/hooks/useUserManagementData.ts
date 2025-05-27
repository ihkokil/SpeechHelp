
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
    if (fetchedUsers && fetchedUsers.length > 0) {
      setUsers(fetchedUsers);
      setIsLoading(false);
    }
    
    if (fetchError) {
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [fetchedUsers, fetchError, toast]);
  
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
      setIsLoading(false);
    }
  }, [apiFetchUsers, toast]);

  // Add new user to list
  const addUser = useCallback((newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  }, []);

  return {
    users,
    setUsers,
    isLoading: isLoading || isFetchLoading,
    fetchUsers,
    addUser,
    error: fetchError,
    searchTerm,
    setSearchTerm,
    filteredUsers
  };
};
