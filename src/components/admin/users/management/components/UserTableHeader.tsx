
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
        <TableHead className="w-12">
          <Checkbox 
            checked={isAllSelected}
            onCheckedChange={onToggleAll}
            disabled={disabled}
            aria-label="Select all users"
          />
        </TableHead>
        <TableHead className="min-w-[180px]">User</TableHead>
        <TableHead className="min-w-[200px]">Email</TableHead>
        <TableHead className="min-w-[120px]">Phone</TableHead>
        <TableHead className="w-24 text-center">Plan</TableHead>
        <TableHead className="min-w-[140px]">Joined</TableHead>
        <TableHead className="min-w-[140px]">Last Sign In</TableHead>
        <TableHead className="w-20 text-center">Status</TableHead>
        <TableHead className="w-16 text-center">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
});

UserTableHeader.displayName = "UserTableHeader";

export default UserTableHeader;
