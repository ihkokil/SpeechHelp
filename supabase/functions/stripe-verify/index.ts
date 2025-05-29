
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@13.2.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8?target=deno';

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

		// Initialize Supabase client with service role key for database updates
		const supabase = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
		);

		// Retrieve checkout session
		try {
			log(`Retrieving checkout session with ID: ${sessionId}`);
			const session = await stripe.checkout.sessions.retrieve(sessionId);
			log('Checkout session retrieved:', { id: session.id, status: session.status, paymentStatus: session.payment_status });

			// Check if payment was successful
			if (session.payment_status === 'paid' && session.status === 'complete') {
				// Extract user ID from the session
				const userId = session.client_reference_id;
				const pricingPeriod = session.metadata?.pricingPeriod || 'monthly';
				const subscriptionId = session.subscription as string;
				const planType = session.metadata?.plan || 'premium';

				log('Payment successful', { userId, pricingPeriod, subscriptionId, planType });

				if (!userId) {
					log('Warning: No userId found in session client_reference_id');
					return new Response(
						JSON.stringify({
							success: false,
							error: 'No user ID found in session'
						}),
						{
							status: 400,
							headers: { ...corsHeaders, 'Content-Type': 'application/json' },
						}
					);
				}

				// Get subscription details to extract amount, price ID, and proper dates
				let amount = 0;
				let priceId = '';
				let subscriptionStatus = 'active';
				let subscriptionStartDate = new Date().toISOString();
				let subscriptionEndDate = new Date().toISOString();
				
				if (subscriptionId) {
					try {
						const subscription = await stripe.subscriptions.retrieve(subscriptionId);
						const lineItem = subscription.items.data[0];
						if (lineItem) {
							amount = lineItem.price.unit_amount || 0;
							priceId = lineItem.price.id;
						}
						
						// Use actual subscription dates from Stripe
						subscriptionStartDate = new Date(subscription.current_period_start * 1000).toISOString();
						subscriptionEndDate = new Date(subscription.current_period_end * 1000).toISOString();
						
						log('Subscription details:', { 
							amount, 
							priceId, 
							status: subscriptionStatus,
							startDate: subscriptionStartDate,
							endDate: subscriptionEndDate
						});
					} catch (subError) {
						log('Error retrieving subscription details:', subError);
						// Continue with defaults if subscription retrieval fails
					}
				}

				// First, check if the user exists in profiles
				const { data: existingProfile, error: profileCheckError } = await supabase
					.from('profiles')
					.select('id')
					.eq('id', userId)
					.single();

				if (profileCheckError && profileCheckError.code !== 'PGRST116') {
					log('Error checking existing profile:', profileCheckError);
				}

				// Update user's subscription directly using the service role
				log(`Updating user ${userId} subscription data directly`);
				
				const profileUpdateData = {
					subscription_plan: planType,
					subscription_status: 'active',
					subscription_period: pricingPeriod,
					subscription_start_date: subscriptionStartDate,
					subscription_end_date: subscriptionEndDate,
					subscription_price_id: priceId,
					subscription_amount: amount,
					stripe_customer_id: session.customer as string,
					stripe_subscription_id: subscriptionId,
					updated_at: new Date().toISOString(),
				};

				let profileError;
				
				if (existingProfile) {
					// Update existing profile
					const { error } = await supabase
						.from('profiles')
						.update(profileUpdateData)
						.eq('id', userId);
					profileError = error;
				} else {
					// Insert new profile
					const { error } = await supabase
						.from('profiles')
						.insert({
							id: userId,
							...profileUpdateData
						});
					profileError = error;
				}

				if (profileError) {
					log('Error updating/inserting profile:', profileError);
					return new Response(
						JSON.stringify({
							success: false,
							error: 'Failed to update user profile',
							details: profileError.message
						}),
						{
							status: 500,
							headers: { ...corsHeaders, 'Content-Type': 'application/json' },
						}
					);
				} else {
					log('Successfully updated/inserted profile with ACTIVE status and correct dates');
				}

				// Store payment history
				try {
					const { error: paymentError } = await supabase
						.from('payment_history')
						.insert({
							user_id: userId,
							stripe_session_id: session.id,
							amount: amount,
							currency: 'usd',
							status: 'paid',
							plan_type: planType,
							billing_period: pricingPeriod,
							payment_date: subscriptionStartDate
						});

					if (paymentError) {
						log('Error storing payment history:', paymentError);
					} else {
						log('Successfully stored payment history');
					}
				} catch (paymentHistoryError) {
					log('Error inserting payment history:', paymentHistoryError);
				}

				// Update auth.users metadata to trigger auth context refresh
				try {
					const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
						userId,
						{
							user_metadata: {
								subscription_plan: planType,
								subscription_status: 'active',
								subscription_start_date: subscriptionStartDate,
								subscription_end_date: subscriptionEndDate,
							}
						}
					);

					if (authUpdateError) {
						log('Error updating auth metadata:', authUpdateError);
					} else {
						log('Successfully updated auth metadata');
					}
				} catch (authError) {
					log('Error in auth update:', authError);
				}

				log(`Successfully processed subscription for user ${userId} with plan ${planType} and ACTIVE status`);

				return new Response(
					JSON.stringify({
						success: true,
						userId,
						planType,
						pricingPeriod,
						subscriptionId,
						paymentStatus: session.payment_status,
						customerEmail: session.customer_details?.email,
						subscriptionStartDate,
						subscriptionEndDate,
						// Add a timestamp to force refresh
						timestamp: new Date().toISOString()
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
						paymentStatus: session.payment_status,
						message: 'Payment not completed or still processing'
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
