
import { useState, useCallback, useMemo } from 'react';
import { User } from '../../types';

export const useUserSearch = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filterUsers = useCallback((users: User[], term: string) => {
    if (!term.trim()) return users;
    
    const lowerTerm = term.toLowerCase();
    return users.filter(user => {
      const name = user.user_metadata.name || user.user_metadata.full_name || '';
      const email = user.email || '';
      return (
        name.toLowerCase().includes(lowerTerm) ||
        email.toLowerCase().includes(lowerTerm)
      );
    });
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
