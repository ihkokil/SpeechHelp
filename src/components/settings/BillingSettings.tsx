
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format, addMonths, addYears } from 'date-fns';
import SubscriptionCard from './billing/SubscriptionCard';
import PaymentMethodsCard from './billing/PaymentMethodsCard';

const BillingSettings = () => {
  const { user } = useAuth();
  const [autoRenew, setAutoRenew] = useState(true);
  
  const accountCreatedAt = user ? new Date(user.created_at || Date.now()) : new Date();
  
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

  return (
    <div className="space-y-6">
      <SubscriptionCard 
        subscriptionData={subscriptionData}
        autoRenew={autoRenew}
        onAutoRenewToggle={handleAutoRenewToggle}
        onToggleBillingPeriod={toggleBillingPeriod}
      />
      
      <PaymentMethodsCard />
    </div>
  );
};

export default BillingSettings;
