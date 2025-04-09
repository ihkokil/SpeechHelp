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

serve(async (req) => {
	// Log incoming request
	log(`Received ${req.method} request to ${req.url}`);

	// Handle CORS preflight request
	if (req.method === 'OPTIONS') {
		log('Handling CORS preflight request');
		return new Response('ok', { headers: corsHeaders });
	}

	try {
		// Log request headers for debugging
		log('Request headers:', Object.fromEntries(req.headers.entries()));

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

				if (!userId) {
					log('Warning: No userId (client_reference_id) found in session');
				}

				if (userId) {
					// Update user's subscription in the database
					log(`Updating user ${userId} subscription data in profiles table`);

					const updateData = {
						stripe_customer_id: customerId,
						stripe_subscription_id: subscriptionId,
						subscription_plan: session.metadata?.plan || null,
						subscription_start_date: session.created,
						subscription_end_date: session.current_period_end,
						is_active: true,
					};

					log('Update data:', updateData);

					const { error } = await supabase
						.from('profiles')
						.update(updateData)
						.eq('id', userId);

					if (error) {
						log('Error updating user subscription:', error);
						return new Response(
							JSON.stringify({ error: 'Error updating user subscription', details: error }),
							{
								status: 500,
								headers: { ...corsHeaders, 'Content-Type': 'application/json' }
							}
						);
					}

					log(`Successfully updated subscription for user ${userId}`);
				}
				break;
			}

			case 'customer.subscription.updated': {
				const subscription = event.data.object;
				log('Subscription updated:', {
					subscriptionId: subscription.id,
					customerId: subscription.customer,
					status: subscription.status
				});

				// Get the customer ID from the subscription
				const customerId = subscription.customer;

				// Update the subscription status
				log(`Finding user with Stripe customer ID: ${customerId}`);
				const { data: users, error } = await supabase
					.from('profiles')
					.select('id, subscription_status')
					.eq('stripe_customer_id', customerId);

				if (error) {
					log('Error finding user by customer ID:', error);
					break;
				}

				if (!users || users.length === 0) {
					log(`No user found with Stripe customer ID: ${customerId}`);
					break;
				}

				const userId = users[0].id;
				log(`Found user ${userId} with customer ID ${customerId}`);

				// Update subscription status based on the Stripe status
				log(`Updating subscription status to '${subscription.status}' for user ${userId}`);
				const { error: updateError } = await supabase
					.from('profiles')
					.update({
						subscription_status: subscription.status,
						updated_at: new Date().toISOString(),
					})
					.eq('id', userId);

				if (updateError) {
					log('Error updating subscription status:', updateError);
				} else {
					log(`Successfully updated subscription status for user ${userId}`);
				}
				break;
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object;
				log('Subscription deleted:', {
					subscriptionId: subscription.id,
					customerId: subscription.customer
				});

				const customerId = subscription.customer;

				// Find the user with this customer ID
				log(`Finding user with Stripe customer ID: ${customerId}`);
				const { data: users, error } = await supabase
					.from('profiles')
					.select('id')
					.eq('stripe_customer_id', customerId);

				if (error) {
					log('Error finding user by customer ID:', error);
					break;
				}

				if (!users || users.length === 0) {
					log(`No user found with Stripe customer ID: ${customerId}`);
					break;
				}

				const userId = users[0].id;
				log(`Found user ${userId} with customer ID ${customerId}`);

				// Update the user's subscription status
				log(`Setting subscription status to 'canceled' for user ${userId}`);
				const { error: updateError } = await supabase
					.from('profiles')
					.update({
						subscription_status: 'canceled',
						updated_at: new Date().toISOString(),
					})
					.eq('id', userId);

				if (updateError) {
					log('Error updating subscription status:', updateError);
				} else {
					log(`Successfully canceled subscription for user ${userId}`);
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