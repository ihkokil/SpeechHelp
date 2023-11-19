
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface UserTableHeaderProps {
  onToggleAll: () => void;
  isAllSelected: boolean;
  disabled: boolean;
}

const UserTableHeader: React.FC<UserTableHeaderProps> = ({ 
  onToggleAll, 
  isAllSelected,
  disabled
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
        <TableHead className="hidden md:table-cell">Status</TableHead>
        <TableHead className="hidden md:table-cell">Joined</TableHead>
        <TableHead className="hidden lg:table-cell">Last Sign In</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UserTableHeader;
