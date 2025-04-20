
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface UserTableHeaderProps {
  onToggleAll: () => void;
  isAllSelected: boolean;
  disabled?: boolean;
  selectedCount: number;
}

const UserTableHeader: React.FC<UserTableHeaderProps> = ({
  onToggleAll,
  isAllSelected,
  disabled = false,
  selectedCount
}) => {
  const handleCheckboxChange = () => {
    if (!disabled) {
      onToggleAll();
    }
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12 px-2">
          <Checkbox
            checked={isAllSelected}
            onChange={handleCheckboxChange}
            disabled={disabled}
            aria-label="Select all users"
          />
        </TableHead>
        <TableHead className="px-2">Name</TableHead>
        <TableHead className="px-2">Email</TableHead>
        <TableHead className="px-2 text-center">Status</TableHead>
        <TableHead className="px-2 text-center">Role</TableHead>
        <TableHead className="px-2 text-center">Plan</TableHead>
        <TableHead className="px-2">Joined</TableHead>
        <TableHead className="px-2">Last Login</TableHead>
        <TableHead className="px-2 text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UserTableHeader;
