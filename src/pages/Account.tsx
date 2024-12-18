
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
	const navigate = useNavigate();
	const { refreshUserData, user, isLoading } = useAuth();
	const { toast } = useToast();
	const [isVerifying, setIsVerifying] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const searchParams = new URLSearchParams(window.location.search);
	const success = searchParams.get('success');
	const canceled = searchParams.get('canceled');
	const sessionId = searchParams.get('session_id');

	useEffect(() => {
		const verifyCheckout = async () => {
			console.log('Account page - verifyCheckout called', { success, canceled, sessionId });

			if (success === 'true' && sessionId) {
				setIsVerifying(true);
				setError(null);

				try {
					console.log('Starting payment verification for session:', sessionId);
					
					// Call the Supabase function to verify the checkout
					const { data, error } = await supabase.functions.invoke('stripe-verify', {
						body: { sessionId }
					});

					console.log('Stripe verify response:', { data, error });

					if (error) {
						console.error('Stripe verify error:', error);
						throw new Error(error.message || 'Payment verification failed');
					}

					if (data?.success) {
						// Checkout was successful and payment was completed
						console.log('Payment successful:', data);

						// Refresh user data to get updated subscription info
						await refreshUserData();

						// Show success toast
						toast({
							title: "Payment Successful!",
							description: `Your ${data.plan || 'subscription'} has been activated. Welcome aboard!`,
						});

						// Redirect to dashboard after a short delay
						setTimeout(() => {
							navigate('/dashboard');
						}, 2000);
					} else {
						// Payment was initiated but not completed
						console.log('Payment not completed:', data);
						setError('Your payment is being processed. Please check back later or contact support if you have concerns.');

						// Still try to refresh user data in case there was a delay
						setTimeout(async () => {
							await refreshUserData();
							navigate('/dashboard');
						}, 5000);
					}
				} catch (err) {
					console.error('Error verifying checkout:', err);
					const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
					setError(`There was an error processing your payment: ${errorMessage}. Please contact support if you believe this is a mistake.`);
					
					// Show error toast
					toast({
						title: "Payment Processing Error",
						description: "We encountered an issue verifying your payment. Please contact support.",
						variant: "destructive"
					});
				} finally {
					setIsVerifying(false);
				}
			} else if (canceled === 'true') {
				// User canceled the checkout
				console.log('Checkout was canceled');
				toast({
					title: "Payment Canceled",
					description: "Your payment was canceled. You can try again anytime.",
					variant: "destructive"
				});
				
				// Redirect to pricing page after a short delay
				setTimeout(() => {
					navigate('/pricing');
				}, 2000);
			} else {
				// No checkout parameters - only redirect after auth loading is complete
				if (!isLoading) {
					if (!user) {
						// If no user and no payment parameters, redirect to auth
						navigate('/auth');
					} else {
						// If user is logged in but no payment parameters, redirect to dashboard
						navigate('/dashboard');
					}
				}
			}
		};

		// Only run verification if we have the proper parameters or auth is not loading
		if (success || canceled || !isLoading) {
			verifyCheckout();
		}
	}, [success, canceled, sessionId, navigate, refreshUserData, toast, user, isLoading]);

	// Loading state UI
	if (isLoading || isVerifying) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
				<div className="max-w-md w-full text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
					<h1 className="text-2xl font-bold mb-4 text-gray-900">
						{isVerifying ? 'Processing your payment...' : 'Loading...'}
					</h1>
					<p className="text-gray-600">
						{isVerifying 
							? 'Please wait while we verify your payment and activate your subscription.'
							: 'Please wait while we load your account information.'
						}
					</p>
					{sessionId && (
						<div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
							<p className="text-sm text-gray-500">This may take a few moments. Please don't close this window.</p>
							<p className="text-xs text-gray-400 mt-2">Session ID: {sessionId}</p>
						</div>
					)}
				</div>
			</div>
		);
	}

	// Error state UI
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-50 to-pink-50">
				<div className="max-w-md w-full text-center">
					<div className="text-red-500 text-6xl mb-6">⚠️</div>
					<h1 className="text-2xl font-bold mb-4 text-gray-900">Payment Processing Issue</h1>
					<p className="text-red-600 mb-6 bg-red-50 p-4 rounded-lg border border-red-200">{error}</p>
					<div className="space-y-3">
						<button
							className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
							onClick={() => navigate('/dashboard')}
						>
							Go to Dashboard
						</button>
						<button
							className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
							onClick={() => navigate('/pricing')}
						>
							Back to Pricing
						</button>
						<button
							className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							onClick={() => window.location.reload()}
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	// This will only show briefly while the useEffect runs
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
			<div className="text-center">
				<div className="animate-pulse text-lg text-gray-600">Redirecting...</div>
			</div>
		</div>
	);
};

export default Account;
