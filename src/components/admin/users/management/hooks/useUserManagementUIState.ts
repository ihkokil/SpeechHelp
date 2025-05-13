
import { useState } from 'react';
import { User } from '../../types';

export const useUserManagementUIState = () => {
  // Dialog and drawer states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  
  // Selected user for dialogs or detailed view
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Function to reset all UI state
  const resetUIState = () => {
    setIsDeleteDialogOpen(false);
    setIsAddUserDialogOpen(false);
    setIsPermissionsDialogOpen(false);
    setIsDetailsOpen(false);
    setIsEditUserDialogOpen(false);
    setIsEmailDialogOpen(false);
    setSelectedUser(null);
  };

  console.log("useUserManagementUIState - isAddUserDialogOpen:", isAddUserDialogOpen);

  return {
    // Dialog and drawer states
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isDetailsOpen,
    setIsDetailsOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    
    // Selected user state
    selectedUser,
    setSelectedUser,
    
    // Helper functions
    resetUIState
  };
};
