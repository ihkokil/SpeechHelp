
import React from 'react';
import { User } from '../types';
import { DrawerSheetContent } from './DrawerSheetContent';

interface DrawerContentProps {
  user: User;
  onClose: () => void;
  userJoinedDays: number;
  onUserUpdated?: (updatedUser: User) => void;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({
  user,
  onClose,
  userJoinedDays,
  onUserUpdated
}) => {
  // Wrap onClose in a function that accepts an event to prevent immediate closure
  const handleClose = (e: React.MouseEvent) => {
    // Prevent event propagation that might trigger other closures
    e.preventDefault();
    e.stopPropagation();
    console.log("DrawerContent: Closing drawer");
    onClose();
  };

  return (
    <DrawerSheetContent
      user={user}
      onClose={handleClose}
      userJoinedDays={userJoinedDays}
      onUserUpdated={onUserUpdated}
    />
  );
};
