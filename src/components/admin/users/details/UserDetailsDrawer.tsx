
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
    console.log("UserDetailsDrawer: Sheet open change requested to", isOpen);
    // Only trigger close if we're actually closing (prevents auto-closing after opening)
    if (!isOpen && open) {
      console.log("UserDetailsDrawer: Calling onClose()");
      onClose();
    }
  };

  // Prevent immediate closure
  useEffect(() => {
    if (open) {
      console.log("UserDetailsDrawer: Adding prevent close handlers");
      const preventClose = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          // Use the onClose handler instead
          onClose();
        }
      };
      
      window.addEventListener('keydown', preventClose);
      
      return () => {
        console.log("UserDetailsDrawer: Removing prevent close handlers");
        window.removeEventListener('keydown', preventClose);
      };
    }
  }, [open, onClose]);

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent 
        className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto"
        onPointerDownOutside={(e) => {
          // Prevent closure when clicking outside right after opening
          const timeSinceOpen = Date.now() - (window.lastOpenTime || 0);
          if (timeSinceOpen < 200) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Handle escape key manually
          e.preventDefault();
          onClose();
        }}
      >
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

// Add a global timestamp for drawer open time
declare global {
  interface Window {
    lastOpenTime?: number;
  }
}

// Set the open time when opening the drawer
React.useLayoutEffect(() => {
  if (open) {
    window.lastOpenTime = Date.now();
  }
}, [open]);

export default UserDetailsDrawer;
