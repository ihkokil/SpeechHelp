
import { useState, useCallback } from 'react';
import { User } from '../../../types';

export const useActionState = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);

  const reset = useCallback(() => {
    setIsActionLoading(false);
    setSelectedUser(null);
    setIsDetailsOpen(false);
    setIsDeleteDialogOpen(false);
    setIsAddUserDialogOpen(false);
    setIsPermissionsDialogOpen(false);
  }, []);

  return {
    isActionLoading,
    setIsActionLoading,
    selectedUser,
    setSelectedUser,
    isDetailsOpen,
    setIsDetailsOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isPermissionsDialogOpen,
    setIsPermissionsDialogOpen,
    reset
  };
};
