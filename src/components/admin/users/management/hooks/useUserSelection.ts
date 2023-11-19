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

  const toggleAllUsers = useCallback((filteredUsers) => {
    console.log('Toggling all users selection');
    setSelectedUsers(prev => {
      // If the length of currently selected users equals the length of filtered users,
      // it means all are selected, so we deselect all
      if (prev.length === filteredUsers.length && 
          filteredUsers.every(user => prev.includes(user.id))) {
        return [];
      } else {
        // Otherwise, select all filtered users
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
