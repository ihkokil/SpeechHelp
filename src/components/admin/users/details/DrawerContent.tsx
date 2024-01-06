
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
  return (
    <DrawerSheetContent
      user={user}
      onClose={onClose}
      speeches={speeches}
      isLoadingSpeeches={isLoadingSpeeches}
      userJoinedDays={userJoinedDays}
      totalActivityTime={totalActivityTime}
    />
  );
};
