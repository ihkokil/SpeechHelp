
import React from 'react';
import { User } from '../types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from './components/Icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  UserCog,
  UserMinus,
  Mail,
  Eye,
  UserCheck,
  Shield,
  Clock,
  Edit,
} from 'lucide-react';
import UserActionMenu from './components/UserActionMenu';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedUsers: User[];
  toggleUserSelection: (userId: string) => void;
  toggleAllUsers: (checked: boolean) => void;
  handleViewUserDetails: (user: User) => void;
  handleManagePermissions: (user: User) => void;
  handleToggleUserStatus: (userId: string, isActive: boolean) => void;
  handleToggleUserSubscription: (userId: string) => void;
  setSelectedUsers: (users: User[]) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  searchTerm: string;
  handleBulkDelete: () => void;
  handleBulkActivate: () => void;
  handleBulkDeactivate: () => void;
  handleDeleteUser: (userId: string) => void;
  handleEditUser: (user: User) => void;
  handleSendEmail: (user: User) => void;
  handleUpdateSubscription?: (userId: string, plan: string, endDate: Date) => Promise<void>;
}

const UserTable: React.FC<UserTableProps> = ({
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
  searchTerm,
  handleBulkDelete,
  handleBulkActivate,
  handleBulkDeactivate,
  handleDeleteUser,
  handleEditUser,
  handleSendEmail,
  handleUpdateSubscription
}) => {
  const usersPerPage = 10;
  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  const usersToShow = users.slice(startIndex, endIndex);

  const UserTableRow: React.FC<{
    user: User;
    isSelected: boolean;
    toggleUserSelection: (userId: string) => void;
    handleViewUserDetails: (user: User) => void;
    handleManagePermissions: (user: User) => void;
    handleToggleUserStatus: (userId: string, isActive: boolean) => void;
    handleToggleUserSubscription: (userId: string) => void;
    handleDeleteUser: (userId: string) => void;
    handleEditUser: (user: User) => void;
    handleSendEmail: (user: User) => void;
    handleUpdateSubscription?: (userId: string, plan: string, endDate: Date) => Promise<void>;
  }> = ({
    user,
    isSelected,
    toggleUserSelection,
    handleViewUserDetails,
    handleManagePermissions,
    handleToggleUserStatus,
    handleToggleUserSubscription,
    handleDeleteUser,
    handleEditUser,
    handleSendEmail,
    handleUpdateSubscription
  }) => {
    return (
      <TableRow
        key={user.id}
        data-state={isSelected ? "selected" : undefined}
        onClick={() => handleViewUserDetails(user)}
        className="cursor-pointer"
      >
        <TableCell className="w-[40px] p-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleUserSelection(user.id)}
            aria-label={`Select user ${user.email}`}
          />
        </TableCell>
        <TableCell className="font-medium p-2">{user.user_metadata?.name || user.email}</TableCell>
        <TableCell className="p-2">{user.email}</TableCell>
        <TableCell className="p-2">{user.is_active !== false ? 'Active' : 'Inactive'}</TableCell>
        <TableCell className="p-2">{user.subscription_tier || 'Free'}</TableCell>
        <TableCell className="p-2 text-center">
          <UserActionMenu
            user={user}
            onViewDetails={handleViewUserDetails}
            onManagePermissions={handleManagePermissions}
            onToggleUserActive={handleToggleUserStatus}
            onExtendSubscription={() => handleToggleUserSubscription(user.id)}
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
            onSendEmail={handleSendEmail}
            onUpdateSubscription={handleUpdateSubscription}
          />
        </TableCell>
      </TableRow>
    );
  };

  const UserTableHeader: React.FC<{
    selectedUsers: User[];
    toggleAllUsers: (checked: boolean) => void;
    isLoading: boolean;
    handleBulkDelete: () => void;
    handleBulkActivate: () => void;
    handleBulkDeactivate: () => void;
  }> = ({ selectedUsers, toggleAllUsers, isLoading, handleBulkDelete, handleBulkActivate, handleBulkDeactivate }) => {
    const [showBulkActions, setShowBulkActions] = React.useState(false);

    React.useEffect(() => {
      setShowBulkActions(selectedUsers.length > 0);
    }, [selectedUsers]);

    return (
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center">
          <Checkbox
            checked={selectedUsers.length === users.length && users.length > 0}
            onCheckedChange={(checked) => toggleAllUsers(checked!)}
            aria-label="Select all users"
            disabled={isLoading || users.length === 0}
          />
          {showBulkActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  Bulk Actions <DotsHorizontalIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleBulkActivate} disabled={isLoading}>
                  Activate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBulkDeactivate} disabled={isLoading}>
                  Deactivate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleBulkDelete} disabled={isLoading}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {users.length > usersPerPage && (
          <div className="flex items-center space-x-2 text-sm">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>Page {currentPage} of {Math.ceil(users.length / usersPerPage)}</span>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(users.length / usersPerPage)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-md border mt-4">
      <UserTableHeader
        selectedUsers={selectedUsers}
        toggleAllUsers={toggleAllUsers}
        isLoading={isLoading}
        handleBulkDelete={handleBulkDelete}
        handleBulkActivate={handleBulkActivate}
        handleBulkDeactivate={handleBulkDeactivate}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <span className="sr-only">Select</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : usersToShow.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No users found.</TableCell>
            </TableRow>
          ) : (
            usersToShow.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.some(u => u.id === user.id)}
                toggleUserSelection={toggleUserSelection}
                handleViewUserDetails={handleViewUserDetails}
                handleManagePermissions={handleManagePermissions}
                handleToggleUserStatus={handleToggleUserStatus}
                handleToggleUserSubscription={handleToggleUserSubscription}
                handleDeleteUser={handleDeleteUser}
                handleEditUser={handleEditUser}
                handleSendEmail={handleSendEmail}
                handleUpdateSubscription={handleUpdateSubscription}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
