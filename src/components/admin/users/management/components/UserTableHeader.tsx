
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface UserTableHeaderProps {
  onToggleAll: () => void;
  isAllSelected: boolean;
  disabled: boolean;
  selectedCount: number;
  onBulkDelete: () => void;
}

const UserTableHeader: React.FC<UserTableHeaderProps> = ({ 
  onToggleAll, 
  isAllSelected,
  disabled,
  selectedCount,
  onBulkDelete
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[40px]">
          <Checkbox 
            checked={isAllSelected}
            onCheckedChange={onToggleAll}
            disabled={disabled}
            aria-label="Select all users"
          />
        </TableHead>
        <TableHead className="w-[200px]">User</TableHead>
        <TableHead>Email</TableHead>
        <TableHead className="hidden md:table-cell">Phone</TableHead>
        <TableHead className="hidden md:table-cell">Plan</TableHead>
        <TableHead className="hidden md:table-cell">Joined</TableHead>
        <TableHead className="hidden lg:table-cell">Last Sign In</TableHead>
        <TableHead className="hidden md:table-cell">Status</TableHead>
        <TableHead>
          {selectedCount > 0 ? (
            <div className="flex items-center justify-between">
              <span>Actions</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBulkDelete}
                className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          ) : (
            <span>Actions</span>
          )}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UserTableHeader;
