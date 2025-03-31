
import React from 'react';
import { User } from '../types';
import { DrawerSheetContent } from './DrawerSheetContent';

interface DrawerContentProps {
  user: User;
  onClose: () => void;
  speeches: any[];
  isLoadingSpeeches: boolean;
  userJoinedDays: number;
  totalActivityTime: number;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
  user,
  onClose,
  speeches,
  isLoadingSpeeches,
  userJoinedDays,
  totalActivityTime
}) => {
  // Create a wrapper handler for the close button that properly handles events
  const handleClose = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Closing user details drawer");
    onClose();
  };

  return (
    <DrawerSheetContent
      user={user}
      onClose={handleClose}
      speeches={speeches}
      isLoadingSpeeches={isLoadingSpeeches}
      userJoinedDays={userJoinedDays}
      totalActivityTime={totalActivityTime}
    />
  );
};
