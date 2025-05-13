
import { useCallback, useEffect, useRef } from 'react';

export const useLifecycle = (
  fetchUsers: () => void,
  setSelectedUsers: (users: any[]) => void,
  setSearchTerm: (term: string) => void,
  resetUIState: () => void
) => {
  const isMounted = useRef(true);
  
  // Cleanup function for component unmount
  const cleanup = useCallback(() => {
    setSelectedUsers([]);
    setSearchTerm('');
    resetUIState();
  }, [setSelectedUsers, setSearchTerm, resetUIState]);
  
  // Setup effect for component lifecycle
  useEffect(() => {
    isMounted.current = true;
    
    // Fetch users on initial mount
    fetchUsers();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchUsers]);
  
  return {
    isMounted,
    cleanup
  };
};
