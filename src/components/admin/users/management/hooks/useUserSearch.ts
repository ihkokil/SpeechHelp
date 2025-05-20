
import { useState, useCallback, useMemo } from 'react';
import { User } from '../../types';

export const useUserSearch = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterUsers = useCallback((users: User[], term: string) => {
    if (!term.trim()) {
      return users;
    }
    
    const lowerTerm = term.toLowerCase();
    
    return users.filter(user => 
      user.email?.toLowerCase().includes(lowerTerm) ||
      user.user_metadata?.first_name?.toLowerCase().includes(lowerTerm) ||
      user.user_metadata?.last_name?.toLowerCase().includes(lowerTerm) ||
      user.user_metadata?.phone?.toLowerCase().includes(lowerTerm)
    );
  }, []);

  const filteredUsers = useMemo(() => {
    return filterUsers(users, searchTerm);
  }, [users, searchTerm, filterUsers]);
  
  return {
    searchTerm,
    setSearchTerm,
    filterUsers,
    filteredUsers
  };
};
