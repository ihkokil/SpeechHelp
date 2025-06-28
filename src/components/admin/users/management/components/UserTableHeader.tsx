
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

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
  const { translate } = useTranslatedContent();
  
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
            onCheckedChange={handleCheckboxChange}
            disabled={disabled}
            aria-label={translate('admin.userTable.selectAll')}
          />
        </TableHead>
        <TableHead className="px-2">{translate('admin.userTable.name')}</TableHead>
        <TableHead className="px-2">{translate('admin.userTable.email')}</TableHead>
        <TableHead className="px-2">{translate('admin.userTable.phone')}</TableHead>
        <TableHead className="px-2 text-center">{translate('admin.userTable.status')}</TableHead>
        <TableHead className="px-2 text-center">{translate('admin.userTable.role')}</TableHead>
        <TableHead className="px-2 text-center">{translate('admin.userTable.plan')}</TableHead>
        <TableHead className="px-2">{translate('admin.userTable.joined')}</TableHead>
        <TableHead className="px-2">{translate('admin.userTable.lastLogin')}</TableHead>
        <TableHead className="px-2 text-right">{translate('admin.userTable.actions')}</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UserTableHeader;
