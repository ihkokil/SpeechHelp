
import { useCombinedUserHooks } from './hooks/useCombinedUserHooks';

// This is now a simplified entry point that uses the combined hooks
export const useUserManagement = () => {
  console.log("Initializing useUserManagement");
  
  // Use the combined hook that manages all user management functionality
  const userHooks = useCombinedUserHooks();
  
  return {
    ...userHooks
  };
};
