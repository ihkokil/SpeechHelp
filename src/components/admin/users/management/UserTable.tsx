
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  UserCog,
  UserMinus,
  Mail,
  Eye,
  UserCheck,
  Shield,
  Clock,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { User } from '../types';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedUsers: string[];
  toggleUserSelection: (userId: string) => void;
  toggleAllUsers: () => void;
  handleViewUserDetails: (user: User) => void;
  handleManagePermissions: (user: User) => void;
  handleToggleUserStatus: (userId: string, isActive: boolean) => void;
  handleToggleUserSubscription: (userId: string, days: number) => void;
  setSelectedUsers: (users: string[]) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  searchTerm: string;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  isLoading, 
  selectedUsers, 
  toggleUserSelection, 
  toggleAllUsers, 
  handleViewUserDetails, 
  handleManagePermissions, 
  handleToggleUserStatus, 
  handleToggleUserSubscription, 
  setSelectedUsers, 
  setIsDeleteDialogOpen,
  searchTerm
}) => {
  const filteredUsers = users.filter(user => 
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (user.user_metadata?.name && user.user_metadata.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.user_metadata?.full_name && user.user_metadata.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <TableHead className="w-12 text-right pr-2">Actions</TableHead>
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
                  <Badge 
                    variant="outline" 
                    className={`min-w-[70px] justify-center inline-flex ${
                      user.subscription_status === 'active' 
                        ? 'bg-blue-100 text-blue-800 border-blue-300' 
                        : ''
                    }`}
                  >
                    {user.subscription_tier || 'free'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]" sideOffset={5} collisionPadding={10} forceMount>
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
                        <span>Extend Subscription</span>
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
                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
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
      <div className="mt-4 flex justify-between text-sm text-gray-500 p-4">
        <div>Showing {filteredUsers.length} of {users.length} users</div>
        <div>
          {selectedUsers.length > 0 && (
            <span>{selectedUsers.length} users selected</span>
          )}
        </div>
      </div>
    </div>
  );
};
