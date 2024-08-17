
import { useState, useCallback, useMemo } from 'react';
import { User } from '../../types';

export const useUserSearch = (users: User[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  // For backward compatibility with some components using searchQuery
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  // Update searchQuery whenever searchTerm changes
  useCallback(() => {
    setSearchQuery(searchTerm);
  }, [searchTerm]);

  // Update searchTerm whenever searchQuery changes
  useCallback(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);
  
  const filteredUsers = useMemo(() => {
    return filterUsers(users, searchTerm);
  }, [users, searchTerm, filterUsers]);

  return {
    searchTerm,
    setSearchTerm,
    searchQuery,
    setSearchQuery,
    filterUsers,
    filteredUsers
  };
};
