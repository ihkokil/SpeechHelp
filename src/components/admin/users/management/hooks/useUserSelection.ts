
import { useState, useCallback } from 'react';
import { User } from '../../types';

export const useUserSelection = () => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const toggleUserSelection = useCallback((userId: string) => {
    console.log('Toggling user selection:', userId);
    setSelectedUsers(prev => {
      const isSelected = prev.some(user => user.id === userId);
      if (isSelected) {
        return prev.filter(user => user.id !== userId);
      } else {
        const userToAdd = { id: userId } as User; // Minimal User object with just the ID
        return [...prev, userToAdd];
      }
    });
  }, []);

  const toggleAllUsers = useCallback((checked: boolean) => {
    console.log('Toggling all users selection, checked:', checked);
    if (checked) {
      // Select all users in the filtered list
      // This would need users from outside, so we'll make it a proper function that takes the filtered users
    } else {
      // Deselect all
      setSelectedUsers([]);
    }
  }, []);

  const selectMultipleUsers = useCallback((users: User[]) => {
    setSelectedUsers(users);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  const isUserSelected = useCallback((userId: string) => {
    return selectedUsers.some(user => user.id === userId);
  }, [selectedUsers]);

  const isAllSelected = useCallback((filteredUsers: User[]) => {
    return filteredUsers.length > 0 && 
      selectedUsers.length === filteredUsers.length && 
      filteredUsers.every(user => selectedUsers.some(selectedUser => selectedUser.id === user.id));
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
