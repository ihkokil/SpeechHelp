
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Calendar, AlertTriangle, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format, addMonths, addYears } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';

const paymentMethodSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits").max(19, "Card number is too long"),
  cardHolder: z.string().min(2, "Card holder name is required"),
  expiryMonth: z.string().min(1, "Expiry month is required").max(2, "Invalid month"),
  expiryYear: z.string().min(2, "Expiry year is required").max(4, "Invalid year"),
  cvv: z.string().min(3, "CVV must be at least 3 digits").max(4, "CVV is too long"),
});

const BillingSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [autoRenew, setAutoRenew] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  // Get account creation date from user metadata or use a default
  const accountCreatedAt = user ? new Date(user.created_at || Date.now()) : new Date();
  
  // Mocked subscription data - would come from your backend in a real app
  const [subscriptionData, setSubscriptionData] = useState({
    plan: 'Pro Plan',
    status: 'active',
    price: '$29.99',
    billingPeriod: 'monthly', // 'monthly' or 'yearly'
    startDate: accountCreatedAt,
    endDate: addMonths(accountCreatedAt, 1), // Default to monthly
    paymentMethod: {
      type: 'Credit Card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      brand: 'Visa'
    }
  });

  // State for storing payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    subscriptionData.paymentMethod
  ]);

  // Form for adding new payment method
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
    },
  });

  // Update end date when billing period changes
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
    toast({
      title: checked ? "Auto-renewal enabled" : "Auto-renewal disabled",
      description: checked 
        ? `Your subscription will automatically renew on ${format(subscriptionData.endDate, 'MMMM d, yyyy')}.` 
        : `Your subscription will be active until ${format(subscriptionData.endDate, 'MMMM d, yyyy')} and then expire.`,
    });
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      // In a real app, you would call your backend API to cancel the subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Just disable auto-renewal rather than immediate cancellation
      setAutoRenew(false);
      
      toast({
        title: "Auto-renewal disabled",
        description: `Your subscription will remain active until ${format(subscriptionData.endDate, 'MMMM d, yyyy')} and will not renew automatically.`,
      });
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Cancellation failed",
        description: "There was a problem cancelling your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // For demo purposes - allows switching between monthly and yearly billing
  const toggleBillingPeriod = () => {
    setSubscriptionData(prev => ({
      ...prev,
      billingPeriod: prev.billingPeriod === 'monthly' ? 'yearly' : 'monthly',
      price: prev.billingPeriod === 'monthly' ? '$299.99' : '$29.99',
    }));
  };

  const handleAddPaymentMethod = (data: z.infer<typeof paymentMethodSchema>) => {
    setIsProcessing(true);
    // In a real app, this would send payment details to your payment processor
    setTimeout(() => {
      // Process complete - add the new payment method
      const last4 = data.cardNumber.slice(-4);
      const newPaymentMethod = {
        type: 'Credit Card',
        last4,
        expiryMonth: parseInt(data.expiryMonth),
        expiryYear: parseInt(data.expiryYear),
        brand: determineCardBrand(data.cardNumber),
      };
      
      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      
      toast({
        title: "Payment method added",
        description: `Your ${newPaymentMethod.brand} card ending in ${last4} has been added.`,
      });
      
      setShowAddPaymentDialog(false);
      form.reset();
      setIsProcessing(false);
    }, 1500);
  };

  // Helper function to determine card brand based on first digits
  const determineCardBrand = (cardNumber: string) => {
    // Very simplified version - in production use a more robust solution
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'Amex';
    if (firstDigit === '6') return 'Discover';
    return 'Card';
  };

  // Function to format card number with spaces for display
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-pink-600" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription plan and billing cycle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{subscriptionData.plan}</h3>
                <p className="text-gray-500">{subscriptionData.price} per {subscriptionData.billingPeriod}</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {subscriptionData.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="border-t border-b py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Start Date</span>
                <span className="font-medium">{format(subscriptionData.startDate, 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Renewal Date</span>
                <span className="font-medium">{format(subscriptionData.endDate, 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Auto-Renewal</span>
                <Switch 
                  checked={autoRenew} 
                  onCheckedChange={handleAutoRenewToggle}
                  className="data-[state=checked]:bg-pink-600"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {/* For demo purposes - toggle between monthly and yearly */}
          <Button variant="outline" onClick={toggleBillingPeriod}>
            Switch to {subscriptionData.billingPeriod === 'monthly' ? 'Yearly' : 'Monthly'} Billing
          </Button>
          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Cancel Subscription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  Cancel Subscription
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to cancel your subscription? Your subscription will remain active until the end of your current billing period, but will not renew automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="my-4 p-4 bg-red-50 rounded-md text-red-800 text-sm">
                <p><strong>Your subscription will remain active until:</strong></p>
                <p className="font-medium">{format(subscriptionData.endDate, 'MMMM d, yyyy')}</p>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCancelDialog(false)}
                  disabled={isProcessing}
                >
                  Keep Subscription
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleCancelSubscription}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Cancel Subscription"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-pink-600" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center">
                  <div className="h-10 w-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold mr-3">
                    {method.brand === 'Visa' ? 'VISA' : method.brand}
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• {method.last4}</p>
                    <p className="text-sm text-gray-500">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {index === 0 && (
                    <Badge className="bg-pink-100 text-pink-800 border-pink-200 mr-2">Default</Badge>
                  )}
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Enter your card details below to add a new payment method.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddPaymentMethod)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cardHolder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cardholder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1234 5678 9012 3456" 
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s/g, '');
                              if (/^\d*$/.test(value) && value.length <= 16) {
                                e.target.value = formatCardNumber(value);
                                field.onChange(value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex space-x-4">
                    <div className="flex space-x-2 flex-1">
                      <FormField
                        control={form.control}
                        name="expiryMonth"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Expiry Month</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="MM" 
                                maxLength={2}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value) && parseInt(value || '0') <= 12) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="expiryYear"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Expiry Year</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="YY" 
                                maxLength={4}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123" 
                              maxLength={4}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setShowAddPaymentDialog(false)} disabled={isProcessing}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Add Payment Method"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BillingSettings;
