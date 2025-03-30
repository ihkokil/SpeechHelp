
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { 
  Search, 
  RefreshCw, 
  Download, 
  Upload, 
  UserPlus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  UserCog, 
  Clock, 
  Mail, 
  UserMinus, 
  Trash2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  id: string;
  email?: string;
  username?: string;
  phone?: string;
  subscription_plan?: string;
  banned?: boolean;
  confirmed_at?: string;
  created_at: string;
  last_sign_in_at?: string;
  status?: 'active' | 'inactive' | 'banned';
  is_admin?: boolean;
}

interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  phone?: string;
  subscription_plan?: string;
  [key: string]: any;
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        (user.email && user.email.toLowerCase().includes(lowercaseQuery)) ||
        (user.username && user.username.toLowerCase().includes(lowercaseQuery)) ||
        (user.phone && user.phone.includes(lowercaseQuery))
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Get all auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Get all profile data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      // Create typed profiles array with proper interface
      const typedProfiles = profiles as Profile[];
      
      const combinedUsers = authUsers.users.map(authUser => {
        // Create a fallback profile object that matches the Profile interface structure
        const profile = typedProfiles.find(p => p.id === authUser.id) || { 
          id: authUser.id,
          username: undefined,
          avatar_url: undefined,
          phone: undefined,
          subscription_plan: 'free'
        };
        
        // Determine user status
        let status: 'active' | 'inactive' | 'banned' = 'inactive';
        if (authUser.banned) {
          status = 'banned';
        } else if (authUser.confirmed_at) {
          status = 'active';
        }

        // Check if this is an admin user (simple check based on email)
        const isAdmin = authUser.email?.includes('admin@') || false;
        
        return {
          ...authUser,
          ...profile,
          username: profile.username || authUser.email?.split('@')[0] || 'N/A',
          phone: profile.phone || '—',
          subscription_plan: profile.subscription_plan || 'free',
          status,
          is_admin: isAdmin
        };
      });
      
      setUsers(combinedUsers as UserData[]);
      setFilteredUsers(combinedUsers as UserData[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete user from Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      // Update local state by refetching users
      await fetchUsers();
      
      toast({
        title: "Success",
        description: "User has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const exportUsers = () => {
    try {
      const dataStr = JSON.stringify(filteredUsers, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'users.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Success",
        description: "Users exported successfully.",
      });
    } catch (error) {
      console.error('Error exporting users:', error);
      toast({
        title: "Error",
        description: "Failed to export users. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Placeholder functions for user actions
  const viewUserDetails = (userId: string) => {
    console.log('View details for user:', userId);
    toast({
      title: "Info",
      description: "View details functionality coming soon.",
    });
  };

  const editUser = (userId: string) => {
    console.log('Edit user:', userId);
    toast({
      title: "Info",
      description: "Edit user functionality coming soon.",
    });
  };

  const managePermissions = (userId: string) => {
    console.log('Manage permissions for user:', userId);
    toast({
      title: "Info",
      description: "Manage permissions functionality coming soon.",
    });
  };

  const extendSubscription = (userId: string) => {
    console.log('Extend subscription for user:', userId);
    toast({
      title: "Info",
      description: "Extend subscription functionality coming soon.",
    });
  };

  const sendEmail = (userId: string, email?: string) => {
    console.log('Send email to user:', userId, email);
    toast({
      title: "Info",
      description: "Send email functionality coming soon.",
    });
  };

  const deactivateUser = (userId: string) => {
    console.log('Deactivate user:', userId);
    toast({
      title: "Info",
      description: "Deactivate user functionality coming soon.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage your application users, their roles, and permissions.
            </CardDescription>
            <div className="flex justify-between items-center mt-4">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={fetchUsers}
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={exportUsers}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  variant="outline"
                  disabled
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded border-gray-300"
                        disabled 
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Subscription Plan</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(2)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={9}>
                          <div className="animate-pulse flex items-center">
                            <div className="h-4 w-4 bg-gray-200 rounded mr-4"></div>
                            <div className="flex-1 space-y-4">
                              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300" 
                            disabled
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.is_admin ? (
                            <div className="flex items-center">
                              {user.username}
                              <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-700 border-purple-300">
                                Admin
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              {user.username}
                              {user.username === 'Wayne Gillis' && (
                                <span className="ml-2">🇬🇧</span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.subscription_plan === 'premium' ? 'default' : 'outline'}
                            className={user.subscription_plan === 'premium' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
                          >
                            {user.subscription_plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </TableCell>
                        <TableCell>
                          {user.last_sign_in_at ? 
                            new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            }) 
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : user.status === 'banned' ? 'destructive' : 'outline'}
                            className={user.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem onClick={() => viewUserDetails(user.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => editUser(user.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => managePermissions(user.id)}>
                                <UserCog className="h-4 w-4 mr-2" />
                                Manage Permissions
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => extendSubscription(user.id)}>
                                <Clock className="h-4 w-4 mr-2" />
                                Extend Subscription
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => sendEmail(user.id, user.email)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => deactivateUser(user.id)}>
                                <UserMinus className="h-4 w-4 mr-2" />
                                Deactivate User
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onClick={(e) => e.preventDefault()} 
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the user
                                      account and remove all associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {filteredUsers.length > 0 && (
              <div className="text-sm text-gray-500 mt-4">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUserManagement;
