
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { User } from '../types';
import { DrawerContent } from './DrawerContent';
import { useUserDetails } from './hooks/useUserDetails';

interface UserDetailsDrawerProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onUserUpdated?: (updatedUser: User) => void;
}

const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({ 
  user, 
  open, 
  onClose,
  onUserUpdated
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  const {
    userJoinedDays,
    resetState
  } = useUserDetails(currentUser, open);
  
  // Update current user when user prop changes
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);
  
  // Debug logging
  console.log("UserDetailsDrawer rendering:", { 
    userId: currentUser?.id,
    open,
    userJoinedDays,
    user: currentUser ? {
      id: currentUser.id,
      email: currentUser.email,
      subscription_plan: currentUser.subscription_plan,
      subscription_end_date: currentUser.subscription_end_date,
      created_at: currentUser.created_at
    } : null
  });
  
  // Handle cleanup when drawer closes
  useEffect(() => {
    console.log("UserDetailsDrawer: Open state changed to", open);
    if (!open) {
      // Delay reset to avoid state conflicts during animations
      const timer = setTimeout(() => {
        resetState();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [open, resetState]);
  
  // When sheet is closed with escape key or by clicking outside
  const handleSheetOpenChange = (isOpen: boolean) => {
    console.log("UserDetailsDrawer: Sheet open change to", isOpen);
    // Only trigger close if we're actually closing (prevents auto-closing after opening)
    if (!isOpen && open) {
      onClose();
    }
  };

  // Handle user updates
  const handleUserUpdated = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    if (onUserUpdated) {
      onUserUpdated(updatedUser);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl overflow-y-auto">
        {currentUser && (
          <DrawerContent
            user={currentUser}
            onClose={onClose}
            userJoinedDays={userJoinedDays}
            onUserUpdated={handleUserUpdated}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsDrawer;
