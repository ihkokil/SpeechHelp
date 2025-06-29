
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

export const LoadingState: React.FC = () => {
  const { translate } = useTranslatedContent();
  
  return (
    <TableRow>
      <TableCell colSpan={9} className="h-24 text-center">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {translate('admin.table.loading')}
        </div>
      </TableCell>
    </TableRow>
  );
};

export const EmptyState: React.FC = () => {
  const { translate } = useTranslatedContent();
  
  return (
    <TableRow>
      <TableCell colSpan={9} className="h-24 text-center">
        <div className="text-sm text-muted-foreground">
          {translate('admin.table.noUsers')}
        </div>
      </TableCell>
    </TableRow>
  );
};
