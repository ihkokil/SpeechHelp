
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptionActions } from '../hooks/user-actions/useSubscriptionActions';
import { useFetchUsers } from '../hooks/useFetchUsers';

export const SetTestUserToPro = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { users, setUsers } = useFetchUsers();
  const { setUserToPro } = useSubscriptionActions(setIsLoading);

  const handleSetTestUser = async () => {
    await setUserToPro('imran003@yopmail.com', users, setUsers);
  };

  return (
    <Button 
      onClick={handleSetTestUser} 
      disabled={isLoading}
      variant="outline"
      className="mt-4"
    >
      {isLoading ? 'Setting user to Pro...' : 'Set Test User to Pro'}
    </Button>
  );
};
