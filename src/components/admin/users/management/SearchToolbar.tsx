
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

interface SearchToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isActionLoading?: boolean;
  onAddUser?: () => void;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCount,
  onDeleteSelected,
  onRefresh,
  isLoading,
  isActionLoading,
  onAddUser
}) => {
  return (
    <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex w-full items-center space-x-2 sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRefresh}
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
        {selectedCount > 0 && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDeleteSelected}
              disabled={isActionLoading}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button 
              variant="outline" 
              size="sm"
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
        <Button onClick={onAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
    </div>
  );
};
