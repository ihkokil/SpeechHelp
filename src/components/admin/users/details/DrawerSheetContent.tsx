
import React from 'react';
import { SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, ScrollText, Clock, Shield, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserHeader } from './UserHeader';
import { UserProfile } from './UserProfile';
import { UserSpeeches } from './UserSpeeches';
import { UserBilling } from './UserBilling';
import { UserStatistics } from './UserStatistics';
import { UserActivity } from './UserActivity';
import { UserPermissions } from './UserPermissions';
import { User as UserType } from '../types';

interface DrawerSheetContentProps {
  user: UserType;
  onClose: (e: React.MouseEvent) => void;
  speeches: any[];
  isLoadingSpeeches: boolean;
  userJoinedDays: number;
  totalActivityTime: number;
}

export const DrawerSheetContent: React.FC<DrawerSheetContentProps> = ({
  user,
  onClose,
  speeches,
  isLoadingSpeeches,
  userJoinedDays,
  totalActivityTime
}) => {
  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose(e);
  };

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
          Detailed information about {user.user_metadata?.full_name || user.email}
        </SheetDescription>
      </SheetHeader>
      
      <div className="space-y-6">
        <UserHeader user={user} />
        
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="speeches">
              <ScrollText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Speeches</span>
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <PieChart className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Statistics</span>
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Clock className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Shield className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Permissions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 pt-4">
            <UserProfile user={user} />
          </TabsContent>
          
          <TabsContent value="speeches" className="space-y-4 pt-4">
            <UserSpeeches user={user} />
          </TabsContent>
          
          <TabsContent value="billing" className="pt-4">
            <UserBilling user={user} />
          </TabsContent>

          <TabsContent value="statistics" className="pt-4">
            <UserStatistics 
              user={user} 
              speeches={speeches} 
              isLoadingSpeeches={isLoadingSpeeches} 
            />
          </TabsContent>

          <TabsContent value="activity" className="pt-4">
            <UserActivity 
              user={user} 
              speeches={speeches} 
              userJoinedDays={userJoinedDays}
              totalActivityTime={totalActivityTime}
            />
          </TabsContent>
          
          <TabsContent value="permissions" className="pt-4">
            <UserPermissions user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
