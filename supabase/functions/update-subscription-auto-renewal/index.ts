
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

		// Parse request body
		let requestBody;
		try {
			requestBody = await req.json();
		} catch (parseError) {
			log('Error parsing request body:', parseError);
			return new Response(
				JSON.stringify({ error: 'Invalid JSON in request body' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		const { autoRenew } = requestBody;

		if (typeof autoRenew !== 'boolean') {
			log('Error: Invalid autoRenew value');
			return new Response(
				JSON.stringify({ error: 'autoRenew must be a boolean value' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		log('Request data', { autoRenew });

		// Get user's subscription information
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('stripe_subscription_id')
			.eq('id', user.id)
			.single();

		if (profileError || !profile?.stripe_subscription_id) {
			log('Error: No active subscription found for user');
			return new Response(
				JSON.stringify({ error: 'No active subscription found' }),
				{
					status: 404,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		log('Found subscription', { subscriptionId: profile.stripe_subscription_id });

		// Update the subscription's auto-renewal setting in Stripe
		const subscription = await stripe.subscriptions.update(profile.stripe_subscription_id, {
			cancel_at_period_end: !autoRenew, // If autoRenew is false, cancel at period end
		});

		log('Updated subscription auto-renewal', { 
			subscriptionId: subscription.id,
			cancelAtPeriodEnd: subscription.cancel_at_period_end,
			autoRenew: autoRenew 
		});

		// Update the subscription status in our database if necessary
		const subscriptionStatus = subscription.cancel_at_period_end ? 'will_cancel' : 'active';
		
		const { error: updateError } = await supabase
			.from('profiles')
			.update({
				subscription_status: subscriptionStatus,
				updated_at: new Date().toISOString(),
			})
			.eq('id', user.id);

		if (updateError) {
			log('Error updating subscription status:', updateError);
		} else {
			log('Successfully updated subscription status');
		}

		return new Response(
			JSON.stringify({ 
				success: true,
				message: `Auto-renewal has been ${autoRenew ? 'enabled' : 'disabled'}.`,
				autoRenew: autoRenew,
				subscriptionStatus: subscriptionStatus
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
