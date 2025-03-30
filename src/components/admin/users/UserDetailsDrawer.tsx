
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, Settings, CreditCard, ScrollText, PieChart, Clock } from 'lucide-react';

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
    first_name?: string;
    last_name?: string;
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

type SpeechTypeStats = {
  type: string;
  count: number;
};

interface UserDetailsDrawerProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({ user, open, onClose }) => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [speechTypeStats, setSpeechTypeStats] = useState<SpeechTypeStats[]>([]);
  const [isLoadingSpeeches, setIsLoadingSpeeches] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [userJoinedDays, setUserJoinedDays] = useState<number>(0);
  const [totalActivityTime, setTotalActivityTime] = useState<number>(0);
  
  useEffect(() => {
    if (user && open) {
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
        calculateSpeechTypeStats(data || []);
      }
    } catch (error) {
      console.error('Exception fetching user speeches:', error);
    } finally {
      setIsLoadingSpeeches(false);
    }
  };

  const calculateSpeechTypeStats = (speeches: Speech[]) => {
    setIsLoadingStats(true);
    
    try {
      // Count speeches by type
      const typeCount: Record<string, number> = {};
      
      speeches.forEach(speech => {
        const type = speech.speech_type || 'unknown';
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
      
      // Convert to array for display
      const stats: SpeechTypeStats[] = Object.entries(typeCount).map(([type, count]) => ({
        type,
        count
      }));
      
      setSpeechTypeStats(stats.sort((a, b) => b.count - a.count));
    } catch (error) {
      console.error('Error calculating speech stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const calculateUserStats = (user: User) => {
    // Calculate days since user joined
    const createdDate = new Date(user.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setUserJoinedDays(diffDays);
    
    // Estimate total activity time based on speeches (5 minutes per speech as a rough estimate)
    setTotalActivityTime(5 * speeches.length);
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

    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return (user.user_metadata.first_name.charAt(0) + user.user_metadata.last_name.charAt(0)).toUpperCase();
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

  const getUserFullName = (user: User) => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }
    
    return user.email?.split('@')[0] || 'Unknown User';
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription>
            Detailed information about {getUserFullName(user)}
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
                {getUserFullName(user)}
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
            <TabsList className="grid w-full grid-cols-5">
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

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">First Name</p>
                      <p className="text-sm">{user.user_metadata?.first_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                      <p className="text-sm">{user.user_metadata?.last_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm">{user.user_metadata?.phone || 'Not provided'}</p>
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
                    All speeches created by this user
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
                      {speeches.map((speech) => (
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Plan</p>
                      <p className="text-sm">Free Plan</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Billing Cycle</p>
                      <p className="text-sm">N/A</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Next Billing Date</p>
                      <p className="text-sm">N/A</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                      <p className="text-sm">None on file</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md bg-muted/50 p-6 text-center">
                    <p className="text-muted-foreground">No billing records available.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Speech Statistics</CardTitle>
                  <CardDescription>
                    Statistics about the user's speeches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground">Loading statistics...</p>
                    </div>
                  ) : speeches.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No speech data available for statistics.</p>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Total Speeches: {speeches.length}</h4>
                        
                        <h4 className="text-sm font-medium mb-2 mt-4">Speech Types</h4>
                        <div className="space-y-2">
                          {speechTypeStats.map((stat) => (
                            <div key={stat.type} className="flex justify-between items-center">
                              <span className="text-sm">{stat.type}</span>
                              <div className="flex items-center">
                                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden mr-2">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${(stat.count / speeches.length) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-muted-foreground">{stat.count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Monthly Activity</h4>
                        <div className="rounded-md bg-muted/50 p-4">
                          <p className="text-center text-sm text-muted-foreground">
                            Average speeches per month: {(speeches.length / (userJoinedDays / 30)).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                        <p className="text-sm">{formatDate(user.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Days as Member</p>
                        <p className="text-sm">{userJoinedDays} days</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                        <p className="text-sm">{formatDate(user.last_sign_in_at) || 'Never'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Speeches</p>
                        <p className="text-sm">{speeches.length}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Est. Activity Time</p>
                        <p className="text-sm">{totalActivityTime} minutes</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg. Speech Length</p>
                        <p className="text-sm">
                          {speeches.length > 0 
                            ? Math.round(speeches.reduce((sum, speech) => sum + speech.content.length, 0) / speeches.length)
                            : 0} characters
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                      {speeches.length === 0 ? (
                        <p className="text-center py-4 text-muted-foreground">No recent activity recorded.</p>
                      ) : (
                        <div className="space-y-2">
                          {speeches.slice(0, 3).map((speech) => (
                            <div key={speech.id} className="flex justify-between text-sm border-b pb-2">
                              <span>Created "{speech.title}"</span>
                              <span className="text-muted-foreground">{formatDate(speech.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
