
import { useState } from 'react';
import { Search, Plus, RefreshCcw, Trash, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User } from '../types';

export interface SearchToolbarProps {
  // Search properties
  searchTerm?: string;
  searchQuery?: string; // For backward compatibility
  onSearchChange?: React.Dispatch<React.SetStateAction<string>>;
  
  // Loading state
  isLoading?: boolean;
  isActionLoading?: boolean;
  
  // User selection
  selectedCount?: number;
  selectedUsers?: User[];
  
  // Actions
  onRefresh?: () => void;
  fetchUsers?: () => Promise<any>; // For backward compatibility
  onAddUser?: () => void;
  onDeleteSelected?: () => void;
  onActivateSelected?: () => void;
  onDeactivateSelected?: () => void;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchTerm,
  searchQuery,
  onSearchChange,
  isLoading = false,
  isActionLoading = false,
  selectedCount = 0,
  onRefresh,
  fetchUsers,
  onAddUser,
  onDeleteSelected,
  onActivateSelected,
  onDeactivateSelected
}) => {
  // Use correct search term based on what's provided
  const actualSearchTerm = searchTerm ?? searchQuery ?? '';
  
  // Handler function to normalize the search term change function
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  // Choose the correct refresh function
  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else if (fetchUsers) {
      await fetchUsers();
    }
  };

  const isDisabled = isLoading || isActionLoading;
  const hasSelectedUsers = selectedCount > 0;

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8 w-full md:w-80"
          value={actualSearchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        {/* Bulk action buttons - visible only when users are selected */}
        {hasSelectedUsers && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={onDeleteSelected}
              disabled={isDisabled}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
              {selectedCount > 0 && <span className="ml-1">({selectedCount})</span>}
            </Button>

            {onActivateSelected && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={onActivateSelected}
                disabled={isDisabled}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate
              </Button>
            )}

            {onDeactivateSelected && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={onDeactivateSelected}
                disabled={isDisabled}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
            )}

            <Separator orientation="vertical" className="h-8 mx-1" />
          </div>
        )}

        {/* Always visible action buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={handleRefresh}
            disabled={isDisabled}
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            variant="default"
            size="sm"
            className="flex items-center"
            onClick={onAddUser}
            disabled={isDisabled}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchToolbar;
