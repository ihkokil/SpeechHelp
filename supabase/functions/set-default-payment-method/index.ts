
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
			httpClient: Stripe.createFetchHttpClient(),
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

		// Get the payment method ID from the request body
		const { paymentMethodId } = await req.json();
		if (!paymentMethodId) {
			log('Error: No payment method ID provided');
			return new Response(
				JSON.stringify({ error: 'Payment method ID is required' }),
				{
					status: 400,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		// Get user's profile to find Stripe customer ID
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('stripe_customer_id')
			.eq('id', user.id)
			.single();

		if (profileError || !profile?.stripe_customer_id) {
			log('No Stripe customer found for user');
			return new Response(
				JSON.stringify({ error: 'No Stripe customer found' }),
				{
					status: 404,
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				}
			);
		}

		log('Found Stripe customer', { customerId: profile.stripe_customer_id });

		// Set the payment method as the default for the customer
		await stripe.customers.update(profile.stripe_customer_id, {
			invoice_settings: {
				default_payment_method: paymentMethodId,
			},
		});

		log('Successfully set default payment method', { paymentMethodId });

		return new Response(
			JSON.stringify({ success: true }),
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
				stack: Deno.env.get('NODE_ENV') === 'production' ? undefined : error.stack
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});
