
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, UserPlus, Trash2 } from 'lucide-react';
import { User } from '../types';

interface SearchToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  fetchUsers: (forceRefresh?: boolean) => Promise<User[]>;
  forceRefresh: () => Promise<void>;
  selectedUsers: User[];
  isActionLoading: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsAddUserDialogOpen: (open: boolean) => void;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  isLoading,
  fetchUsers,
  forceRefresh,
  selectedUsers,
  isActionLoading,
  setIsDeleteDialogOpen,
  setIsAddUserDialogOpen,
}) => {
  const handleRefresh = async () => {
    try {
      await forceRefresh();
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  const handleForceRefresh = async () => {
    try {
      console.log('Force refreshing user data...');
      await fetchUsers(true);
    } catch (error) {
      console.error('Error force refreshing users:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleForceRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Force Refresh
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          onClick={() => setIsAddUserDialogOpen(true)}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
        
        {selectedUsers.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isActionLoading}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete ({selectedUsers.length})
          </Button>
        )}
      </div>
    </div>
  );
};
