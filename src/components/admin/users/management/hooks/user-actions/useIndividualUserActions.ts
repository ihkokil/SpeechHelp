
import { useCallback, useState } from 'react';
import { User } from '../../../types';
import { useSubscriptionActions } from './useSubscriptionActions';
import { useUserCrud } from './useUserCrud';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan } from '@/lib/plan_rules';

export const useIndividualUserActions = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { toast } = useToast();
  
  const {
    handleToggleUserStatus,
    handleToggleUserSubscription
  } = useSubscriptionActions(setIsActionLoading);
  
  const { 
    deleteUser
  } = useUserCrud(setIsActionLoading);
  
  // Manage subscription extension dialog state
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Function to handle opening the subscription extension dialog
  const handleOpenSubscriptionDialog = useCallback((user: User) => {
    setSelectedUser(user);
    setIsSubscriptionDialogOpen(true);
  }, []);
  
  // Process the actual subscription update after dialog confirms
  const handleConfirmSubscriptionUpdate = useCallback((userId: string, days: number, planType: SubscriptionPlan, users: User[], setUsers: (users: User[]) => void) => {
    handleToggleUserSubscription(userId, days, planType, users, setUsers);
    setIsSubscriptionDialogOpen(false);
  }, [handleToggleUserSubscription]);
  
  return {
    isActionLoading,
    handleToggleUserStatus,
    handleToggleUserSubscription,
    handleDeleteUser: deleteUser,
    isSubscriptionDialogOpen,
    setIsSubscriptionDialogOpen,
    selectedUser,
    handleOpenSubscriptionDialog,
    handleConfirmSubscriptionUpdate
  };
};
