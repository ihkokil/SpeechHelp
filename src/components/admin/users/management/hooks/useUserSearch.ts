
import { useState, useCallback } from 'react';

export const useUserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filterUsers = useCallback((users, term) => {
    if (!term) return users;
    
    return users.filter(user => 
      (user.email && user.email.toLowerCase().includes(term.toLowerCase())) || 
      (user.user_metadata?.name && user.user_metadata.name.toLowerCase().includes(term.toLowerCase())) ||
      (user.user_metadata?.full_name && user.user_metadata.full_name.toLowerCase().includes(term.toLowerCase()))
    );
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filterUsers
  };
};
