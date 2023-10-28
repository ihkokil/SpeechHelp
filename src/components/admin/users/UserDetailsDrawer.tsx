
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { DrawerSheetContent } from './details/DrawerSheetContent';
import { User as UserType } from './types';
import { useUserDetails } from './hooks/useUserDetails';

interface UserDetailsDrawerProps {
  user: UserType | null;
  open: boolean;
  onClose: () => void;
}

const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({ user, open, onClose }) => {
  const {
    speeches,
    isLoadingSpeeches,
    userJoinedDays,
    totalActivityTime,
  } = useUserDetails(user, open);
  
  console.log("UserDetailsDrawer render:", { user: user?.id, open });
  
  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserDetailsDrawer: close button clicked');
    onClose();
  };
  
  const handleSheetOpenChange = (isOpen: boolean) => {
    console.log('UserDetailsDrawer: Sheet open state changed to', isOpen);
    if (!isOpen) {
      onClose();
    }
  };

  // Always render the component but conditionally show content
  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        {user && (
          <DrawerSheetContent
            user={user}
            onClose={handleCloseClick}
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
