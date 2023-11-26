
import { useCallback, useState } from 'react';

export const useActionState = (setIsActionLoadingProp?: (loading: boolean) => void) => {
  const [isActionLoading, setIsActionLoadingState] = useState(false);
  
  const setActionLoading = useCallback((loading: boolean) => {
    // Use the prop setter if provided, otherwise use the local state setter
    if (setIsActionLoadingProp) {
      setIsActionLoadingProp(loading);
    } else {
      setIsActionLoadingState(loading);
    }
  }, [setIsActionLoadingProp]);
  
  return {
    isActionLoading: setIsActionLoadingProp ? undefined : isActionLoading,
    setActionLoading
  };
};
