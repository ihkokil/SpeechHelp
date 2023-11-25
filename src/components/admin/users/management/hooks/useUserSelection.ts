
import { useState, useCallback } from 'react';
import { User } from '../../types';

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

  const toggleAllUsers = useCallback((filteredUsers: User[]) => {
    console.log('Toggling all users selection');
    setSelectedUsers(prev => {
      // If all filtered users are currently selected, deselect all
      if (prev.length === filteredUsers.length && 
          filteredUsers.every(user => prev.includes(user.id))) {
        return [];
      } else {
        // Otherwise, select all filtered users
        return filteredUsers.map(user => user.id);
      }
    });
  }, []);

  const selectMultipleUsers = useCallback((userIds: string[]) => {
    setSelectedUsers(userIds);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  const isUserSelected = useCallback((userId: string) => {
    return selectedUsers.includes(userId);
  }, [selectedUsers]);

  const isAllSelected = useCallback((filteredUsers: User[]) => {
    return filteredUsers.length > 0 && 
      selectedUsers.length === filteredUsers.length && 
      filteredUsers.every(user => selectedUsers.includes(user.id));
  }, [selectedUsers]);

  return {
    selectedUsers,
    setSelectedUsers,
    toggleUserSelection,
    toggleAllUsers,
    selectMultipleUsers,
    clearSelection,
    isUserSelected,
    isAllSelected
  };
};
