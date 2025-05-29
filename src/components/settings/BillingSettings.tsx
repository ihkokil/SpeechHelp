import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, addMonths, addYears } from 'date-fns';
import SubscriptionCard from './billing/SubscriptionCard';
import PaymentMethodsCard from './billing/PaymentMethodsCard';
import { PaymentMethod } from './billing/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SubscriptionData {
  plan: string;
  status: string;
  price: string;
  billingPeriod: string;
  startDate: Date;
  endDate: Date;
  paymentMethod?: PaymentMethod;
}

interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: string;
  plan_type: string;
  billing_period: string;
  payment_date: string;
}

const BillingSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [autoRenew, setAutoRenew] = useState(true);
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  
  // Keep payment methods as local state for now
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

  // Fetch user's subscription data from the database
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile with subscription data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            title: "Error",
            description: "Failed to load subscription data.",
            variant: "destructive"
          });
          return;
        }

        // Fetch payment history
        const { data: payments, error: paymentsError } = await supabase
          .from('payment_history')
          .select('*')
          .eq('user_id', user.id)
          .order('payment_date', { ascending: false });

        if (paymentsError) {
          console.error('Error fetching payment history:', paymentsError);
        } else {
          setPaymentHistory(payments || []);
        }

        // Process subscription data
        if (profile) {
          const planName = profile.subscription_plan 
            ? profile.subscription_plan.charAt(0).toUpperCase() + profile.subscription_plan.slice(1) + ' Plan'
            : 'Free Trial';
          
          const startDate = profile.subscription_start_date 
            ? new Date(profile.subscription_start_date) 
            : new Date();
          
          const endDate = profile.subscription_end_date 
            ? new Date(profile.subscription_end_date)
            : addMonths(startDate, 1);

          // Calculate price based on subscription data
          let price = '$0.00';
          if (profile.subscription_amount) {
            price = `$${(profile.subscription_amount / 100).toFixed(2)}`;
          }

          setSubscriptionData({
            plan: planName,
            status: profile.subscription_status || 'inactive',
            price: price,
            billingPeriod: profile.subscription_period || 'monthly',
            startDate: startDate,
            endDate: endDate,
            paymentMethod: paymentMethods[0] // Use first payment method for now
          });
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        toast({
          title: "Error",
          description: "Failed to load billing information.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user, toast]);

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
    if (!subscriptionData) return;
    
    setSubscriptionData(prev => {
      if (!prev) return prev;
      
      const newPeriod = prev.billingPeriod === 'monthly' ? 'yearly' : 'monthly';
      const newPrice = newPeriod === 'yearly' ? '$299.99' : '$29.99';
      const newEndDate = newPeriod === 'yearly' 
        ? addYears(prev.startDate, 1) 
        : addMonths(prev.startDate, 1);
      
      return {
        ...prev,
        billingPeriod: newPeriod,
        price: newPrice,
        endDate: newEndDate
      };
    });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading billing information...</span>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium">No subscription found</h3>
          <p className="text-muted-foreground">You don't have an active subscription.</p>
        </div>
        
        <PaymentMethodsCard 
          paymentMethods={paymentMethods}
          onAddPaymentMethod={handleAddPaymentMethod}
          onUpdatePaymentMethod={handleUpdatePaymentMethod}
          onDeletePaymentMethod={handleDeletePaymentMethod}
        />
      </div>
    );
  }

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

      {/* Payment History Section */}
      {paymentHistory.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Payment History</h3>
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{payment.plan_type} Plan - {payment.billing_period}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(payment.amount / 100).toFixed(2)}</p>
                  <p className={`text-sm ${
                    payment.status === 'paid' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSettings;
