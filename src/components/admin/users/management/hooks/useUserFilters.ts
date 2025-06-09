
import { useState, useMemo } from 'react';
import { User } from '../../types';

export const useUserFilters = (users: User[]) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Status filter
      if (selectedStatus !== 'all') {
        const userStatus = user.is_active ? 'active' : 'inactive';
        if (userStatus !== selectedStatus) return false;
      }

      // Role filter
      if (selectedRole !== 'all') {
        const userRole = user.is_admin ? 'admin' : 'user';
        if (userRole !== selectedRole) return false;
      }

      // Plan filter
      if (selectedPlan !== 'all') {
        const userPlan = user.subscription_plan || 'free_trial';
        if (userPlan !== selectedPlan) return false;
      }

      return true;
    });
  }, [users, selectedStatus, selectedRole, selectedPlan]);

  const clearFilters = () => {
    setSelectedStatus('all');
    setSelectedRole('all');
    setSelectedPlan('all');
  };

  return {
    selectedStatus,
    selectedRole,
    selectedPlan,
    filteredUsers,
    setSelectedStatus,
    setSelectedRole,
    setSelectedPlan,
    clearFilters,
    hasActiveFilters: selectedStatus !== 'all' || selectedRole !== 'all' || selectedPlan !== 'all'
  };
};
