
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
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
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
      setIsAddDialogOpen(false);  // Close the dialog after successful submission
    }, 1500);
  };

  const handleUpdatePaymentMethod = (data: PaymentFormValues) => {
    if (selectedPaymentMethod === null) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const last4 = data.cardNumber.slice(-4);
      const updatedPaymentMethod: PaymentMethod = {
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
      
      onUpdatePaymentMethod(selectedPaymentMethod, updatedPaymentMethod);
      
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
      setIsUpdateDialogOpen(false);  // Close the dialog after successful submission
    }, 1500);
  };

  const handleDeletePaymentMethod = () => {
    if (selectedPaymentMethod === null) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      onDeletePaymentMethod(selectedPaymentMethod);
      
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);  // Close the dialog after successful deletion
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
    isUpdateDialogOpen,
    setIsUpdateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    isProcessing,
    handleAddPaymentMethod,
    handleUpdatePaymentMethod,
    handleDeletePaymentMethod,
    getSelectedPaymentMethod
  };
};
