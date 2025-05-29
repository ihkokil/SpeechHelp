
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'https://esm.sh/stripe@13.2.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8?target=deno';

// Helper function to log with timestamps
const log = (message: string, data?: any) => {
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] ${message}`);
	if (data) {
		console.log(JSON.stringify(data, null, 2));
	}
};

// Log environment variables on startup
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

log('Environment check:', {
	supabaseUrlExists: !!supabaseUrl,
	supabaseServiceKeyExists: !!supabaseServiceKey,
	stripeSecretKeyExists: !!stripeSecretKey,
	stripeWebhookSecretExists: !!stripeWebhookSecret
});

if (!supabaseUrl) log('ERROR: SUPABASE_URL is not set');
if (!supabaseServiceKey) log('ERROR: SUPABASE_SERVICE_ROLE_KEY is not set');
if (!stripeSecretKey) log('ERROR: STRIPE_SECRET_KEY is not set');
if (!stripeWebhookSecret) log('ERROR: STRIPE_WEBHOOK_SECRET is not set');

// Initialize Stripe with minimal configuration
log('Initializing Stripe client');
const stripe = new Stripe(stripeSecretKey, {
	apiVersion: '2023-10-16',
});

// Initialize Supabase client with service role key
log('Initializing Supabase client');
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to determine plan type from price ID and amount
const determinePlanType = (priceId: string, amount: number, metadataPlan?: string): string => {
	log('Determining plan type:', { priceId, amount, metadataPlan });
	
	// First check metadata plan if provided
	if (metadataPlan) {
		log('Using metadata plan:', metadataPlan);
		return metadataPlan;
	}
	
	// Map based on specific price IDs
	const priceIdToPlan: Record<string, string> = {
		'price_1RAP4ARpjThCjn22l1gJgbj7': 'premium', // Premium monthly
		'price_1RAP4ARpjThCjn22ndn40xT2': 'premium', // Premium yearly
		'price_1RAP4ARpjThCjn220EX7m28A': 'pro',     // Pro monthly
		'price_1RAP4ARpjThCjn22OYzdydQi': 'pro',     // Pro yearly
	};
	
	if (priceIdToPlan[priceId]) {
		log('Plan determined by price ID:', priceIdToPlan[priceId]);
		return priceIdToPlan[priceId];
	}
	
	// Fallback to amount-based determination
	if (amount >= 4999) { // $49.99 or more = Pro
		log('Plan determined by amount (Pro):', amount);
		return 'pro';
	} else if (amount >= 2999) { // $29.99 or more = Premium
		log('Plan determined by amount (Premium):', amount);
		return 'premium';
	} else {
		log('Plan determined by amount (Free trial):', amount);
		return 'free_trial';
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
		// Get the signature from the headers
		const signature = req.headers.get('stripe-signature');
		if (!signature) {
			log('Error: Missing Stripe signature in headers');
			return new Response(
				JSON.stringify({ error: 'No Stripe signature found' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' }
				}
			);
		}

		// Get the raw body
		const body = await req.text();
		log('Received webhook payload (length):', body.length);

		// Verify the event with Stripe using constructEventAsync
		let event;
		try {
			log('Constructing Stripe event from webhook payload');
			event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
			log('Webhook event constructed successfully:', { type: event.type, id: event.id });
		} catch (err) {
			log('Error constructing webhook event:', err);
			return new Response(
				JSON.stringify({ error: `Webhook Error: ${err.message}` }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' }
				}
			);
		}

		// Handle specific events
		log(`Processing webhook event: ${event.type}`);
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object;
				log('Checkout session completed:', {
					sessionId: session.id,
					customerId: session.customer,
					clientReferenceId: session.client_reference_id,
					subscriptionId: session.subscription,
					metadata: session.metadata
				});

				// Extract customer details
				const userId = session.client_reference_id;
				const customerId = session.customer;
				const subscriptionId = session.subscription;
				const metadataPlan = session.metadata?.plan;
				const pricingPeriod = session.metadata?.pricingPeriod || 'monthly';

				if (!userId) {
					log('Warning: No userId (client_reference_id) found in session');
					break;
				}

				// Get subscription details to extract amount, price ID, and proper dates
				let amount = 0;
				let priceId = '';
				let subscriptionStatus = 'active';
				let subscriptionStartDate = new Date().toISOString();
				let subscriptionEndDate = new Date().toISOString();
				
				if (subscriptionId) {
					try {
						const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
						const lineItem = subscription.items.data[0];
						if (lineItem) {
							amount = lineItem.price.unit_amount || 0;
							priceId = lineItem.price.id;
						}
						subscriptionStatus = subscription.status;
						
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
					}
				}

				// Determine the correct plan type
				const actualPlanType = determinePlanType(priceId, amount, metadataPlan);
				log('Final determined plan type:', actualPlanType);

				// Update user's subscription using our database function
				log(`Updating user ${userId} subscription data using database function`);
				try {
					const { data: updateResult, error: updateError } = await supabase.rpc(
						'update_user_subscription_after_payment',
						{
							user_id_param: userId,
							plan_type_param: actualPlanType,
							billing_period_param: pricingPeriod,
							stripe_customer_id_param: customerId as string,
							stripe_subscription_id_param: subscriptionId as string,
							amount_param: amount,
							price_id_param: priceId
						}
					);

					if (updateError) {
						log('Error updating user subscription via function:', updateError);
					} else {
						log('Successfully updated subscription via function:', updateResult);
					}
				} catch (funcError) {
					log('Error calling update function:', funcError);
				}

				// Also directly update the profile with correct dates and status
				try {
					const { error: profileError } = await supabase
						.from('profiles')
						.update({
							subscription_plan: actualPlanType,
							subscription_status: 'active', // Ensure status is set to active
							subscription_period: pricingPeriod,
							subscription_start_date: subscriptionStartDate,
							subscription_end_date: subscriptionEndDate,
							subscription_price_id: priceId,
							subscription_amount: amount,
							stripe_customer_id: customerId as string,
							stripe_subscription_id: subscriptionId as string,
							updated_at: new Date().toISOString(),
						})
						.eq('id', userId);

					if (profileError) {
						log('Error updating profile directly:', profileError);
					} else {
						log('Successfully updated profile directly with correct plan type, dates and status');
					}
				} catch (profileUpdateError) {
					log('Error in direct profile update:', profileUpdateError);
				}

				// Store payment history with correct data
				try {
					const { error: paymentError } = await supabase
						.from('payment_history')
						.insert({
							user_id: userId,
							stripe_session_id: session.id,
							amount: amount,
							currency: 'usd',
							status: 'paid',
							plan_type: actualPlanType,
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

				log(`Successfully processed subscription for user ${userId} with plan ${actualPlanType}`);
				break;
			}

			case 'customer.subscription.updated': {
				const subscription = event.data.object;
				log('Subscription updated:', {
					subscriptionId: subscription.id,
					customerId: subscription.customer,
					status: subscription.status
				});

				// Find user by Stripe customer ID and update subscription status
				const { data: profiles, error: profileError } = await supabase
					.from('profiles')
					.select('id')
					.eq('stripe_customer_id', subscription.customer);

				if (profileError || !profiles || profiles.length === 0) {
					log('No user found with customer ID:', subscription.customer);
					break;
				}

				const subscriptionStartDate = new Date(subscription.current_period_start * 1000).toISOString();
				const subscriptionEndDate = new Date(subscription.current_period_end * 1000).toISOString();

				// Determine plan type from subscription data
				let planType = 'premium'; // default
				let amount = 0;
				if (subscription.items && subscription.items.data.length > 0) {
					const lineItem = subscription.items.data[0];
					amount = lineItem.price.unit_amount || 0;
					planType = determinePlanType(lineItem.price.id, amount);
				}

				const { error: updateError } = await supabase
					.from('profiles')
					.update({
						subscription_status: subscription.status,
						subscription_plan: planType,
						subscription_amount: amount,
						subscription_start_date: subscriptionStartDate,
						subscription_end_date: subscriptionEndDate,
						updated_at: new Date().toISOString(),
					})
					.eq('id', profiles[0].id);

				if (updateError) {
					log('Error updating subscription status:', updateError);
				} else {
					log(`Successfully updated subscription status and plan for user ${profiles[0].id}`);
				}
				break;
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object;
				log('Subscription deleted:', {
					subscriptionId: subscription.id,
					customerId: subscription.customer
				});

				// Find user by Stripe customer ID and cancel subscription
				const { data: profiles, error: profileError } = await supabase
					.from('profiles')
					.select('id')
					.eq('stripe_customer_id', subscription.customer);

				if (profileError || !profiles || profiles.length === 0) {
					log('No user found with customer ID:', subscription.customer);
					break;
				}

				const { error: updateError } = await supabase
					.from('profiles')
					.update({
						subscription_status: 'canceled',
						subscription_end_date: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					})
					.eq('id', profiles[0].id);

				if (updateError) {
					log('Error canceling subscription:', updateError);
				} else {
					log(`Successfully canceled subscription for user ${profiles[0].id}`);
				}
				break;
			}

			default: {
				log(`Unhandled webhook event type: ${event.type}`);
			}
		}

		log('Webhook processing complete');
		return new Response(
			JSON.stringify({ received: true }),
			{
				status: 200,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		log('Unhandled error in webhook processing:', error);
		return new Response(
			JSON.stringify({
				error: 'Server error',
				message: error.message,
				stack: Deno.env.get('NODE_ENV') === 'production' ? undefined : error.stack
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' }
			}
		);
	}
});
