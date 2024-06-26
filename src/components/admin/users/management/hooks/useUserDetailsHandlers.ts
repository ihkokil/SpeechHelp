
import { useCallback } from 'react';
import { User } from '../../types';
import { useToast } from '@/hooks/use-toast';

export const useUserDetailsHandlers = (
  setSelectedUser: (user: User | null) => void,
  setIsDetailsOpen: (isOpen: boolean) => void,
  setIsEditUserDialogOpen: (isOpen: boolean) => void,
  setIsEmailDialogOpen: (isOpen: boolean) => void,
  setUsers: (users: User[] | ((prevUsers: User[]) => User[])) => void
) => {
  const { toast } = useToast();
  
  // Handle viewing user details
  const handleViewUserDetails = useCallback((user: User) => {
    console.log("useUserDetailsHandlers: View details called for user:", user.id);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  }, [setSelectedUser, setIsDetailsOpen]);
  
  // Handle closing user details
  const handleCloseUserDetails = useCallback(() => {
    console.log("useUserDetailsHandlers: Close details called");
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  }, [setIsDetailsOpen, setSelectedUser]);
  
  // Handle editing user
  const handleEditUser = useCallback((user: User) => {
    console.log("useUserDetailsHandlers: Edit user called for user:", user.id);
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  }, [setSelectedUser, setIsEditUserDialogOpen]);
  
  // Handle user update from edit user dialog
  const handleUserUpdated = useCallback((updatedUser: User) => {
    console.log("useUserDetailsHandlers: User updated:", updatedUser.id);
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
    setIsEditUserDialogOpen(false);
    
    // Show success toast
    toast({
      title: "User updated",
      description: `${updatedUser.email} has been updated successfully.`,
    });
  }, [setUsers, setIsEditUserDialogOpen, toast]);
  
  // Handle sending email
  const handleSendEmail = useCallback((user: User) => {
    console.log("useUserDetailsHandlers: Send email called for user:", user.id);
    setSelectedUser(user);
    setIsEmailDialogOpen(true);
    
    toast({
      title: 'Email Function',
      description: `Email dialog for ${user.email} would open here.`,
    });
  }, [setSelectedUser, setIsEmailDialogOpen, toast]);
  
  return {
    handleViewUserDetails,
    handleCloseUserDetails,
    handleEditUser,
    handleUserUpdated,
    handleSendEmail
  };
};
