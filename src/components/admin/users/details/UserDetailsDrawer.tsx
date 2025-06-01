
import React, { useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { User } from '../types';
import { DrawerContent } from './DrawerContent';
import { useUserDetails } from './hooks/useUserDetails';
import { Loader2 } from 'lucide-react';

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
    speeches,
    isLoadingSpeeches,
    userJoinedDays,
    totalActivityTime,
    resetState
  } = useUserDetails(user, open);
  
  // Debug logging
  console.log("UserDetailsDrawer rendering:", { 
    userId: user?.id,
    open,
    speechesCount: speeches?.length,
    isLoadingSpeeches,
    userJoinedDays,
    totalActivityTime
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
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        {user && (
          <DrawerContent
            user={user}
            onClose={onClose}
            speeches={speeches}
            isLoadingSpeeches={isLoadingSpeeches}
            userJoinedDays={userJoinedDays}
            totalActivityTime={totalActivityTime}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsDrawer;
