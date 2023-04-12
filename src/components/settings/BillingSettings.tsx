
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Calendar, AlertTriangle } from 'lucide-react';
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
import { format } from 'date-fns';

const BillingSettings = () => {
  const { toast } = useToast();
  const [autoRenew, setAutoRenew] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mocked subscription data - would come from your backend in a real app
  const subscriptionData = {
    plan: 'Pro Plan',
    status: 'active',
    price: '$29.99',
    billingPeriod: 'monthly',
    startDate: new Date('2023-08-15'),
    endDate: new Date('2024-08-15'),
    paymentMethod: {
      type: 'Credit Card',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2026,
      brand: 'Visa'
    }
  };

  const handleAutoRenewToggle = (checked: boolean) => {
    setAutoRenew(checked);
    toast({
      title: checked ? "Auto-renewal enabled" : "Auto-renewal disabled",
      description: checked 
        ? "Your subscription will automatically renew when it expires." 
        : "Your subscription will not renew automatically.",
    });
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      // In a real app, you would call your backend API to cancel the subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully.",
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
          <Button variant="outline">Change Plan</Button>
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
                  Are you sure you want to cancel your subscription? You'll lose access to all premium features at the end of your current billing cycle.
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
            Payment Method
          </CardTitle>
          <CardDescription>
            Manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-md">
            <div className="flex items-center">
              <div className="h-10 w-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold mr-3">
                {subscriptionData.paymentMethod.brand === 'Visa' ? 'VISA' : subscriptionData.paymentMethod.brand}
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• {subscriptionData.paymentMethod.last4}</p>
                <p className="text-sm text-gray-500">
                  Expires {subscriptionData.paymentMethod.expiryMonth}/{subscriptionData.paymentMethod.expiryYear}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BillingSettings;
