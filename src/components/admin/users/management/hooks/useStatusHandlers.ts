
import { useCallback } from 'react';
import { User } from '../../types';

export const useStatusHandlers = (
  baseHandleToggleUserStatus: (userId: string, isActive: boolean, users: User[], setUsers: (users: User[]) => void) => void,
  baseHandleToggleUserSubscription: (userId: string, days: number, users: User[], setUsers: (users: User[]) => void) => void,
  users: User[],
  setUsers: (users: User[]) => void
) => {
  
  // Handle toggling user status
  const handleToggleUserStatus = useCallback((userId: string, isActive: boolean) => {
    console.log("useStatusHandlers: Toggle user status called for user:", userId, isActive);
    return baseHandleToggleUserStatus(userId, isActive, users, setUsers);
  }, [baseHandleToggleUserStatus, users, setUsers]);
  
  // Handle toggling user subscription
  const handleToggleUserSubscription = useCallback((userId: string) => {
    console.log("useStatusHandlers: Toggle subscription called for user:", userId);
    return baseHandleToggleUserSubscription(userId, 30, users, setUsers);
  }, [baseHandleToggleUserSubscription, users, setUsers]);
  
  return {
    handleToggleUserStatus,
    handleToggleUserSubscription
  };
};
