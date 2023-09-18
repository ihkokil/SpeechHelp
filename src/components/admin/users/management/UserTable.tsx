
import React, { useMemo, useCallback } from 'react';
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
import { formatPhoneNumber } from '@/components/settings/profile/utils/phoneUtils';

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
  const filteredUsers = useMemo(() => users.filter(user => 
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (user.user_metadata?.name && user.user_metadata.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.user_metadata?.full_name && user.user_metadata.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [users, searchTerm]);

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return 'Never';
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  }, []);

  const getUserName = useCallback((user: User) => {
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'Unknown';
  }, []);

  const getUserPhone = useCallback((user: User) => {
    const phone = user.user_metadata?.phone;
    if (!phone) return '—';
    
    const countryCode = user.user_metadata?.country_code || 'US';
    
    let dialCode = '1';
    
    const formattedNumber = formatPhoneNumber(phone, countryCode);
    
    if (countryCode && countryCode !== 'US') {
      const countries = require('@/data/countries').default;
      const country = countries.find((c: any) => c.code === countryCode);
      if (country) {
        dialCode = country.dialCode;
      }
    }
    
    return `+${dialCode} ${formattedNumber}`;
  }, []);

  const getCountryFlagUrl = useCallback((countryCode: string) => {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  }, []);

  const viewUserDetails = useCallback((e: React.MouseEvent, user: User) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserTable: View details clicked for user:', user.id);
    handleViewUserDetails(user);
  }, [handleViewUserDetails]);

  const managePermissions = useCallback((e: React.MouseEvent, user: User) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserTable: Manage permissions clicked for user:', user.id);
    handleManagePermissions(user);
  }, [handleManagePermissions]);

  const toggleUserActive = useCallback((e: React.MouseEvent, userId: string, isActive: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserTable: Toggling user status:', userId, isActive);
    handleToggleUserStatus(userId, isActive);
  }, [handleToggleUserStatus]);

  const extendSubscription = useCallback((e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserTable: Extending subscription for user:', userId);
    handleToggleUserSubscription(userId, 30);
  }, [handleToggleUserSubscription]);

  const deleteUser = useCallback((e: React.MouseEvent, userId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('UserTable: Preparing to delete user:', userId);
    setSelectedUsers([userId]);
    setIsDeleteDialogOpen(true);
  }, [setSelectedUsers, setIsDeleteDialogOpen]);

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
            <TableHead>Email Address</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Subscription Plan</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right pr-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
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
              <TableCell colSpan={9} className="h-24 text-center">
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
                  <div className="flex items-center">
                    {user.user_metadata?.country_code && (
                      <img 
                        src={getCountryFlagUrl(user.user_metadata.country_code)}
                        alt={user.user_metadata.country || user.user_metadata.country_code}
                        className="h-4 w-auto mr-2"
                        title={user.user_metadata.country || user.user_metadata.country_code}
                      />
                    )}
                    <span>{getUserName(user)}</span>
                    {user.is_admin && (
                      <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-300">
                        Admin
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getUserPhone(user)}</TableCell>
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
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.is_active !== false ? 'default' : 'secondary'}
                    className={user.is_active !== false ? 'bg-green-500' : ''}
                  >
                    {user.is_active !== false ? 'active' : 'inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]" sideOffset={5} collisionPadding={10}>
                      <DropdownMenuItem onClick={(e) => viewUserDetails(e, user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Edit User</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => managePermissions(e, user)}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Manage Permissions</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => extendSubscription(e, user.id)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Extend Subscription</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Send Email</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.is_active !== false ? (
                        <DropdownMenuItem 
                          onClick={(e) => toggleUserActive(e, user.id, false)}
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          <span>Deactivate User</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={(e) => toggleUserActive(e, user.id, true)}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          <span>Activate User</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-700 focus:bg-red-50"
                        onClick={(e) => deleteUser(e, user.id)}
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
