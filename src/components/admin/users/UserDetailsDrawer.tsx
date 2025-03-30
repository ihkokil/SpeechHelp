
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, Settings, CreditCard, ScrollText } from 'lucide-react';

// User type definition
type User = {
  id: string;
  email: string;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string | null;
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
  user_metadata: {
    name?: string;
    full_name?: string;
  };
  is_active?: boolean;
};

type Speech = {
  id: string;
  title: string;
  speech_type: string;
  created_at: string;
  content: string;
};

interface UserDetailsDrawerProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({ user, open, onClose }) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(false);
  
  useEffect(() => {
    if (user && open) {
      fetchUserSpeeches(user.id);
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
      }
    } catch (error) {
      console.error('Exception fetching user speeches:', error);
    } finally {
      setIsLoadingSpeeches(false);
    }
  };
  
  if (!user) return null;
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP p');
  };

  const getUserInitials = (user: User) => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    
    if (user.user_metadata?.name) {
      return user.user_metadata.name.charAt(0).toUpperCase();
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const getEmailHash = (email: string) => {
    // This is not a real MD5 hash, just for demo purposes
    return btoa(email).replace(/[/+=]/g, '');
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription>
            View detailed information about this user.
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`https://gravatar.com/avatar/${getEmailHash(user.email)}?d=mp`} />
              <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">
                {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <Badge variant={user.is_active !== false ? 'default' : 'secondary'}>
                  {user.is_active !== false ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
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
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">User ID</p>
                      <p className="text-sm break-all">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p className="text-sm">{user.is_active !== false ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created</p>
                      <p className="text-sm">{formatDate(user.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="text-sm">{formatDate(user.updated_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                      <p className="text-sm">{formatDate(user.last_sign_in_at) || 'Never'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Provider</p>
                      <p className="text-sm">{user.app_metadata?.provider || 
                                            (user.app_metadata?.providers && user.app_metadata.providers[0]) || 
                                            'email'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="speeches" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Speeches</CardTitle>
                  <CardDescription>
                    Speeches created by this user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingSpeeches ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground">Loading speeches...</p>
                    </div>
                  ) : speeches.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No speeches found for this user.</p>
                  ) : (
                    <div className="space-y-4">
                      {speeches.slice(0, 5).map((speech) => (
                        <div key={speech.id} className="border rounded-md p-4">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{speech.title}</h4>
                            <Badge>{speech.speech_type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Created: {formatDate(speech.created_at)}
                          </p>
                          <p className="text-sm mt-2 line-clamp-2">
                            {speech.content.substring(0, 150)}...
                          </p>
                        </div>
                      ))}
                      
                      {speeches.length > 5 && (
                        <p className="text-center text-sm text-muted-foreground">
                          Showing 5 of {speeches.length} speeches.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Billing details and subscription information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted/50 p-6 text-center">
                    <p className="text-muted-foreground">No billing information available.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage user account settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted/50 p-6 text-center">
                    <p className="text-muted-foreground">Account settings management coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailsDrawer;
