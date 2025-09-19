
import React from 'react';
import { SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User as UserIcon, CreditCard, Clock, PieChart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserHeader } from './UserHeader';
import { UserProfile } from './UserProfile';
import { UserBilling } from './UserBilling';
import { UserStatistics } from './UserStatistics';
import { UserActivity } from './UserActivity';
import { UserSpeeches } from './UserSpeeches';
import { User as UserType } from '../types';
import { formatUserDisplayName } from '../management/utils/userDisplayUtils';

interface DrawerSheetContentProps {
  user: UserType;
  onClose: (e: React.MouseEvent) => void;
  userJoinedDays: number;
}

export const DrawerSheetContent: React.FC<DrawerSheetContentProps> = ({
  user,
  onClose,
  userJoinedDays
}) => {
  // Handler that takes and passes the event properly
  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose(e);
  };

  // Log the data being passed to the component
  console.log("DrawerSheetContent rendering with:", {
    userId: user.id,
    userJoinedDays
  });

  return (
    <>
      <SheetHeader className="pb-4">
        <div className="flex justify-between items-center">
          <SheetTitle>User Details</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="sm" onClick={handleCloseClick}>
              Close
            </Button>
          </SheetClose>
        </div>
        <SheetDescription>
          Detailed information about <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium">{formatUserDisplayName(user)}</span>
        </SheetDescription>
      </SheetHeader>
      
      <div className="space-y-6">
        <UserHeader user={user} />
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <UserIcon className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="speeches">
              <FileText className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Speeches</span>
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <PieChart className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Statistics</span>
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Clock className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 pt-4">
            <UserProfile user={user} />
          </TabsContent>
          
          <TabsContent value="billing" className="pt-4">
            <UserBilling user={user} />
          </TabsContent>

          <TabsContent value="speeches" className="pt-4">
            <UserSpeeches user={user} />
          </TabsContent>

          <TabsContent value="statistics" className="pt-4">
            <UserStatistics 
              user={user} 
            />
          </TabsContent>

          <TabsContent value="activity" className="pt-4">
            <UserActivity 
              user={user} 
              userJoinedDays={userJoinedDays}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
