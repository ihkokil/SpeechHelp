
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface StripeElementsPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setupIntent?: {
    id: string;
    clientSecret: string;
  };
  onSuccess: () => void;
}

const StripeElementsPaymentDialog = ({ 
  open, 
  onOpenChange, 
  setupIntent,
  onSuccess 
}: StripeElementsPaymentDialogProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCompleteSetup = async () => {
    if (!setupIntent) return;

    setIsProcessing(true);
    try {
      // In a real implementation, this would:
      // 1. Load Stripe.js
      // 2. Confirm the setup intent with card details from Stripe Elements
      // 3. Handle the result
      
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Setup Intent Created",
        description: "Payment method setup initiated. In a production app, this would be completed using Stripe Elements.",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: "Error",
        description: "Failed to complete payment method setup.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Payment Method Setup</DialogTitle>
          <DialogDescription>
            Your payment method setup has been initiated with Stripe.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Setup Intent ID: {setupIntent?.id}
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-muted-foreground">
            <p>In a production environment, this dialog would contain:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Stripe Elements for secure card input</li>
              <li>Real-time validation</li>
              <li>Secure tokenization</li>
              <li>Automatic completion of the Setup Intent</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCompleteSetup}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Complete Setup (Simulated)"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StripeElementsPaymentDialog;
