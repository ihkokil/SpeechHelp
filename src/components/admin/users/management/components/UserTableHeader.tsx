
import React, { memo } from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface UserTableHeaderProps {
  onToggleAll: () => void;
  isAllSelected: boolean;
  disabled: boolean;
  selectedCount: number;
}

const UserTableHeader: React.FC<UserTableHeaderProps> = memo(({ 
  onToggleAll, 
  isAllSelected,
  disabled,
  selectedCount
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
        <TableHead className="w-[200px] md:w-[150px]">User</TableHead>
        <TableHead className="hidden sm:table-cell">Email</TableHead>
        <TableHead className="hidden md:table-cell">Phone</TableHead>
        <TableHead className="hidden md:table-cell">Plan</TableHead>
        <TableHead className="hidden lg:table-cell">Joined</TableHead>
        <TableHead className="hidden lg:table-cell">Last Sign In</TableHead>
        <TableHead className="hidden sm:table-cell">Status</TableHead>
        <TableHead>
          <span className="sr-only sm:not-sr-only">Actions</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
});

UserTableHeader.displayName = "UserTableHeader";

export default UserTableHeader;
