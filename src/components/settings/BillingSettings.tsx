
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format, addMonths, addYears } from 'date-fns';
import SubscriptionCard from './billing/SubscriptionCard';
import PaymentMethodsCard from './billing/PaymentMethodsCard';
import { PaymentMethod } from './billing/types';
import { useToast } from '@/hooks/use-toast';

const BillingSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [autoRenew, setAutoRenew] = useState(true);
  
  const accountCreatedAt = user ? new Date(user.created_at || Date.now()) : new Date();
  
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
  
  const [subscriptionData, setSubscriptionData] = useState({
    plan: 'Pro Plan',
    status: 'active',
    price: '$29.99',
    billingPeriod: 'monthly',
    startDate: accountCreatedAt,
    endDate: addMonths(accountCreatedAt, 1),
    paymentMethod: {
      type: 'Credit Card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      brand: 'Visa',
      isDefault: true
    }
  });

  useEffect(() => {
    if (subscriptionData.billingPeriod === 'monthly') {
      setSubscriptionData(prev => ({
        ...prev,
        endDate: addMonths(prev.startDate, 1)
      }));
    } else {
      setSubscriptionData(prev => ({
        ...prev,
        endDate: addYears(prev.startDate, 1)
      }));
    }
  }, [subscriptionData.billingPeriod, subscriptionData.startDate]);

  // Load payment methods from localStorage when component mounts
  useEffect(() => {
    const savedPaymentMethods = localStorage.getItem('paymentMethods');
    if (savedPaymentMethods) {
      try {
        const parsed = JSON.parse(savedPaymentMethods);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPaymentMethods(parsed);
        }
      } catch (error) {
        console.error('Error parsing payment methods from localStorage:', error);
      }
    }
  }, []);

  // Save payment methods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  const handleAutoRenewToggle = (checked: boolean) => {
    setAutoRenew(checked);
  };

  const toggleBillingPeriod = () => {
    setSubscriptionData(prev => ({
      ...prev,
      billingPeriod: prev.billingPeriod === 'monthly' ? 'yearly' : 'monthly',
      price: prev.billingPeriod === 'monthly' ? '$299.99' : '$29.99',
    }));
  };

  const handleAddPaymentMethod = (newPaymentMethod: PaymentMethod) => {
    // If it's default, update all other cards to not be default
    let updatedMethods = [...paymentMethods];
    if (newPaymentMethod.isDefault) {
      updatedMethods = updatedMethods.map(method => ({...method, isDefault: false}));
    }
    
    // Add the new payment method to the collection
    const updatedPaymentMethods = [...updatedMethods, newPaymentMethod];
    setPaymentMethods(updatedPaymentMethods);
    
    // Save to localStorage immediately
    localStorage.setItem('paymentMethods', JSON.stringify(updatedPaymentMethods));
    
    toast({
      title: "Payment method added",
      description: `Your ${newPaymentMethod.brand} card ending in ${newPaymentMethod.last4} has been saved.`,
    });
  };

  const handleUpdatePaymentMethod = (index: number, updatedMethod: PaymentMethod) => {
    let updatedMethods = [...paymentMethods];
    
    // If setting this card as default, update all others to not be default
    if (updatedMethod.isDefault) {
      updatedMethods = updatedMethods.map(method => ({...method, isDefault: false}));
    }
    
    // Update the selected payment method with new data
    updatedMethods[index] = updatedMethod;
    
    setPaymentMethods(updatedMethods);
    
    // Save to localStorage immediately
    localStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
    
    toast({
      title: "Payment method updated",
      description: `Your ${updatedMethod.brand} card ending in ${updatedMethod.last4} has been updated.`,
    });
  };

  const handleDeletePaymentMethod = (index: number) => {
    const deletedMethod = paymentMethods[index];
    const newMethods = paymentMethods.filter((_, i) => i !== index);
    
    // If we deleted the default method and there are other methods, make the first one default
    if (deletedMethod.isDefault && newMethods.length > 0) {
      newMethods[0].isDefault = true;
    }
    
    setPaymentMethods(newMethods);
    
    // Save to localStorage immediately
    localStorage.setItem('paymentMethods', JSON.stringify(newMethods));
    
    toast({
      title: "Payment method removed",
      description: `Your ${deletedMethod.brand} card ending in ${deletedMethod.last4} has been removed.`,
    });
  };

  return (
    <div className="space-y-6">
      <SubscriptionCard 
        subscriptionData={subscriptionData}
        autoRenew={autoRenew}
        onAutoRenewToggle={handleAutoRenewToggle}
        onToggleBillingPeriod={toggleBillingPeriod}
      />
      
      <PaymentMethodsCard 
        paymentMethods={paymentMethods}
        onAddPaymentMethod={handleAddPaymentMethod}
        onUpdatePaymentMethod={handleUpdatePaymentMethod}
        onDeletePaymentMethod={handleDeletePaymentMethod}
      />
    </div>
  );
};

export default BillingSettings;
