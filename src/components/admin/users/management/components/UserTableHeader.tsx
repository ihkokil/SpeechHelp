
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { UserMinus, Ban, CheckCircle } from 'lucide-react';

interface UserTableHeaderProps {
  onToggleAll: () => void;
  isAllSelected: boolean;
  disabled: boolean;
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
}

const UserTableHeader: React.FC<UserTableHeaderProps> = ({ 
  onToggleAll, 
  isAllSelected,
  disabled,
  selectedCount,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate
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
        <TableHead className="w-[250px]">User</TableHead>
        <TableHead className="hidden md:table-cell">Email</TableHead>
        <TableHead className="hidden md:table-cell">Phone</TableHead>
        <TableHead className="hidden md:table-cell">Plan</TableHead>
        <TableHead className="hidden md:table-cell">Joined</TableHead>
        <TableHead className="hidden lg:table-cell">Last Sign In</TableHead>
        <TableHead className="hidden md:table-cell">Status</TableHead>
        <TableHead>
          {selectedCount > 0 && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-1"
                onClick={onBulkDelete}
              >
                <UserMinus className="h-4 w-4" />
                <span>Delete</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-1"
                onClick={onBulkDeactivate}
              >
                <Ban className="h-4 w-4" />
                <span>Deactivate</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-1"
                onClick={onBulkActivate}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Activate</span>
              </Button>
            </div>
          )}
          {selectedCount === 0 && (
            <span>Actions</span>
          )}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UserTableHeader;
