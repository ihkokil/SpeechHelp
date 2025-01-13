
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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);

  // Fetch real payment methods from Stripe
  const fetchPaymentMethods = async () => {
    if (!user) return;

    try {
      setPaymentMethodsLoading(true);
      const { data, error } = await supabase.functions.invoke('get-payment-methods');

      if (error) {
        console.error('Error fetching payment methods:', error);
        // Fallback to empty array if there's an error
        setPaymentMethods([]);
      } else {
        setPaymentMethods(data?.paymentMethods || []);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setPaymentMethods([]);
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  // Force refresh subscription data from database
  const refreshSubscriptionData = async () => {
    if (!user) return;

    try {
      // Re-fetch user profile with latest subscription data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching updated profile:', profileError);
        return;
      }

      if (profile) {
        // Process updated subscription data
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
          paymentMethod: paymentMethods[0] // Use first real payment method if available
        });

        console.log('Updated subscription data:', {
          plan: planName,
          status: profile.subscription_status,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          amount: profile.subscription_amount
        });
      }
    } catch (error) {
      console.error('Error refreshing subscription data:', error);
    }
  };

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

        // Fetch real payment methods
        await fetchPaymentMethods();

        // Process subscription data
        if (profile) {
          console.log('Raw profile data:', profile);
          
          const planName = profile.subscription_plan 
            ? profile.subscription_plan.charAt(0).toUpperCase() + profile.subscription_plan.slice(1) + ' Plan'
            : 'Free Trial';
          
          // Use the actual dates from the database
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

          console.log('Processed subscription data:', {
            plan: planName,
            status: profile.subscription_status,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            price: price
          });

          setSubscriptionData({
            plan: planName,
            status: profile.subscription_status || 'inactive',
            price: price,
            billingPeriod: profile.subscription_period || 'monthly',
            startDate: startDate,
            endDate: endDate,
            paymentMethod: undefined // Will be set when payment methods load
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

  // Update subscription data when payment methods change
  useEffect(() => {
    if (subscriptionData && paymentMethods.length > 0) {
      setSubscriptionData(prev => prev ? {
        ...prev,
        paymentMethod: paymentMethods[0]
      } : null);
    }
  }, [paymentMethods]);

  // Listen for URL changes to refresh data (after successful checkout)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Delay to allow webhook to process
      setTimeout(() => {
        refreshSubscriptionData();
        fetchPaymentMethods();
      }, 2000);
    }
  }, []);

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
    // Add to local state immediately
    const updatedPaymentMethods = [...paymentMethods, newPaymentMethod];
    setPaymentMethods(updatedPaymentMethods);
    
    // Refresh payment methods from Stripe to get the real data
    setTimeout(() => {
      fetchPaymentMethods();
    }, 1000);
    
    toast({
      title: "Payment method added",
      description: `Your card ending in ${newPaymentMethod.last4} has been saved for automatic renewal.`,
    });
  };

  const handleUpdatePaymentMethod = (index: number, updatedMethod: PaymentMethod) => {
    let updatedMethods = [...paymentMethods];
    
    // Update the selected payment method with new data
    updatedMethods[index] = updatedMethod;
    
    setPaymentMethods(updatedMethods);
    
    // Don't show toast here since it's handled in the PaymentMethodsCard
  };

  const handleDeletePaymentMethod = (index: number) => {
    const deletedMethod = paymentMethods[index];
    const newMethods = paymentMethods.filter((_, i) => i !== index);
    
    // If we deleted the default method and there are other methods, make the first one default
    if (deletedMethod.isDefault && newMethods.length > 0) {
      newMethods[0].isDefault = true;
    }
    
    setPaymentMethods(newMethods);
    
    toast({
      title: "Payment method removed",
      description: `Your card ending in ${deletedMethod.last4} has been removed.`,
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
        onSubscriptionUpdate={refreshSubscriptionData}
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
