
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
    speeches,
    isLoadingSpeeches,
    userJoinedDays,
    totalActivityTime,
    resetState
  } = useUserDetails(user, open);
  
  // Handle cleanup when drawer closes
  useEffect(() => {
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
    if (!isOpen) {
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
