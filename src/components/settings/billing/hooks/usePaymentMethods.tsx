
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod, PaymentFormValues } from '../types';
import { determineCardBrand } from '../utils/paymentMethodUtils';

export const usePaymentMethods = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      type: 'Credit Card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      brand: 'Visa',
      isDefault: true,
      cardHolder: 'John Doe',
      billingAddress: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States'
      }
    }
  ]);

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
      
      // If it's default, update all other cards to not be default
      let updatedMethods = [...paymentMethods];
      if (data.isDefault) {
        updatedMethods = updatedMethods.map(method => ({...method, isDefault: false}));
      }
      
      // Add the new payment method to the collection
      setPaymentMethods([...updatedMethods, newPaymentMethod]);
      
      toast({
        title: "Payment method added",
        description: `Your ${newPaymentMethod.brand} card ending in ${last4} has been added.`,
      });
      
      setIsProcessing(false);
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
      
      let updatedMethods = [...paymentMethods];
      
      // If setting this card as default, update all others to not be default
      if (data.isDefault) {
        updatedMethods = updatedMethods.map(method => ({...method, isDefault: false}));
      }
      
      // Update the selected payment method with new data
      updatedMethods[selectedPaymentMethod] = updatedPaymentMethod;
      
      setPaymentMethods(updatedMethods);
      
      toast({
        title: "Payment method updated",
        description: `Your ${updatedPaymentMethod.brand} card ending in ${last4} has been updated.${data.isDefault ? ' It is now your default payment method.' : ''}`,
      });
      
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
    }, 1500);
  };

  const handleDeletePaymentMethod = () => {
    if (selectedPaymentMethod === null) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const deletedMethod = paymentMethods[selectedPaymentMethod];
      
      setPaymentMethods(prev => prev.filter((_, index) => index !== selectedPaymentMethod));
      
      toast({
        title: "Payment method deleted",
        description: `Your ${deletedMethod.brand} card ending in ${deletedMethod.last4} has been removed.`,
      });
      
      setSelectedPaymentMethod(null);
      setIsProcessing(false);
    }, 1000);
  };

  return {
    paymentMethods,
    isProcessing,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    handleAddPaymentMethod,
    handleUpdatePaymentMethod,
    handleDeletePaymentMethod
  };
};
