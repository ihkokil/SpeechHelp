
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Download, 
  Upload, 
  Trash2, 
  UserCog, 
  Mail 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface UserData {
  id: string;
  email?: string;
  username?: string;
  banned?: boolean;
  confirmed_at?: string;
  created_at: string;
  last_sign_in_at?: string;
}

interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
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
        (user.username && user.username.toLowerCase().includes(lowercaseQuery))
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
      
      // Combine data - explicitly type profiles as Profile[]
      const typedProfiles = profiles as Profile[];
      
      const combinedUsers = authUsers.users.map(authUser => {
        const profile = typedProfiles.find(p => p.id === authUser.id) || { id: authUser.id };
        return {
          ...authUser,
          ...profile,
          username: profile.username || authUser.email?.split('@')[0] || 'N/A'
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-2 text-purple-600" />
            <h1 className="text-2xl font-bold">User Management</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={exportUsers}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" disabled>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user accounts, permissions, and settings.
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}>
                          <div className="animate-pulse flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.banned ? "destructive" : user.confirmed_at ? "default" : "outline"}>
                            {user.banned ? "Banned" : user.confirmed_at ? "Active" : "Unconfirmed"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log("View", user.id)}>
                                <UserCog className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Email", user.id)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onClick={(e) => e.preventDefault()} className="text-red-600">
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
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUserManagement;
