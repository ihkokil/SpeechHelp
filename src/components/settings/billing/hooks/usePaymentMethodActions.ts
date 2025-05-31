
import { useState } from 'react';
import { PaymentMethod, PaymentFormValues } from '../types';
import { useToast } from '@/hooks/use-toast';
import { determineCardBrand } from '../utils/paymentMethodUtils';

interface PaymentMethodActionsProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (method: PaymentMethod) => void;
  onUpdatePaymentMethod: (index: number, method: PaymentMethod) => void;
  onDeletePaymentMethod: (index: number) => void;
}

export const usePaymentMethodActions = ({
  paymentMethods,
  onAddPaymentMethod,
  onUpdatePaymentMethod,
  onDeletePaymentMethod
}: PaymentMethodActionsProps) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddPaymentMethod = (data: PaymentFormValues) => {
    setIsProcessing(true);
    setTimeout(() => {
      const last4 = data.cardNumber.slice(-4);
      const newPaymentMethod: PaymentMethod = {
        type: data.cardType,
        last4,
        expiryMonth: parseInt(data.expiryMonth),
        expiryYear: parseInt(data.expiryYear),
        brand: data.cardType === 'Select card type' ? determineCardBrand(data.cardNumber) : data.cardType,
        isDefault: data.isDefault,
        cardHolder: data.cardHolder,
        billingAddress: {
          street: data.billingStreet,
          city: data.billingCity,
          state: data.billingState,
          zipCode: data.billingZip,
          country: data.billingCountry
        }
      };
      
      onAddPaymentMethod(newPaymentMethod);
      
      setIsProcessing(false);
      setIsAddDialogOpen(false);
    }, 1500);
  };

  const handleDeletePaymentMethod = () => {
    if (selectedPaymentMethod === null) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      onDeletePaymentMethod(selectedPaymentMethod);
      
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
    }, 1000);
  };

  // Get the currently selected payment method
  const getSelectedPaymentMethod = (): PaymentMethod | null => {
    if (selectedPaymentMethod === null) return null;
    return paymentMethods[selectedPaymentMethod];
  };

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    isProcessing,
    handleAddPaymentMethod,
    handleDeletePaymentMethod,
    getSelectedPaymentMethod
  };
};
