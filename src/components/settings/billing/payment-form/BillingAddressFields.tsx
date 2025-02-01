
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PaymentFormValues } from './PaymentFormSchema';

interface BillingAddressFieldsProps {
  form: UseFormReturn<PaymentFormValues>;
}

const BillingAddressFields: React.FC<BillingAddressFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium border-t pt-6">Card Information</h3>
      <p className="text-sm text-gray-500">
        Please enter your card details to complete the payment.
      </p>
    </div>
  );
};

export default BillingAddressFields;
