
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  RefreshCw, 
  Loader2, 
  UserMinus, 
  Mail, 
  Download, 
  FileUp,
  UserPlus 
} from 'lucide-react';
import { User } from '../types';

interface SearchToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  fetchUsers: () => void;
  refreshUsers?: () => void;
  selectedUsers: User[];
  isActionLoading: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setIsAddUserDialogOpen: (isOpen: boolean) => void;
  lastFetchTime?: number;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  isLoading,
  fetchUsers,
  refreshUsers,
  selectedUsers,
  isActionLoading,
  setIsDeleteDialogOpen,
  setIsAddUserDialogOpen,
  lastFetchTime
}) => {
  const handleAddUserClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Add User button clicked, opening dialog");
    setIsAddUserDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Delete button clicked, selected users:", selectedUsers.length);
    if (selectedUsers.length > 0) {
      setIsDeleteDialogOpen(true);
    }
  };

  const handleRefreshClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (refreshUsers) {
      refreshUsers();
    } else {
      fetchUsers();
    }
  };

  const formatLastUpdateTime = () => {
    if (!lastFetchTime) return '';
    const now = Date.now();
    const diffSeconds = Math.floor((now - lastFetchTime) / 1000);
    
    if (diffSeconds < 60) return `Updated ${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `Updated ${Math.floor(diffSeconds / 60)}m ago`;
    return `Updated ${Math.floor(diffSeconds / 3600)}h ago`;
  };

  return (
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
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefreshClick}
            disabled={isLoading}
            title={refreshUsers ? "Force refresh data" : "Refresh data"}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="sr-only">Refresh</span>
          </Button>
          {lastFetchTime && (
            <span className="text-xs text-gray-500 hidden sm:block">
              {formatLastUpdateTime()}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {selectedUsers.length > 0 && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDeleteClick}
              disabled={isActionLoading}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              Delete ({selectedUsers.length})
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
        <Button onClick={handleAddUserClick} type="button">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
    </div>
  );
};
