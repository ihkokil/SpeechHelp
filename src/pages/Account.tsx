
/* 
 This is the url that gets returned to after the user has completed the checkout process
 It will either redirect to the dashboard or the pricing page depending on the user's subscription status
 account?success=true&session_id=cs_test_b1KDw2VXeQoFYkOJ6mKBPV3cz46CBa8KowtLbfr7dmRcUdk2Pi8IzqtVk7
*/

import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const Account = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const searchParams = new URLSearchParams(window.location.search);
	const successParam = searchParams.get('success');
	const canceled = searchParams.get('canceled');
	const sessionId = searchParams.get('session_id');

	useEffect(() => {
		const verifyCheckout = async () => {
			if (successParam === 'true' && sessionId) {
				setIsLoading(true);
				setError(null);

				try {
					console.log('Starting payment verification for session:', sessionId);

					// Call the Supabase function to verify the checkout
					const { data, error } = await supabase.functions.invoke('stripe-verify', {
						body: { sessionId }
					});

					console.log('Verification response:', { data, error });

					if (error) {
						console.error('Verification error:', error);
						throw new Error(error.message);
					}

					if (data?.success) {
						// Checkout was successful and payment was completed
						console.log('Payment successful:', data);
						setSuccess(`Successfully activated your ${data.planType} subscription! Redirecting to settings...`);

						// Wait a moment to show success message, then redirect
						setTimeout(() => {
							navigate('/settings?success=true');
						}, 3000);
					} else {
						// Payment was initiated but not completed
						console.log('Payment not completed:', data);
						setError(data?.message || 'Your payment is being processed. Please check back later or contact support if this persists.');

						// Optional: You can redirect after a delay or provide a button to retry
						setTimeout(() => {
							navigate('/settings');
						}, 5000);
					}
				} catch (err) {
					console.error('Error verifying checkout:', err);
					setError('There was an error processing your payment. Please contact support if your card was charged.');
				} finally {
					setIsLoading(false);
				}
			} else if (canceled === 'true') {
				// User canceled the checkout
				console.log('Checkout was canceled');
				setError('Payment was canceled. You can try again from the pricing page.');
				setTimeout(() => {
					navigate('/pricing');
				}, 3000);
			} else {
				// No checkout parameters, redirect to pricing
				console.log('No checkout parameters found, redirecting to pricing');
				navigate('/pricing');
			}
		};

		verifyCheckout();
	}, [successParam, canceled, sessionId, navigate]);

	// Enhanced loading and error UI
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
				<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
					<RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
					<h1 className="text-xl font-bold mb-4 text-gray-800">Processing your payment...</h1>
					<p className="text-gray-600">Please wait while we verify your payment and activate your subscription.</p>
					<div className="mt-4 text-sm text-gray-500">
						This may take a few moments...
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
				<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
					<XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
					<h1 className="text-xl font-bold mb-4 text-gray-800">Payment Processing Issue</h1>
					<p className="text-red-600 mb-4">{error}</p>
					<div className="space-y-3">
						<button
							className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
							onClick={() => navigate('/settings')}
						>
							Go to Settings
						</button>
						<button
							className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
							onClick={() => navigate('/pricing')}
						>
							Back to Pricing
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (success) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
				<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
					<CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
					<h1 className="text-xl font-bold mb-4 text-gray-800">Payment Successful!</h1>
					<p className="text-green-600 mb-4">{success}</p>
					<div className="mt-4 text-sm text-gray-500">
						You will be redirected automatically...
					</div>
					<button
						className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
						onClick={() => navigate('/settings')}
					>
						Go to Settings Now
					</button>
				</div>
			</div>
		);
	}

	// This will only show briefly while the useEffect runs
	return (
		<div className="flex items-center justify-center min-h-screen">
			<p>Redirecting...</p>
		</div>
	);
};

export default Account;
