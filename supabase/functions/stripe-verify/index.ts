import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@13.2.0?target=deno';

interface VerifyRequestBody {
	sessionId: string;
}

// Helper function to log with timestamps
const log = (message: string, data?: any) => {
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] ${message}`);
	if (data) {
		console.log(JSON.stringify(data, null, 2));
	}
};

serve(async (req) => {
	// Log incoming request
	log(`Received ${req.method} request to ${req.url}`);

	// Handle CORS preflight request
	if (req.method === 'OPTIONS') {
		log('Handling CORS preflight request');
		return new Response('ok', { headers: corsHeaders });
	}

	try {
		const requestBody = await req.json();
		log('Request body:', requestBody);

		const { sessionId } = requestBody as VerifyRequestBody;

		if (!sessionId) {
			log('Error: Missing required parameter: sessionId');
			return new Response(
				JSON.stringify({ error: 'Missing sessionId parameter' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Get Stripe API key from environment
		const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
		log('Stripe key exists:', !!stripeKey);

		if (!stripeKey) {
			log('ERROR: STRIPE_SECRET_KEY environment variable is not set');
			return new Response(
				JSON.stringify({ error: 'Stripe API key not configured' }),
				{
					status: 500,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Initialize Stripe
		log('Initializing Stripe client');
		const stripe = new Stripe(stripeKey, {
			apiVersion: '2023-10-16',
			httpClient: Stripe.createFetchHttpClient(),
		});

		// Retrieve checkout session
		try {
			log(`Retrieving checkout session with ID: ${sessionId}`);
			const session = await stripe.checkout.sessions.retrieve(sessionId);
			log('Checkout session retrieved:', { id: session.id, status: session.status });

			// Check if payment was successful
			if (session.payment_status === 'paid' && session.status === 'complete') {
				// Extract user ID from the session
				const userId = session.client_reference_id;
				const pricingPeriod = session.metadata?.pricingPeriod || 'monthly';
				const subscriptionId = session.subscription as string;

				log('Payment successful', { userId, pricingPeriod, subscriptionId });

				// Here you would typically update the user's subscription status in your database
				// For example, using the Supabase client to update a users table

				return new Response(
					JSON.stringify({
						success: true,
						userId,
						pricingPeriod,
						subscriptionId,
						paymentStatus: session.payment_status,
						customerEmail: session.customer_details?.email
					}),
					{
						status: 200,
						headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					}
				);
			} else {
				// Payment was not successful or is pending
				log('Payment not completed', {
					status: session.status,
					paymentStatus: session.payment_status
				});

				return new Response(
					JSON.stringify({
						success: false,
						status: session.status,
						paymentStatus: session.payment_status
					}),
					{
						status: 200,
						headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					}
				);
			}
		} catch (stripeError) {
			log('Stripe API error retrieving session:', stripeError);
			return new Response(
				JSON.stringify({
					error: 'Stripe API error',
					message: stripeError.message,
					type: stripeError.type,
					code: stripeError.code,
				}),
				{
					status: 500,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}
	} catch (error) {
		log('Unhandled error:', error);

		// Determine if it's a JSON parsing error
		let errorMessage = error.message;
		if (errorMessage.includes('JSON')) {
			errorMessage = 'Invalid JSON in request body';
		}

		return new Response(
			JSON.stringify({
				error: 'Server error',
				message: errorMessage,
				stack: Deno.env.get('NODE_ENV') === 'production' ? undefined : error.stack
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
}); 