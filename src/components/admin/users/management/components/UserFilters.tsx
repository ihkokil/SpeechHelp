
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

interface UserFiltersProps {
  selectedStatus: string;
  selectedRole: string;
  selectedPlan: string;
  onStatusChange: (status: string) => void;
  onRoleChange: (role: string) => void;
  onPlanChange: (plan: string) => void;
  onClearFilters: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  selectedStatus,
  selectedRole,
  selectedPlan,
  onStatusChange,
  onRoleChange,
  onPlanChange,
  onClearFilters,
}) => {
  const { translate } = useTranslatedContent();

  const statusOptions = [
    { value: 'active', label: translate('admin.status.active') },
    { value: 'inactive', label: translate('admin.status.inactive') },
  ];

  const roleOptions = [
    { value: 'admin', label: translate('admin.role.admin') },
    { value: 'user', label: translate('admin.role.user') },
  ];

  const planOptions = [
    { value: 'free_trial', label: translate('admin.plan.freeTrial') },
    { value: 'premium', label: translate('admin.plan.premium') },
    { value: 'pro', label: translate('admin.plan.pro') },
  ];

  const hasActiveFilters = selectedStatus !== 'all' || selectedRole !== 'all' || selectedPlan !== 'all';

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[150px]">
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder={translate('admin.filters.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translate('admin.filters.allStatus')}</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <Select value={selectedRole} onValueChange={onRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder={translate('admin.filters.filterByRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translate('admin.filters.allRoles')}</SelectItem>
                {roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <Select value={selectedPlan} onValueChange={onPlanChange}>
              <SelectTrigger>
                <SelectValue placeholder={translate('admin.filters.filterByPlan')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translate('admin.filters.allPlans')}</SelectItem>
                {planOptions.map((plan) => (
                  <SelectItem key={plan.value} value={plan.value}>
                    {plan.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              {translate('admin.filters.clearFilters')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilters;
