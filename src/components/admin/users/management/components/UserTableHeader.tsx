
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
        <TableHead className="w-12 px-2">
          <Checkbox 
            checked={isAllSelected}
            onCheckedChange={onToggleAll}
            disabled={disabled}
            aria-label="Select all users"
          />
        </TableHead>
        <TableHead className="min-w-[150px] px-2">User</TableHead>
        <TableHead className="min-w-[180px] px-2 hidden sm:table-cell">Email</TableHead>
        <TableHead className="min-w-[100px] px-2 hidden lg:table-cell">Phone</TableHead>
        <TableHead className="w-20 text-center px-2 hidden md:table-cell">Plan</TableHead>
        <TableHead className="min-w-[120px] px-2 hidden xl:table-cell">Joined</TableHead>
        <TableHead className="min-w-[120px] px-2 hidden xl:table-cell">Last Sign In</TableHead>
        <TableHead className="w-20 text-center px-2 hidden md:table-cell">Status</TableHead>
        <TableHead className="w-16 text-center px-2">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
});

UserTableHeader.displayName = "UserTableHeader";

export default UserTableHeader;
