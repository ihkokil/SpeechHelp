
import React, { useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { User } from '../types';
import { DrawerContent } from './DrawerContent';
import { useUserDetails } from './hooks/useUserDetails';

interface UserDetailsDrawerProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({ 
  user, 
  open, 
  onClose 
}) => {
  const {
    userJoinedDays,
    resetState
  } = useUserDetails(user, open);
  
  // Debug logging
  console.log("UserDetailsDrawer rendering:", { 
    userId: user?.id,
    open,
    userJoinedDays,
    user: user ? {
      id: user.id,
      email: user.email,
      subscription_plan: user.subscription_plan,
      subscription_end_date: user.subscription_end_date,
      created_at: user.created_at
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

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl overflow-y-auto">
        {user && (
          <DrawerContent
            user={user}
            onClose={onClose}
            userJoinedDays={userJoinedDays}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsDrawer;
