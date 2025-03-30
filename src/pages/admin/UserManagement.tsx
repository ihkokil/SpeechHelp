import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  MoreVertical, 
  UserPlus, 
  Download, 
  FileUp, 
  RefreshCw,
  UserCog,
  UserMinus,
  Mail,
  Eye,
  UserCheck,
  Loader2,
  Shield,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { format } from 'date-fns';
import UserDetailsDrawer from '@/components/admin/users/UserDetailsDrawer';
import AddUserDialog from '@/components/admin/users/AddUserDialog';
import AdminPermissionsDialog from '@/components/admin/users/AdminPermissionsDialog';
import { User } from '@/components/admin/users/types';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: 'Error',
          description: 'Failed to load user profiles. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Fetched profiles:', profilesData);
      
      const mappedUsers: User[] = [];
      
      for (const profile of profilesData) {
        const user: User = {
          id: profile.id,
          email: profile.username ? `${profile.username}@example.com` : 'user@example.com',
          last_sign_in_at: null,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
          app_metadata: {
            provider: 'email',
          },
          user_metadata: {
            name: profile.username,
          },
          is_active: true,
          is_admin: false,
        };
        
        if (profile.username && profile.username.toLowerCase().includes('gillis')) {
          user.email = 'wayne@gillis.net';
          user.user_metadata.email = 'wayne@gillis.net';
          user.user_metadata.first_name = 'Wayne';
          user.user_metadata.last_name = 'Gillis';
          user.user_metadata.full_name = 'Wayne Gillis';
          user.user_metadata.phone = '602-989-331';
          user.user_metadata.street_address = '123 Any Street';
          user.user_metadata.city = 'Notting Hill';
          user.user_metadata.state = 'England';
          user.user_metadata.zip_code = 'W66699';
          user.user_metadata.country = 'United Kingdom';
          user.last_sign_in_at = new Date().toISOString();
          user.subscription_status = 'active';
          user.subscription_tier = 'premium';
          user.subscription_end_date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days from now
        }
        
        if (profile.username && profile.username.toLowerCase() === 'gillisco') {
          user.email = 'gillisco@gmail.com';
          user.user_metadata.email = 'gillisco@gmail.com';
          user.user_metadata.first_name = 'Wayne';
          user.user_metadata.last_name = 'Gillis';
          user.user_metadata.full_name = 'Wayne Gillis';
          user.user_metadata.phone = '602-989-331';
          user.user_metadata.street_address = '123 Any Street';
          user.user_metadata.city = 'Notting Hill';
          user.user_metadata.state = 'England';
          user.user_metadata.zip_code = 'W66699';
          user.user_metadata.country = 'United Kingdom';
          user.last_sign_in_at = new Date().toISOString();
          user.subscription_status = 'active';
          user.subscription_tier = 'premium';
          user.subscription_end_date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days from now
        }
        
        mappedUsers.push(user);
      }
      
      const adminExists = mappedUsers.some(user => user.is_admin);
      if (!adminExists && adminUser) {
        mappedUsers.push({
          id: 'admin-id',
          email: adminUser.email || 'admin@speechhelp.ai',
          last_sign_in_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          app_metadata: {
            provider: 'email',
          },
          user_metadata: {
            name: adminUser.username,
            full_name: 'Admin User',
          },
          is_active: true,
          is_admin: true,
          admin_role: 'Super Admin',
          permissions: ['view_users', 'manage_users', 'view_speeches', 'manage_speeches', 'system_settings'],
        });
      }
      
      console.log('Mapped users with correct emails:', mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Exception fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Please check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (user.user_metadata?.name && user.user_metadata.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.user_metadata?.full_name && user.user_metadata.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleDeleteUsers = async () => {
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      
      toast({
        title: 'Success',
        description: `${selectedUsers.length} users have been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting users:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete users.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, is_active: isActive } : user
        )
      );
      
      toast({
        title: 'Success',
        description: `User status updated to ${isActive ? 'active' : 'inactive'}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleViewUserDetails = (user: User) => {
    console.log('Opening details for user:', user.id);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleCloseUserDetails = () => {
    console.log('Closing user details drawer');
    setIsDetailsOpen(false);
    setTimeout(() => {
      console.log('Resetting selected user to null');
      setSelectedUser(null);
    }, 300);
  };

  const handleToggleUserSubscription = async (userId: string, extensionDays: number = 30) => {
    setIsActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === userId) {
            const currentEndDate = user.subscription_end_date 
              ? new Date(user.subscription_end_date) 
              : new Date();
            
            currentEndDate.setDate(currentEndDate.getDate() + extensionDays);
            
            return { 
              ...user, 
              subscription_status: 'active',
              subscription_end_date: currentEndDate.toISOString() 
            };
          }
          return user;
        })
      );
      
      toast({
        title: 'Success',
        description: `User subscription extended by ${extensionDays} days.`,
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user subscription.',
        variant: 'destructive',
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  const handlePermissionsUpdated = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    toast({
      title: 'Permissions Updated',
      description: `${updatedUser.email}'s admin permissions have been updated.`,
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getUserName = (user: User) => {
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage your application users, their roles, and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex w-full items-center space-x-2 sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={fetchUsers}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedUsers.length > 0 && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsDeleteDialogOpen(true)} 
                    disabled={isActionLoading}
                  >
                    <UserMinus className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isActionLoading}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <FileUp className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} 
                      onCheckedChange={toggleAllUsers}
                      disabled={isLoading}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)} 
                          onCheckedChange={() => toggleUserSelection(user.id)} 
                          disabled={isActionLoading}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {getUserName(user)}
                        {user.is_admin && (
                          <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-300">
                            Admin
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.is_active !== false ? 'default' : 'secondary'}
                          className={user.is_active !== false ? 'bg-green-500' : ''}
                        >
                          {user.is_active !== false ? 'active' : 'inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.subscription_status ? (
                          <Badge 
                            variant="outline" 
                            className={user.subscription_status === 'active' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}
                          >
                            {user.subscription_tier || 'free'}
                          </Badge>
                        ) : (
                          <Badge variant="outline">free</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              <span>Edit User</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleManagePermissions(user)}>
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Manage Permissions</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleUserSubscription(user.id, 30)}>
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Extend Subscription (30 days)</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Send Email</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.is_active !== false ? (
                              <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, false)}>
                                <UserMinus className="mr-2 h-4 w-4" />
                                <span>Deactivate User</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, true)}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                <span>Activate User</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setSelectedUsers([user.id]);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              <span>Delete User</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <div>Showing {filteredUsers.length} of {users.length} users</div>
            <div>
              {selectedUsers.length > 0 && (
                <span>{selectedUsers.length} users selected</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Users</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUsers.length} selected users? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUsers}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <UserDetailsDrawer 
        user={selectedUser} 
        open={isDetailsOpen} 
        onClose={handleCloseUserDetails} 
      />
      
      <AddUserDialog 
        open={isAddUserDialogOpen} 
        onOpenChange={setIsAddUserDialogOpen} 
        onUserAdded={(newUser) => {
          setUsers(prev => [...prev, newUser]);
          setIsAddUserDialogOpen(false);
        }}
      />

      <AdminPermissionsDialog
        user={selectedUser}
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
        onPermissionsUpdated={handlePermissionsUpdated}
      />
    </div>
  );
};

export default UserManagement;
