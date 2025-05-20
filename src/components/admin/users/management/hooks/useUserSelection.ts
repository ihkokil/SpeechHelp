import { useState, useCallback } from 'react';
import { User } from '../../types';

export const useUserSelection = (filteredUsers: User[] = []) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const toggleUserSelection = useCallback((user: User) => {
    console.log('Toggling user selection:', user.id);
    setSelectedUsers(prev => 
      prev.some(selectedUser => selectedUser.id === user.id) 
        ? prev.filter(selectedUser => selectedUser.id !== user.id) 
        : [...prev, user]
    );
  }, []);

  const toggleAllUsers = useCallback(() => {
    console.log('Toggling all users selection');
    setSelectedUsers(prev => {
      // If all filtered users are currently selected, deselect all
      if (prev.length === filteredUsers.length && 
          filteredUsers.every(user => prev.some(selectedUser => selectedUser.id === user.id))) {
        return [];
      } else {
        // Otherwise, select all filtered users
        return [...filteredUsers];
      }
    });
  }, [filteredUsers]);

  const selectMultipleUsers = useCallback((users: User[]) => {
    setSelectedUsers(users);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
  }, []);

  const isUserSelected = useCallback((userId: string) => {
    return selectedUsers.some(user => user.id === userId);
  }, [selectedUsers]);

  // Check if all filtered users are selected
  const isAllSelected = filteredUsers.length > 0 && 
    selectedUsers.length === filteredUsers.length && 
    filteredUsers.every(user => selectedUsers.some(selectedUser => selectedUser.id === user.id));

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
