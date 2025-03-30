
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle } from 'lucide-react';
import { format, addMonths, addYears } from 'date-fns';
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

interface SubscriptionCardProps {
  subscriptionData: {
    plan: string;
    status: string;
    price: string;
    billingPeriod: string;
    startDate: Date;
    endDate: Date;
  };
  autoRenew: boolean;
  onAutoRenewToggle: (checked: boolean) => void;
  onToggleBillingPeriod: () => void;
}

const SubscriptionCard = ({ 
  subscriptionData, 
  autoRenew, 
  onAutoRenewToggle, 
  onToggleBillingPeriod 
}: SubscriptionCardProps) => {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onAutoRenewToggle(false);
      
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

  return (
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
                onCheckedChange={onAutoRenewToggle}
                className="data-[state=checked]:bg-pink-600"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onToggleBillingPeriod}>
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
  );
};

export default SubscriptionCard;
