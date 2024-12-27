/* 
 This is the url that gets returned to after the user has completed the checkout process
 It will either redirect to the dashboard or the pricing page depending on the user's subscription status
 account?success=true&session_id=cs_test_b1KDw2VXeQoFYkOJ6mKBPV3cz46CBa8KowtLbfr7dmRcUdk2Pi8IzqtVk7
*/

import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Account = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const searchParams = new URLSearchParams(window.location.search);
	const success = searchParams.get('success');
	const canceled = searchParams.get('canceled');
	const sessionId = searchParams.get('session_id');

	useEffect(() => {
		const verifyCheckout = async () => {
			if (success === 'true' && sessionId) {
				setIsLoading(true);
				setError(null);

				try {
					// Call the Supabase function to verify the checkout
					const { data, error } = await supabase.functions.invoke('stripe-verify', {
						body: { sessionId }
					});

					if (error) {
						throw new Error(error.message);
					}

					if (data?.success) {
						// Checkout was successful and payment was completed
						console.log('Payment successful:', data);

						// Here you might want to update local state or context
						// For example, dispatch to a user context to update subscription status

						// Redirect to dashboard
						navigate('/dashboard');
					} else {
						// Payment was initiated but not completed
						console.log('Payment not completed:', data);
						setError('Your payment is being processed. Please check back later.');

						// Optional: You can redirect after a delay or provide a button to retry
						setTimeout(() => {
							navigate('/dashboard');
						}, 5000);
					}
				} catch (err) {
					console.error('Error verifying checkout:', err);
					setError('There was an error processing your payment. Please contact support.');
				} finally {
					setIsLoading(false);
				}
			} else if (canceled === 'true') {
				// User canceled the checkout
				console.log('Checkout was canceled');
				navigate('/pricing');
			} else {
				// No checkout parameters, redirect to pricing
				navigate('/pricing');
			}
		};

		verifyCheckout();
	}, [success, canceled, sessionId, navigate]);

	// Simple loading and error UI
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-4">
				<h1 className="text-xl font-bold mb-4">Processing your payment...</h1>
				<p>Please wait while we verify your payment.</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-4">
				<h1 className="text-xl font-bold mb-4">Payment Processing</h1>
				<p className="text-red-500 mb-4">{error}</p>
				<button
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					onClick={() => navigate('/dashboard')}
				>
					Go to Dashboard
				</button>
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

