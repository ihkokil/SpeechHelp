
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, PieChart, CreditCard, ScrollText, Clock, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { UserHeader } from './details/UserHeader';
import { UserProfile } from './details/UserProfile';
import { UserSpeeches } from './details/UserSpeeches';
import { UserBilling } from './details/UserBilling';
import { UserStatistics } from './details/UserStatistics';
import { UserActivity } from './details/UserActivity';
import { User as UserType, Speech } from './types';
import { Button } from '@/components/ui/button';

interface UserDetailsDrawerProps {
  user: UserType | null;
  open: boolean;
  onClose: () => void;
}

const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({ user, open, onClose }) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(false);
  const [userJoinedDays, setUserJoinedDays] = useState<number>(0);
  const [totalActivityTime, setTotalActivityTime] = useState<number>(0);
  
  // Reset states when the drawer opens with a new user
  useEffect(() => {
    if (user && open) {
      setSpeeches([]);
      setIsLoadingSpeeches(false);
      setUserJoinedDays(0);
      setTotalActivityTime(0);
      fetchUserSpeeches(user.id);
      calculateUserStats(user);
    }
  }, [user, open]);
  
  const fetchUserSpeeches = async (userId: string) => {
    setIsLoadingSpeeches(true);
    try {
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching user speeches:', error);
      } else {
        setSpeeches(data || []);
        calculateTotalActivityTime(data || []);
      }
    } catch (error) {
      console.error('Exception fetching user speeches:', error);
    } finally {
      setIsLoadingSpeeches(false);
    }
  };

  const calculateUserStats = (user: UserType) => {
    // Calculate days since user joined
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setUserJoinedDays(diffDays);
  };
  
  const calculateTotalActivityTime = (speeches: Speech[]) => {
    // Estimate total activity time based on speeches (5 minutes per speech as a rough estimate)
    setTotalActivityTime(5 * speeches.length);
  };
  
  // Handle closing the drawer
  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Ensure we only call onClose when the drawer is actually closing
      console.log('Drawer closing, calling onClose');
      onClose();
    }
  };
  
  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex justify-between items-center">
            <SheetTitle>User Details</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="sm" onClick={() => onClose()}>Close</Button>
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
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
                  <h3 className="font-medium flex items-center text-amber-800">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Permissions
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Manage this user's administrative permissions from the user management page.
                  </p>
                </div>
                
                {user.is_admin ? (
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-2">Current Admin Role</h3>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                        <span>{user.admin_role || 'No specific role'}</span>
                      </div>
                    </div>
                    
                    {user.permissions && user.permissions.length > 0 && (
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">Permissions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {user.permissions.map(permission => (
                            <div key={permission} className="flex items-center text-sm">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                              <span>{permission}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center text-muted-foreground">
                    This user does not have any administrative permissions.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsDrawer;
