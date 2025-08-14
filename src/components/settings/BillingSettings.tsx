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
  stripe_session_id?: string;
}

// Helper function to capitalize subscription type names
const capitalizeSubscriptionType = (planType: string): string => {
  if (!planType) return '';
  
  // Handle specific cases
  const words = planType.toLowerCase().split('_').join(' ').split(' ');
  return words.map(word => {
    if (word === 'pro') return 'Pro';
    if (word === 'premium') return 'Premium';
    if (word === 'basic') return 'Basic';
    if (word === 'free') return 'Free';
    if (word === 'trial') return 'Trial';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

const BillingSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [autoRenew, setAutoRenew] = useState(true);
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);

  // Check for success parameter and show toast
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been successfully updated!",
      });
      // Clean up the URL
      window.history.replaceState({}, document.title, '/settings');
    }
  }, [toast]);

  // Fetch real payment methods from Stripe
  const fetchPaymentMethods = async () => {
    if (!user) return;

    try {
      setPaymentMethodsLoading(true);
      const { data, error } = await supabase.functions.invoke('get-payment-methods');

      if (error) {
        console.error('Error fetching payment methods:', error);
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
      console.log('Refreshing subscription data for user:', user.id);
      
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

      console.log('Updated profile data:', profile);

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

        // Show success toast if subscription is now active
        if (profile.subscription_status === 'active') {
          toast({
            title: "Subscription Active",
            description: `Your ${planName} is now active and ready to use!`,
          });
        }
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
        console.log('Fetching subscription data for user:', user.id);
        
        // Fetch user profile with subscription data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Don't show error toast here, just log it
          console.log('Profile error, will try to show available data');
        }

        // Fetch payment history with improved duplicate removal
        const { data: payments, error: paymentsError } = await supabase
          .from('payment_history')
          .select('*')
          .eq('user_id', user.id)
          .order('payment_date', { ascending: false });

        if (paymentsError) {
          console.error('Error fetching payment history:', paymentsError);
        } else {
          console.log('Raw payment history:', payments);
          
          // Improved duplicate removal logic
          const uniquePayments = payments?.reduce((acc: PaymentHistory[], payment) => {
            // Check if we already have a payment with the same session ID
            const existingPayment = acc.find(p => 
              p.stripe_session_id && payment.stripe_session_id && 
              p.stripe_session_id === payment.stripe_session_id
            );
            
            if (existingPayment) {
              // If we found a duplicate, keep the one with the correct billing period
              // based on the amount (yearly should be higher)
              if (payment.amount > existingPayment.amount) {
                // Replace with the higher amount (likely the correct yearly payment)
                const index = acc.findIndex(p => p.stripe_session_id === payment.stripe_session_id);
                acc[index] = payment;
              }
              // Otherwise keep the existing one
            } else {
              // No duplicate found, add this payment
              acc.push(payment);
            }
            
            return acc;
          }, []) || [];
          
          console.log('Filtered payment history:', uniquePayments);
          setPaymentHistory(uniquePayments);
        }

        // Fetch real payment methods
        await fetchPaymentMethods();

        // Process subscription data - be more lenient with what we consider a subscription
        if (profile) {
          console.log('Raw profile data:', profile);
          
          // Determine if user has any subscription data at all
          const hasSubscriptionData = profile.subscription_plan && 
            profile.subscription_plan !== 'free_trial' && 
            profile.subscription_plan !== 'free';
          
          // Check if subscription is active based on various factors
          const isActiveSubscription = profile.subscription_status === 'active' || 
            (profile.subscription_end_date && new Date(profile.subscription_end_date) > new Date()) ||
            (profile.stripe_subscription_id && profile.stripe_subscription_id !== null);
          
          console.log('Subscription analysis:', {
            hasSubscriptionData,
            isActiveSubscription,
            subscription_status: profile.subscription_status,
            subscription_plan: profile.subscription_plan,
            subscription_end_date: profile.subscription_end_date,
            stripe_subscription_id: profile.stripe_subscription_id
          });
          
          if (hasSubscriptionData || isActiveSubscription) {
            const planName = profile.subscription_plan 
              ? capitalizeSubscriptionType(profile.subscription_plan) + ' Plan'
              : 'Premium Plan';
            
            // Use the actual dates from the database
            const startDate = profile.subscription_start_date 
              ? new Date(profile.subscription_start_date) 
              : new Date();
            
            const endDate = profile.subscription_end_date 
              ? new Date(profile.subscription_end_date)
              : addMonths(startDate, 1);

            // Calculate price based on subscription data
            let price = '$0.00';
            if (profile.subscription_amount && profile.subscription_amount > 0) {
              price = `$${(profile.subscription_amount / 100).toFixed(2)}`;
            } else if (profile.subscription_plan === 'premium') {
              price = '$29.99'; // Default premium price
            } else if (profile.subscription_plan === 'pro') {
              price = '$49.99'; // Default pro price
            }

            console.log('Processed subscription data:', {
              plan: planName,
              status: profile.subscription_status || 'active',
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              price: price
            });

            setSubscriptionData({
              plan: planName,
              status: profile.subscription_status || 'active',
              price: price,
              billingPeriod: profile.subscription_period || 'monthly',
              startDate: startDate,
              endDate: endDate,
              paymentMethod: undefined // Will be set when payment methods load
            });
          } else {
            console.log('No subscription data found, showing no subscription state');
            setSubscriptionData(null);
          }
        } else {
          console.log('No profile found, showing no subscription state');
          setSubscriptionData(null);
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        // Don't show error toast, just log it
        console.log('Will show no subscription state due to error');
        setSubscriptionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  // Update subscription data when payment methods change
  useEffect(() => {
    if (subscriptionData && paymentMethods.length > 0) {
      setSubscriptionData(prev => prev ? {
        ...prev,
        paymentMethod: paymentMethods[0]
      } : null);
    }
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
          <p className="text-sm text-muted-foreground mt-2">
            If you believe this is an error, please contact support or try refreshing the page.
          </p>
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
                  <p className="font-medium">
                    {capitalizeSubscriptionType(payment.plan_type)} Plan - {capitalizeSubscriptionType(payment.billing_period)}
                  </p>
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
