
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
		// Validate method
		if (req.method !== 'POST') {
			log(`Method ${req.method} not allowed`);
			return new Response(
				JSON.stringify({ error: 'Method not allowed' }),
				{
					status: 405,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

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
			log('Error: Invalid user token', userError);
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

		// Get user's profile to check current subscription status
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', user.id)
			.single();

		if (profileError || !profile) {
			log('Error: No profile found for user');
			return new Response(
				JSON.stringify({ error: 'No profile found' }),
				{
					status: 404,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		log('User profile found', {
			subscriptionStatus: profile.subscription_status,
			subscriptionPlan: profile.subscription_plan,
			stripeCustomerId: profile.stripe_customer_id,
			stripeSubscriptionId: profile.stripe_subscription_id
		});

		// If user has a Stripe subscription ID, check if it's actually active in Stripe
		if (profile.stripe_subscription_id) {
			try {
				const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
				log('Retrieved Stripe subscription', {
					id: subscription.id,
					status: subscription.status,
					currentPeriodEnd: subscription.current_period_end
				});

				if (subscription.status === 'active') {
					// Subscription is active in Stripe, update our database
					const subscriptionStartDate = new Date(subscription.current_period_start * 1000).toISOString();
					const subscriptionEndDate = new Date(subscription.current_period_end * 1000).toISOString();

					const { error: updateError } = await supabase
						.from('profiles')
						.update({
							subscription_status: 'active',
							subscription_start_date: subscriptionStartDate,
							subscription_end_date: subscriptionEndDate,
							updated_at: new Date().toISOString(),
						})
						.eq('id', user.id);

					if (updateError) {
						log('Error updating subscription status:', updateError);
						return new Response(
							JSON.stringify({ error: 'Failed to update subscription status' }),
							{
								status: 500,
								headers: { ...corsHeaders, 'Content-Type': 'application/json' },
							}
						);
					}

					log('Successfully reactivated subscription');
					return new Response(
						JSON.stringify({
							success: true,
							message: 'Your subscription has been reactivated successfully!'
						}),
						{
							status: 200,
							headers: { ...corsHeaders, 'Content-Type': 'application/json' },
						}
					);
				}
			} catch (stripeError) {
				log('Error retrieving subscription from Stripe:', stripeError);
			}
		}

		// If we get here, the subscription is not active
		return new Response(
			JSON.stringify({
				error: 'No active subscription found',
				action: 'create_new',
				message: 'No active subscription found. Please create a new subscription.'
			}),
			{
				status: 404,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);

	} catch (error) {
		log('Unhandled error:', error);
		return new Response(
			JSON.stringify({
				error: 'Server error',
				message: error.message,
				details: error.stack
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});
