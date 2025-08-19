
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '../../types';
import { formatUserDisplayName, getUserPhone, getCountryFlag } from '../utils/userDisplayUtils';
import { format } from 'date-fns';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import { StatusBadge, RoleBadge, SubscriptionBadge } from './UserBadges';

interface SelectionCellProps {
  user: User;
  isSelected: boolean;
  onToggleSelection: (user: User) => void;
}

export const SelectionCell: React.FC<SelectionCellProps> = ({ user, isSelected, onToggleSelection }) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection(user);
  };

  return (
    <TableCell className="w-12 px-2">
      <Checkbox
        checked={isSelected}
        onClick={handleCheckboxClick}
        aria-label={`Select ${formatUserDisplayName(user)}`}
      />
    </TableCell>
  );
};

interface NameCellProps {
  user: User;
}

export const NameCell: React.FC<NameCellProps> = ({ user }) => (
  <TableCell className="px-2">
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-900">{formatUserDisplayName(user)}</span>
    </div>
  </TableCell>
);

interface EmailCellProps {
  user: User;
}

export const EmailCell: React.FC<EmailCellProps> = ({ user }) => (
  <TableCell className="px-2">
    <span className="text-sm text-gray-900">{user.email}</span>
  </TableCell>
);

interface PhoneCellProps {
  user: User;
}

export const PhoneCell: React.FC<PhoneCellProps> = ({ user }) => {
  const userPhone = getUserPhone(user);
  const countryFlag = getCountryFlag(user);

  return (
    <TableCell className="px-2">
      <div className="flex items-center text-sm text-gray-600">
        {userPhone !== '—' && <span className="mr-1">{countryFlag}</span>}
        {userPhone}
      </div>
    </TableCell>
  );
};

interface StatusCellProps {
  user: User;
}

export const StatusCell: React.FC<StatusCellProps> = ({ user }) => (
  <TableCell className="px-2 text-center">
    <StatusBadge user={user} />
  </TableCell>
);

interface RoleCellProps {
  user: User;
}

export const RoleCell: React.FC<RoleCellProps> = ({ user }) => (
  <TableCell className="px-2 text-center">
    <RoleBadge user={user} />
  </TableCell>
);

interface SubscriptionCellProps {
  user: User;
}

export const SubscriptionCell: React.FC<SubscriptionCellProps> = ({ user }) => (
  <TableCell className="px-2 text-center">
    <SubscriptionBadge user={user} />
  </TableCell>
);

interface DateCellProps {
  dateString: string | null | undefined;
  fallbackKey: string;
}

export const DateCell: React.FC<DateCellProps> = ({ dateString, fallbackKey }) => {
  const { translate } = useTranslatedContent();
  
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return translate(fallbackKey);
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (error) {
      return translate('admin.status.invalidDate');
    }
  };

  return (
    <TableCell className="px-2 text-sm text-gray-600">
      {formatDate(dateString)}
    </TableCell>
  );
};
