
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface UserTableHeaderProps {
  onToggleAll: () => void;
  isAllSelected: boolean;
  disabled?: boolean;
}

const UserTableHeader: React.FC<UserTableHeaderProps> = ({
  onToggleAll,
  isAllSelected,
  disabled = false
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox 
            checked={isAllSelected} 
            onCheckedChange={onToggleAll}
            disabled={disabled}
          />
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email Address</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Subscription Plan</TableHead>
        <TableHead>Created</TableHead>
        <TableHead>Last Login</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="w-12 text-right pr-2">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UserTableHeader;
