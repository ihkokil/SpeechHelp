
import { useState } from 'react';
import { User } from '../../types';

export const useUserManagementUIState = () => {
  // Dialog and drawer states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  
  // Function to reset all UI state
  const resetUIState = () => {
    setIsDeleteDialogOpen(false);
    setIsAddUserDialogOpen(false);
  };

  return {
    // Dialog states
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    
    // Helper functions
    resetUIState
  };
};
