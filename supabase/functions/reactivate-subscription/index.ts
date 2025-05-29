
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

serve(async (req) => {
	// Log incoming request
	log(`Received ${req.method} request to ${req.url}`);

	// Handle CORS preflight request
	if (req.method === 'OPTIONS') {
		log('Handling CORS preflight request');
		return new Response('ok', { headers: corsHeaders });
	}

	try {
		const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
		if (!stripeKey) {
			log('ERROR: STRIPE_SECRET_KEY is not set');
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
		});

		// Initialize Supabase client with service role key
		const supabase = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
		);

		// Get user from authorization header
		const authHeader = req.headers.get('Authorization');
		if (!authHeader) {
			log('Error: No authorization header provided');
			return new Response(
				JSON.stringify({ error: 'No authorization header provided' }),
				{
					status: 401,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		const token = authHeader.replace('Bearer ', '');
		const { data: userData, error: userError } = await supabase.auth.getUser(token);
		if (userError || !userData.user) {
			log('Error: Invalid user token');
			return new Response(
				JSON.stringify({ error: 'Invalid user token' }),
				{
					status: 401,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		const user = userData.user;
		log('User authenticated', { userId: user.id, email: user.email });

		// Get user's profile to find Stripe subscription ID
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('stripe_subscription_id, stripe_customer_id, subscription_plan')
			.eq('id', user.id)
			.single();

		if (profileError) {
			log('Error fetching profile:', profileError);
			return new Response(
				JSON.stringify({ error: 'Failed to fetch user profile' }),
				{
					status: 500,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Check if user has any subscription data
		if (!profile?.stripe_subscription_id && !profile?.stripe_customer_id) {
			log('No Stripe data found for user - redirecting to create new subscription');
			return new Response(
				JSON.stringify({ 
					error: 'No previous subscription found',
					action: 'create_new',
					message: 'It looks like you don\'t have a previous subscription. Please create a new subscription instead.'
				}),
				{
					status: 404,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// If we have a customer ID but no subscription ID, check for any subscriptions
		if (profile.stripe_customer_id && !profile.stripe_subscription_id) {
			log('Found customer ID but no subscription ID, checking for existing subscriptions');
			
			try {
				const subscriptions = await stripe.subscriptions.list({
					customer: profile.stripe_customer_id,
					limit: 10
				});

				if (subscriptions.data.length === 0) {
					log('No subscriptions found for customer');
					return new Response(
						JSON.stringify({ 
							error: 'No subscription found for this customer',
							action: 'create_new',
							message: 'No previous subscription found. Please create a new subscription.'
						}),
						{
							status: 404,
							headers: { ...corsHeaders, 'Content-Type': 'application/json' },
						}
					);
				}

				// Find the most recent subscription
				const latestSubscription = subscriptions.data[0];
				log('Found subscription for customer', { subscriptionId: latestSubscription.id, status: latestSubscription.status });

				// Update profile with found subscription ID
				await supabase
					.from('profiles')
					.update({
						stripe_subscription_id: latestSubscription.id,
						updated_at: new Date().toISOString(),
					})
					.eq('id', user.id);

				// Use this subscription for reactivation
				profile.stripe_subscription_id = latestSubscription.id;
			} catch (stripeError) {
				log('Error checking customer subscriptions:', stripeError);
				return new Response(
					JSON.stringify({ 
						error: 'Failed to check subscription status',
						message: 'Unable to verify your subscription. Please contact support.'
					}),
					{
						status: 500,
						headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					}
				);
			}
		}

		if (!profile.stripe_subscription_id) {
			log('Still no subscription ID after checks');
			return new Response(
				JSON.stringify({ 
					error: 'No subscription found',
					action: 'create_new',
					message: 'Unable to find a subscription to reactivate. Please create a new subscription.'
				}),
				{
					status: 404,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		log('Found subscription', { subscriptionId: profile.stripe_subscription_id });

		// Get current subscription status
		let subscription;
		try {
			subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
			log('Current subscription status', { id: subscription.id, status: subscription.status });
		} catch (stripeError) {
			log('Error retrieving subscription:', stripeError);
			return new Response(
				JSON.stringify({ 
					error: 'Subscription not found in Stripe',
					action: 'create_new',
					message: 'Your previous subscription is no longer available. Please create a new subscription.'
				}),
				{
					status: 404,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Check if subscription is already active
		if (subscription.status === 'active') {
			log('Subscription is already active');
			return new Response(
				JSON.stringify({ 
					success: true,
					subscription_status: 'active',
					message: 'Your subscription is already active!'
				}),
				{
					status: 200,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Check if subscription can be reactivated
		if (!['canceled', 'past_due', 'unpaid'].includes(subscription.status)) {
			log('Subscription cannot be reactivated', { status: subscription.status });
			return new Response(
				JSON.stringify({ 
					error: 'Subscription cannot be reactivated',
					message: `Subscription status "${subscription.status}" cannot be reactivated. Please contact support.`
				}),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Reactivate the subscription in Stripe
		log('Attempting to reactivate subscription');
		const updatedSubscription = await stripe.subscriptions.update(profile.stripe_subscription_id, {
			cancel_at_period_end: false,
		});

		log('Subscription reactivated', { subscriptionId: updatedSubscription.id, status: updatedSubscription.status });

		// Update the subscription status in the database
		const { error: updateError } = await supabase
			.from('profiles')
			.update({
				subscription_status: updatedSubscription.status,
				subscription_start_date: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
				subscription_end_date: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq('id', user.id);

		if (updateError) {
			log('Error updating subscription status:', updateError);
		} else {
			log('Successfully updated subscription status in database');
		}

		return new Response(
			JSON.stringify({ 
				success: true,
				subscription_status: updatedSubscription.status,
				message: 'Your subscription has been successfully reactivated!'
			}),
			{
				status: 200,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);

	} catch (error) {
		log('Unhandled error:', error);
		return new Response(
			JSON.stringify({
				error: 'Server error',
				message: 'An unexpected error occurred. Please try again or contact support.',
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});
