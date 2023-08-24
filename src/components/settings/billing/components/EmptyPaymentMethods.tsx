
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

interface EmptyPaymentMethodsProps {
  onAddClick: () => void;
}

const EmptyPaymentMethods: React.FC<EmptyPaymentMethodsProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-8 border rounded-lg border-dashed">
      <CreditCard className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
      <h3 className="mt-4 text-lg font-semibold">No payment methods</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        You haven't added any payment methods yet.
      </p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onAddClick}
      >
        Add a payment method
      </Button>
    </div>
  );
};

export default EmptyPaymentMethods;
