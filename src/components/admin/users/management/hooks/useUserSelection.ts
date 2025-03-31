
import { useState, useCallback } from 'react';

export const useUserSelection = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUserSelection = useCallback((userId: string) => {
    console.log('Toggling user selection:', userId);
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  }, []);

  const toggleAllUsers = useCallback((users, searchTerm) => {
    console.log('Toggling all users selection');
    setSelectedUsers(prev => {
      const filteredUsers = users.filter(user => 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (user.user_metadata?.name && user.user_metadata.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.user_metadata?.full_name && user.user_metadata.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      if (prev.length === filteredUsers.length) {
        return [];
      } else {
        return filteredUsers.map(user => user.id);
      }
    });
  }, []);

  return {
    selectedUsers,
    setSelectedUsers,
    toggleUserSelection,
    toggleAllUsers
  };
};
