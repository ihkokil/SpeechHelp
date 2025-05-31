
import { useState, useCallback } from 'react';
import { User } from '../../types';

export const useUserManagementUIState = () => {
  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  
  // Selected user state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Reset all UI state
  const resetUIState = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setIsAddUserDialogOpen(false);
    setIsEditUserDialogOpen(false);
    setIsPermissionsDialogOpen(false);
    setIsDetailsOpen(false);
    setIsEmailDialogOpen(false);
    setSelectedUser(null);
  }, []);
  
  return {
    // Dialog states
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isDetailsOpen,
    setIsDetailsOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    
    // Selected user
    selectedUser,
    setSelectedUser,
    
    // Reset function
    resetUIState
  };
};
