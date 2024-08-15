
import { useState, useCallback } from 'react';
import { User } from '../../types';

export const useUserManagementUIState = () => {
  // Dialog and drawer states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  
  // Selected user for dialogs or detailed view
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Function to safely set details open (with user validation)
  const safelyOpenDetails = useCallback((open: boolean, user: User | null) => {
    if (open && !user) {
      console.warn("Attempted to open details without a selected user");
      return false;
    }
    setIsDetailsOpen(open);
    return open;
  }, []);
  
  // Function to safely select a user (with logging)
  const safelySelectUser = useCallback((user: User | null) => {
    console.log("Setting selected user:", user ? user.id : "null");
    setSelectedUser(user);
  }, []);
  
  // Function to reset all UI state with optional delay
  const resetUIState = useCallback((delay: number = 0) => {
    const resetFunc = () => {
      setIsDeleteDialogOpen(false);
      setIsAddUserDialogOpen(false);
      setIsPermissionsDialogOpen(false);
      setIsDetailsOpen(false);
      setIsEditUserDialogOpen(false);
      setIsEmailDialogOpen(false);
      setIsSubscriptionDialogOpen(false);
      setSelectedUser(null);
    };
    
    if (delay > 0) {
      setTimeout(resetFunc, delay);
    } else {
      resetFunc();
    }
  }, []);

  return {
    // Dialog and drawer states
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    isDetailsOpen,
    setIsDetailsOpen: (open: boolean) => safelyOpenDetails(open, selectedUser),
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen,
    
    // Selected user state
    selectedUser,
    setSelectedUser: safelySelectUser,
    
    // Helper functions
    resetUIState
  };
};
