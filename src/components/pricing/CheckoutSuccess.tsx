
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { verifyCheckoutSession } from '@/services/stripe';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function CheckoutSuccess() {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const processCheckout = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (!sessionId) {
        toast({
          title: "Checkout Error",
          description: "No session information found.",
          variant: "destructive",
        });
        navigate('/pricing');
        return;
      }

      try {
        setVerifying(true);
        const result = await verifyCheckoutSession(sessionId);
        
        if (result.success) {
          setSuccess(true);
          toast({
            title: "Subscription Activated",
            description: "Thank you! Your subscription has been activated successfully.",
          });
          
          // Refresh user data to get updated subscription info
          await refreshUserData();
        } else {
          toast({
            title: "Payment Incomplete",
            description: `Your payment is ${result.paymentStatus}. Please try again or contact support.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error verifying checkout:', error);
        toast({
          title: "Verification Error",
          description: "There was a problem verifying your subscription. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    };

    processCheckout();
  }, [location.search]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      {verifying ? (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-purple-600 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Verifying your subscription...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      ) : success ? (
        <div className="text-center max-w-md">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-xl mb-6">Your subscription has been activated successfully.</p>
          <div className="space-y-4">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 w-full" 
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/account')}
            >
              View Subscription Details
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Subscription Error</h2>
          <p className="mb-6">We couldn't verify your subscription. Please try again or contact our support team.</p>
          <div className="space-y-4">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate('/pricing')}
            >
              Return to Pricing
            </Button>
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600" 
              onClick={() => window.location.href = 'mailto:support@speechhelper.ai'}
            >
              Contact Support
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutSuccess;
